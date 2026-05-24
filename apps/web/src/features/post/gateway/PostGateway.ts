import type { Post, PostStatus, Platform } from '../models/Post'
import type { Paginated } from '@/shared/models/Paginated'

export interface PostGateway {
  list(query: { page: number; limit: number; status?: PostStatus; platform?: Platform }): Promise<Paginated<Post>>
  getById(id: string): Promise<Post>
  create(payload: { content: string; platforms: Platform[]; mediaIds: string[]; scheduledAt: string | null }): Promise<Post>
  update(id: string, payload: Partial<{ content: string; platforms: Platform[]; scheduledAt: string | null }>): Promise<Post>
  delete(id: string): Promise<void>
  publishNow(id: string): Promise<Post>
  schedule(id: string, scheduledAt: string): Promise<Post>
  duplicate(id: string): Promise<Post>
}
