import { Injectable, Inject } from '@nestjs/common'
import { MEDIA_REPOSITORY, type MediaRepository } from '../../../domain/repositories/media.repository'
import type { Media } from '../../../domain/entities/media.entity'

interface ListMediaResult {
  items: Media[]
  total: number
  page: number
  limit: number
  totalPages: number
}

@Injectable()
export class ListMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepo: MediaRepository,
  ) {}

  async execute(workspaceId: string, page: number, limit: number): Promise<ListMediaResult> {
    const { items, total } = await this.mediaRepo.findAll(workspaceId, page, limit)
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}
