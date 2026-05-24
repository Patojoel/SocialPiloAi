export type Platform = 'facebook' | 'instagram' | 'tiktok'
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'

export interface Post {
  id: string
  workspaceId: string
  content: string
  platforms: Platform[]
  status: PostStatus
  mediaIds: string[]
  scheduledAt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PostResult {
  id: string
  postId: string
  platform: Platform
  externalId: string | null
  status: 'pending' | 'published' | 'failed'
  errorMessage: string | null
  createdAt: string
}
