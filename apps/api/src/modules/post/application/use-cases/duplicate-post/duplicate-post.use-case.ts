import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository } from '../../../domain/repositories/post.repository'
import type { Post } from '../../../domain/entities/post.entity'

@Injectable()
export class DuplicatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
  ) {}

  async execute(id: string, workspaceId: string): Promise<Post> {
    const post = await this.postRepo.findById(id)
    if (!post) throw new NotFoundException(`Post ${id} not found`)
    if (post.workspaceId !== workspaceId) throw new ForbiddenException('Access denied')

    return this.postRepo.save({
      workspaceId: post.workspaceId,
      content: post.content,
      platforms: post.platforms,
      status: 'draft',
      mediaIds: post.mediaIds,
      scheduledAt: null,
      publishedAt: null,
    })
  }
}
