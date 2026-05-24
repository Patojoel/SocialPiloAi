import type { PostResult } from '../entities/post-result.entity'

export interface PostResultRepository {
  findByPostId(postId: string): Promise<PostResult[]>
  save(result: Omit<PostResult, 'id' | 'createdAt'>): Promise<PostResult>
  update(id: string, data: Partial<PostResult>): Promise<PostResult>
}

export const POST_RESULT_REPOSITORY = Symbol('PostResultRepository')
