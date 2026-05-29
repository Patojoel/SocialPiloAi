import { Injectable, Logger } from '@nestjs/common'
import type { PublisherPort, ExternalPostResult } from '../../domain/ports/publisher.port'
import type { Post } from '../../../post/domain/entities/post.entity'

interface FbPage {
  id: string
  name: string
  access_token: string
}

interface FbAccountsResponse {
  data: FbPage[]
}

interface FbPhotoResponse {
  id: string
}

interface FbFeedResponse {
  id: string
}

@Injectable()
export class FacebookPublisherAdapter implements PublisherPort {
  private readonly logger = new Logger(FacebookPublisherAdapter.name)

  async publish(post: Post, accessToken: string, mediaUrls: string[]): Promise<ExternalPostResult> {
    // Fetch pages the user manages
    const accountsUrl = `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`
    const accountsRes = await fetch(accountsUrl)
    const accountsJson = await accountsRes.json() as FbAccountsResponse
    const pages = accountsJson.data ?? []

    const targetId = pages.length > 0 ? (pages[0] as FbPage).id : 'me'
    const pageToken = pages.length > 0 ? (pages[0] as FbPage).access_token : accessToken

    if (pages.length > 0) {
      this.logger.log(`Publishing post ${post.id} to Facebook Page "${(pages[0] as FbPage).name}" (${targetId})`)
    } else {
      this.logger.warn(`No Facebook pages found for post ${post.id}, posting to user feed`)
    }

    // Single image — use /photos endpoint (includes message + image in one call)
    if (mediaUrls.length === 1) {
      return this.postSinglePhoto(targetId, pageToken, post.content, mediaUrls[0] as string)
    }

    // Multiple images — upload each as unpublished, then attach to feed post
    if (mediaUrls.length > 1) {
      return this.postMultiplePhotos(targetId, pageToken, post.content, mediaUrls)
    }

    // Text only
    return this.postTextToFeed(targetId, pageToken, post.content)
  }

  private async postTextToFeed(targetId: string, pageToken: string, message: string): Promise<ExternalPostResult> {
    const body = new URLSearchParams({ message, access_token: pageToken })
    const res = await fetch(`https://graph.facebook.com/v18.0/${targetId}/feed`, {
      method: 'POST',
      body,
    })
    return this.handleFeedResponse(res)
  }

  private async postSinglePhoto(targetId: string, pageToken: string, message: string, imageUrl: string): Promise<ExternalPostResult> {
    const body = new URLSearchParams({
      url: imageUrl,
      message,
      access_token: pageToken,
    })
    const res = await fetch(`https://graph.facebook.com/v18.0/${targetId}/photos`, {
      method: 'POST',
      body,
    })
    return this.handleFeedResponse(res)
  }

  private async postMultiplePhotos(targetId: string, pageToken: string, message: string, imageUrls: string[]): Promise<ExternalPostResult> {
    // Upload each photo as unpublished to get their IDs
    const photoIds: string[] = []
    for (const url of imageUrls) {
      const body = new URLSearchParams({
        url,
        published: 'false',
        access_token: pageToken,
      })
      const res = await fetch(`https://graph.facebook.com/v18.0/${targetId}/photos`, {
        method: 'POST',
        body,
      })
      if (!res.ok) {
        const err = await res.text()
        this.logger.error(`Failed to upload photo: ${err}`)
        continue
      }
      const json = await res.json() as FbPhotoResponse
      photoIds.push(json.id)
    }

    if (photoIds.length === 0) {
      return this.postTextToFeed(targetId, pageToken, message)
    }

    // Post to feed with attached photos
    const attachedMedia = photoIds.map((id) => JSON.stringify({ media_fbid: id }))
    const body = new URLSearchParams({ message, access_token: pageToken })
    attachedMedia.forEach((m) => body.append('attached_media[]', m))

    const res = await fetch(`https://graph.facebook.com/v18.0/${targetId}/feed`, {
      method: 'POST',
      body,
    })
    return this.handleFeedResponse(res)
  }

  private async handleFeedResponse(res: Response): Promise<ExternalPostResult> {
    if (!res.ok) {
      const err = await res.text()
      this.logger.error(`Facebook Graph API error: ${err}`)
      return { externalId: null, status: 'failed', errorMessage: `Facebook API error: ${err}` }
    }
    const json = await res.json() as FbFeedResponse
    this.logger.log(`Published successfully. Facebook id: ${json.id}`)
    return { externalId: json.id, status: 'published', errorMessage: null }
  }
}
