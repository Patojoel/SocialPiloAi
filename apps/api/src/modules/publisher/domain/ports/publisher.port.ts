import type { Post } from '../../../post/domain/entities/post.entity'

export interface ExternalPostResult {
  externalId: string | null
  status: 'published' | 'failed'
  errorMessage: string | null
}

export interface PublisherPort {
  publish(post: Post, accessToken: string): Promise<ExternalPostResult>
}

export const FACEBOOK_PUBLISHER = Symbol('FacebookPublisher')
export const INSTAGRAM_PUBLISHER = Symbol('InstagramPublisher')
export const TIKTOK_PUBLISHER = Symbol('TiktokPublisher')
