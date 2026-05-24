import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { POST_REPOSITORY, type PostRepository } from '../../../domain/repositories/post.repository'

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
  ) {}

  async execute(id: string, workspaceId: string): Promise<void> {
    const post = await this.postRepo.findById(id)
    if (!post) throw new NotFoundException(`Post ${id} not found`)
    if (post.workspaceId !== workspaceId) throw new ForbiddenException('Access denied')
    await this.postRepo.delete(id)
  }
}
