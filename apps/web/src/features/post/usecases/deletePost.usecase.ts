import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import { HttpError } from '@/shared/infra/http/HttpError'

export const deletePost = createAppAsyncThunk<string, string>(
  'posts/delete',
  async (id, { extra, rejectWithValue }) => {
    try {
      await extra.postGateway.delete(id)
      return id
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to delete post' })
    }
  },
)
