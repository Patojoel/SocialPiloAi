import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository } from '../../../domain/repositories/post.repository'
import { PUBLISH_POST_QUEUE_PORT, type PublishPostQueuePort } from '../../../domain/ports/publish-post-queue.port'
import type { SchedulePostCommand } from './schedule-post.command'
import type { Post } from '../../../domain/entities/post.entity'

@Injectable()
export class SchedulePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
    @Inject(PUBLISH_POST_QUEUE_PORT)
    private readonly publishQueue: PublishPostQueuePort,
  ) {}

  async execute(command: SchedulePostCommand): Promise<Post> {
    const post = await this.postRepo.findById(command.id)
    if (!post) throw new NotFoundException(`Post ${command.id} not found`)
    if (post.workspaceId !== command.workspaceId) throw new ForbiddenException('Access denied')
    if (command.scheduledAt <= new Date()) {
      throw new BadRequestException('scheduledAt must be in the future')
    }
    if (post.status !== 'draft' && post.status !== 'scheduled') {
      throw new BadRequestException(`Cannot schedule post with status: ${post.status}`)
    }

    const updated = await this.postRepo.update(command.id, {
      status: 'scheduled',
      scheduledAt: command.scheduledAt,
    })
    await this.publishQueue.addDelayedJob(command.id, command.scheduledAt)
    return updated
  }
}
