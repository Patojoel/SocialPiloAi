import { z } from 'zod'

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2200, 'Content must be 2200 characters or less'),
  platforms: z
    .array(z.enum(['facebook', 'instagram', 'tiktok']))
    .min(1, 'Select at least one platform'),
  mediaIds: z.array(z.string()).default([]),
  scheduledAt: z.string().nullable().optional(),
})

export type CreatePostFormValues = z.infer<typeof createPostSchema>

export const updatePostSchema = z.object({
  content: z.string().min(1).max(2200).optional(),
  platforms: z.array(z.enum(['facebook', 'instagram', 'tiktok'])).min(1).optional(),
  scheduledAt: z.string().nullable().optional(),
})

export type UpdatePostFormValues = z.infer<typeof updatePostSchema>
