import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Post } from '../models/Post'
import { HttpError } from '@/shared/infra/http/HttpError'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const pollPostStatus = createAppAsyncThunk<Post, string>(
  'posts/pollStatus',
  async (id, { extra, rejectWithValue }) => {
    const maxAttempts = 10
    const intervalMs = 5000

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const post = await extra.postGateway.getById(id)
        if (post.status !== 'publishing') return post
        if (attempt < maxAttempts - 1) await sleep(intervalMs)
      } catch (err) {
        if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
        if (err instanceof Error) return rejectWithValue({ message: err.message })
        return rejectWithValue({ message: 'Failed to poll post status' })
      }
    }

    try {
      return await extra.postGateway.getById(id)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to poll post status' })
    }
  },
)
