import type { Post, PostStatus, Platform } from '../entities/post.entity'

export interface ListPostsFilters {
  status?: PostStatus
  platform?: Platform
  search?: string
}

export interface PostRepository {
  findAllByWorkspace(
    workspaceId: string,
    page: number,
    limit: number,
    filters?: ListPostsFilters,
  ): Promise<{ items: Post[]; total: number }>
  findById(id: string): Promise<Post | null>
  save(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>
  update(id: string, data: Partial<Post>): Promise<Post>
  delete(id: string): Promise<void>
}

export const POST_REPOSITORY = Symbol('PostRepository')
