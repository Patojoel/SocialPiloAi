import type { CreatePostFormValues } from '../validation/postSchema'
import type { Platform } from '../../models/Post'

interface CreatePostCommand {
  content: string
  platforms: Platform[]
  mediaIds: string[]
  scheduledAt: string | null
}

interface SchedulePostCommand {
  scheduledAt: string
}

export const PostCommandFactory = {
  buildCreateCommand(values: CreatePostFormValues): CreatePostCommand {
    return {
      content: values.content,
      platforms: values.platforms as Platform[],
      mediaIds: values.mediaIds,
      scheduledAt: values.scheduledAt ?? null,
    }
  },

  buildScheduleCommand(values: CreatePostFormValues): SchedulePostCommand {
    if (!values.scheduledAt) throw new Error('scheduledAt is required for scheduling')
    return { scheduledAt: values.scheduledAt }
  },
}
