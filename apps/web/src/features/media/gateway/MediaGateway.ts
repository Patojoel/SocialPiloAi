import type { Media } from '../models/Media'
import type { Paginated } from '@/shared/models/Paginated'

export interface MediaGateway {
  upload(file: File): Promise<Media>
  list(page: number, limit: number): Promise<Paginated<Media>>
  delete(id: string): Promise<void>
}
