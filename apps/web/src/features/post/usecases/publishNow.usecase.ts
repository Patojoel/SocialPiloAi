import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Post } from '../models/Post'
import { HttpError } from '@/shared/infra/http/HttpError'

export const publishNow = createAppAsyncThunk<Post, string>(
  'posts/publishNow',
  async (id, { extra, rejectWithValue }) => {
    try {
      return await extra.postGateway.publishNow(id)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to publish post' })
    }
  },
)
