import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Media } from '../models/Media'
import { HttpError } from '@/shared/infra/http/HttpError'

export const uploadMedia = createAppAsyncThunk<Media, File>(
  'media/upload',
  async (file, { extra, rejectWithValue }) => {
    try {
      return await extra.mediaGateway.upload(file)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Upload failed' })
    }
  },
)
