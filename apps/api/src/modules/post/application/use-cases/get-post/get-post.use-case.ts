import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository } from '../../../domain/repositories/post.repository'
import { POST_RESULT_REPOSITORY, type PostResultRepository } from '../../../domain/repositories/post-result.repository'
import type { Post } from '../../../domain/entities/post.entity'
import type { PostResult } from '../../../domain/entities/post-result.entity'

interface GetPostResult {
  post: Post
  results: PostResult[]
}

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
    @Inject(POST_RESULT_REPOSITORY)
    private readonly postResultRepo: PostResultRepository,
  ) {}

  async execute(id: string, workspaceId: string): Promise<GetPostResult> {
    const post = await this.postRepo.findById(id)
    if (!post) throw new NotFoundException(`Post ${id} not found`)
    if (post.workspaceId !== workspaceId) throw new ForbiddenException('Access denied')
    const results = await this.postResultRepo.findByPostId(id)
    return { post, results }
  }
}
