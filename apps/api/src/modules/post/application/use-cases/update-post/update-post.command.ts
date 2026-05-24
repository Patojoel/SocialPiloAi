import type { Platform } from '../../../domain/entities/post.entity'

export interface UpdatePostCommand {
  id: string
  workspaceId: string
  content?: string
  platforms?: Platform[]
  mediaIds?: string[]
  scheduledAt?: Date | null
}
