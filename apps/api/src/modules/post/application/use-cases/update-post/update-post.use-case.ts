import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository } from '../../../domain/repositories/post.repository'
import type { UpdatePostCommand } from './update-post.command'
import type { Post } from '../../../domain/entities/post.entity'

const EDITABLE_STATUSES = ['draft', 'scheduled'] as const

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
  ) {}

  async execute(command: UpdatePostCommand): Promise<Post> {
    const post = await this.postRepo.findById(command.id)
    if (!post) throw new NotFoundException(`Post ${command.id} not found`)
    if (post.workspaceId !== command.workspaceId) throw new ForbiddenException('Access denied')
    if (!(EDITABLE_STATUSES as readonly string[]).includes(post.status)) {
      throw new BadRequestException(`Cannot update post with status: ${post.status}`)
    }

    const updates: Partial<Post> = {}
    if (command.content !== undefined) updates.content = command.content
    if (command.platforms !== undefined) updates.platforms = command.platforms
    if (command.mediaIds !== undefined) updates.mediaIds = command.mediaIds
    if (command.scheduledAt !== undefined) updates.scheduledAt = command.scheduledAt

    return this.postRepo.update(command.id, updates)
  }
}
