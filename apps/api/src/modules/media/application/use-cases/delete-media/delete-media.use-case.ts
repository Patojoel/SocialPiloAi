import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { MEDIA_REPOSITORY, type MediaRepository } from '../../../domain/repositories/media.repository'
import { STORAGE_PORT, type StoragePort } from '../../../infrastructure/storage/storage.port'

@Injectable()
export class DeleteMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepo: MediaRepository,
    @Inject(STORAGE_PORT)
    private readonly storage: StoragePort,
  ) {}

  async execute(id: string, workspaceId: string): Promise<void> {
    const media = await this.mediaRepo.findById(id)
    if (!media) throw new NotFoundException(`Media ${id} not found`)
    if (media.workspaceId !== workspaceId) throw new ForbiddenException('Access denied')

    await this.storage.delete(media.filename)
    await this.mediaRepo.delete(id)
  }
}
