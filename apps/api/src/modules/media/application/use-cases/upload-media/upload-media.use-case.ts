import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { MEDIA_REPOSITORY, type MediaRepository } from '../../../domain/repositories/media.repository'
import { STORAGE_PORT, type StoragePort } from '../../../infrastructure/storage/storage.port'
import type { Media, MediaType } from '../../../domain/entities/media.entity'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200MB

@Injectable()
export class UploadMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepo: MediaRepository,
    @Inject(STORAGE_PORT)
    private readonly storage: StoragePort,
  ) {}

  async execute(file: Express.Multer.File, workspaceId: string): Promise<Media> {
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype)

    if (!isImage && !isVideo) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed: ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(', ')}`,
      )
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024)
      throw new BadRequestException(`File too large. Maximum size for ${isImage ? 'images' : 'videos'} is ${maxMB}MB`)
    }

    const mediaType: MediaType = isImage ? 'image' : 'video'
    const { url, filename } = await this.storage.upload(file, workspaceId)

    return this.mediaRepo.save({
      workspaceId,
      url,
      filename,
      mimeType: file.mimetype,
      size: file.size,
      type: mediaType,
    })
  }
}
