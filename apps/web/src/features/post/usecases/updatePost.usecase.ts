import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Post, Platform } from '../models/Post'
import { HttpError } from '@/shared/infra/http/HttpError'

interface UpdatePostArgs {
  id: string
  payload: Partial<{ content: string; platforms: Platform[]; scheduledAt: string | null }>
}

export const updatePost = createAppAsyncThunk<Post, UpdatePostArgs>(
  'posts/update',
  async ({ id, payload }, { extra, rejectWithValue }) => {
    try {
      return await extra.postGateway.update(id, payload)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to update post' })
    }
  },
)
