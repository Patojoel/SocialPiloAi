import type { Platform } from './post.entity'

export type PublishStatus = 'pending' | 'published' | 'failed'

export interface PostResult {
  id: string
  postId: string
  platform: Platform
  externalId: string | null
  status: PublishStatus
  errorMessage: string | null
  createdAt: Date
}
