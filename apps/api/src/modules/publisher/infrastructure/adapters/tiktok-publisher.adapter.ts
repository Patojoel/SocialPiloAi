import { Injectable, Logger } from '@nestjs/common'
import type { PublisherPort, ExternalPostResult } from '../../domain/ports/publisher.port'
import type { Post } from '../../../post/domain/entities/post.entity'

interface TiktokInitResponse {
  data: {
    publish_id: string
    upload_url?: string[]  // present for FILE_UPLOAD photos
  }
  error: { code: string; message: string; log_id: string }
}

@Injectable()
export class TiktokPublisherAdapter implements PublisherPort {
  private readonly logger = new Logger(TiktokPublisherAdapter.name)

  async publish(post: Post, accessToken: string, mediaUrls: string[]): Promise<ExternalPostResult> {
    if (!mediaUrls[0]) {
      return {
        externalId: null,
        status: 'failed',
        errorMessage: 'TikTok requires at least one image. Text-only posts are not supported.',
      }
    }
    this.logger.log(`Publishing post ${post.id} to TikTok`)
    return this.publishPhotoPost(post, accessToken, mediaUrls)
  }

  private async publishPhotoPost(post: Post, accessToken: string, imageUrls: string[]): Promise<ExternalPostResult> {
    // FILE_UPLOAD — no domain ownership required, TikTok gives us pre-signed PUT URLs
    const initBody = {
      post_info: {
        title: post.content.slice(0, 150),
        privacy_level: 'SELF_ONLY',
        photo_cover_index: 0,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        photo_images_count: imageUrls.length,
      },
      media_type: 'PHOTO',
      post_mode: 'DIRECT_POST',
    }

    this.logger.log(`TikTok init body: ${JSON.stringify(initBody)}`)

    const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/content/init/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(initBody),
    })

    const initText = await initRes.text()
    this.logger.log(`TikTok init response (${initRes.status}): ${initText}`)

    if (!initRes.ok) {
      return { externalId: null, status: 'failed', errorMessage: `TikTok init error: ${initText}` }
    }

    const initJson = JSON.parse(initText) as TiktokInitResponse

    if (initJson.error?.code && initJson.error.code !== 'ok') {
      this.logger.error(`TikTok publish init error: ${initJson.error.message}`)
      return { externalId: null, status: 'failed', errorMessage: initJson.error.message }
    }

    const { publish_id, upload_url: uploadUrls } = initJson.data

    if (!uploadUrls || uploadUrls.length === 0) {
      this.logger.error(`TikTok did not return upload_url. Full response: ${initText}`)
      return { externalId: null, status: 'failed', errorMessage: 'TikTok did not return upload URLs for FILE_UPLOAD' }
    }

    // Upload each image binary to the pre-signed TikTok URL
    for (let i = 0; i < imageUrls.length; i++) {
      const cloudinaryUrl = imageUrls[i] as string
      const targetUrl = (uploadUrls[i] ?? uploadUrls[0]) as string

      this.logger.log(`Downloading image ${i + 1} from Cloudinary: ${cloudinaryUrl}`)
      const imgRes = await fetch(cloudinaryUrl)
      if (!imgRes.ok) {
        return {
          externalId: null,
          status: 'failed',
          errorMessage: `Failed to fetch image from Cloudinary (${imgRes.status}): ${cloudinaryUrl}`,
        }
      }

      const imgBuffer = await imgRes.arrayBuffer()
      const imgSize = imgBuffer.byteLength
      const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg'

      this.logger.log(`Uploading image ${i + 1} (${imgSize} bytes, ${contentType}) to TikTok`)

      const uploadRes = await fetch(targetUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          'Content-Range': `bytes 0-${imgSize - 1}/${imgSize}`,
        },
        body: imgBuffer,
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.text()
        this.logger.error(`TikTok image upload failed (${uploadRes.status}): ${err}`)
        return { externalId: null, status: 'failed', errorMessage: `TikTok upload error: ${err}` }
      }

      this.logger.log(`Image ${i + 1}/${imageUrls.length} uploaded successfully`)
    }

    this.logger.log(`TikTok publish_id: ${publish_id} — post is processing`)
    return { externalId: publish_id, status: 'published', errorMessage: null }
  }
}
