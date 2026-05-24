import type { Media } from '../entities/media.entity'

export interface MediaRepository {
  findAll(workspaceId: string, page: number, limit: number): Promise<{ items: Media[]; total: number }>
  findById(id: string): Promise<Media | null>
  save(media: Omit<Media, 'id' | 'createdAt'>): Promise<Media>
  delete(id: string): Promise<void>
}

export const MEDIA_REPOSITORY = Symbol('MediaRepository')
