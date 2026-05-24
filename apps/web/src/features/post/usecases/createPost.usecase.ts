import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Post, Platform } from '../models/Post'
import { HttpError } from '@/shared/infra/http/HttpError'

interface CreatePostArgs {
  content: string
  platforms: Platform[]
  mediaIds: string[]
  scheduledAt: string | null
}

export const createPost = createAppAsyncThunk<Post, CreatePostArgs>(
  'posts/create',
  async (payload, { extra, rejectWithValue }) => {
    try {
      return await extra.postGateway.create(payload)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to create post' })
    }
  },
)
