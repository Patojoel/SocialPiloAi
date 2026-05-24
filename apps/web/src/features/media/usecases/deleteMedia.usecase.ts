import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import { HttpError } from '@/shared/infra/http/HttpError'

export const deleteMedia = createAppAsyncThunk<string, string>(
  'media/delete',
  async (id, { extra, rejectWithValue }) => {
    try {
      await extra.mediaGateway.delete(id)
      return id
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to delete media' })
    }
  },
)
