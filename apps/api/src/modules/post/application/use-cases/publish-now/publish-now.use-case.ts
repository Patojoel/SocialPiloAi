import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository } from '../../../domain/repositories/post.repository'
import { PUBLISH_POST_QUEUE_PORT, type PublishPostQueuePort } from '../../../domain/ports/publish-post-queue.port'
import type { Post } from '../../../domain/entities/post.entity'

@Injectable()
export class PublishNowUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
    @Inject(PUBLISH_POST_QUEUE_PORT)
    private readonly publishQueue: PublishPostQueuePort,
  ) {}

  async execute(id: string, workspaceId: string): Promise<Post> {
    const post = await this.postRepo.findById(id)
    if (!post) throw new NotFoundException(`Post ${id} not found`)
    if (post.workspaceId !== workspaceId) throw new ForbiddenException('Access denied')
    if (post.status === 'publishing' || post.status === 'published') {
      throw new BadRequestException(`Post is already ${post.status}`)
    }

    const updated = await this.postRepo.update(id, { status: 'publishing' })
    await this.publishQueue.addImmediateJob(id)
    return updated
  }
}
