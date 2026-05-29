import { Injectable, Logger } from '@nestjs/common'
import type { PublisherPort, ExternalPostResult } from '../../domain/ports/publisher.port'
import type { Post } from '../../../post/domain/entities/post.entity'

interface IgContainerResponse {
  id: string
}

interface IgPublishResponse {
  id: string
}

interface IgErrorResponse {
  error: { message: string }
}

@Injectable()
export class InstagramPublisherAdapter implements PublisherPort {
  private readonly logger = new Logger(InstagramPublisherAdapter.name)

  async publish(post: Post, accessToken: string, mediaUrls: string[]): Promise<ExternalPostResult> {
    // The accessToken stored for Instagram is the Page Access Token.
    // We need the Instagram Business Account ID linked to that page.
    const igUserId = await this.getIgUserId(accessToken)
    if (!igUserId) {
      return {
        externalId: null,
        status: 'failed',
        errorMessage: 'No Instagram Business Account linked to the connected Facebook Page.',
      }
    }

    this.logger.log(`Publishing post ${post.id} to Instagram account ${igUserId}`)

    const imageUrl = mediaUrls[0]

    if (!imageUrl) {
      // Instagram requires at least one media item — text-only posts are not supported
      return {
        externalId: null,
        status: 'failed',
        errorMessage: 'Instagram requires at least one image or video. Text-only posts are not supported.',
      }
    }

    // Step 1 — Create media container
    const containerId = await this.createContainer(igUserId, accessToken, imageUrl, post.content)
    if (!containerId) {
      return { externalId: null, status: 'failed', errorMessage: 'Failed to create Instagram media container.' }
    }

    // Step 2 — Publish the container
    return this.publishContainer(igUserId, accessToken, containerId)
  }

  private async getIgUserId(pageAccessToken: string): Promise<string | null> {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=instagram_business_account&access_token=${pageAccessToken}`,
    )
    if (!res.ok) return null
    const json = await res.json() as { instagram_business_account?: { id: string } }
    return json.instagram_business_account?.id ?? null
  }

  private async createContainer(
    igUserId: string,
    pageAccessToken: string,
    imageUrl: string,
    caption: string,
  ): Promise<string | null> {
    const body = new URLSearchParams({
      image_url: imageUrl,
      caption,
      access_token: pageAccessToken,
    })

    const res = await fetch(`https://graph.facebook.com/v18.0/${igUserId}/media`, {
      method: 'POST',
      body,
    })

    if (!res.ok) {
      const err = await res.json() as IgErrorResponse
      this.logger.error(`Instagram container creation failed: ${err.error?.message ?? JSON.stringify(err)}`)
      return null
    }

    const json = await res.json() as IgContainerResponse
    return json.id
  }

  private async publishContainer(
    igUserId: string,
    pageAccessToken: string,
    creationId: string,
  ): Promise<ExternalPostResult> {
    const body = new URLSearchParams({
      creation_id: creationId,
      access_token: pageAccessToken,
    })

    const res = await fetch(`https://graph.facebook.com/v18.0/${igUserId}/media_publish`, {
      method: 'POST',
      body,
    })

    if (!res.ok) {
      const err = await res.json() as IgErrorResponse
      const message = err.error?.message ?? 'Unknown error'
      this.logger.error(`Instagram publish failed: ${message}`)
      return { externalId: null, status: 'failed', errorMessage: `Instagram API error: ${message}` }
    }

    const json = await res.json() as IgPublishResponse
    this.logger.log(`Post published on Instagram. ID: ${json.id}`)
    return { externalId: json.id, status: 'published', errorMessage: null }
  }
}
