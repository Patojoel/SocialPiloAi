export type Platform = 'facebook' | 'instagram' | 'tiktok'
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'

export interface Post {
  id: string
  workspaceId: string
  content: string
  platforms: Platform[]
  status: PostStatus
  mediaIds: string[]
  scheduledAt: Date | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
