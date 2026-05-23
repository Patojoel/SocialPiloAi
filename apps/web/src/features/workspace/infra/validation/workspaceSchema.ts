import { z } from 'zod'

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only')
    .max(50)
    .optional(),
})

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url().nullable().optional(),
})

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>
export type UpdateWorkspaceFormValues = z.infer<typeof updateWorkspaceSchema>
