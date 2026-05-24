import { Injectable, Inject } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository } from '../../../domain/repositories/post.repository'
import type { CreatePostCommand } from './create-post.command'
import type { Post } from '../../../domain/entities/post.entity'

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<Post> {
    const status = command.scheduledAt ? 'scheduled' : 'draft'
    return this.postRepo.save({
      workspaceId: command.workspaceId,
      content: command.content,
      platforms: command.platforms,
      status,
      mediaIds: command.mediaIds ?? [],
      scheduledAt: command.scheduledAt ?? null,
      publishedAt: null,
    })
  }
}
