import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Post } from '../models/Post'
import { HttpError } from '@/shared/infra/http/HttpError'

interface SchedulePostArgs {
  id: string
  scheduledAt: string
}

export const schedulePost = createAppAsyncThunk<Post, SchedulePostArgs>(
  'posts/schedule',
  async ({ id, scheduledAt }, { extra, rejectWithValue }) => {
    try {
      return await extra.postGateway.schedule(id, scheduledAt)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to schedule post' })
    }
  },
)
