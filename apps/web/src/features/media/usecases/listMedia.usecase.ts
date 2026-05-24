import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Media } from '../models/Media'
import type { Paginated } from '@/shared/models/Paginated'
import { HttpError } from '@/shared/infra/http/HttpError'

interface ListMediaArgs {
  page: number
  limit: number
}

export const listMedia = createAppAsyncThunk<Paginated<Media>, ListMediaArgs>(
  'media/list',
  async ({ page, limit }, { extra, rejectWithValue }) => {
    try {
      return await extra.mediaGateway.list(page, limit)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to load media' })
    }
  },
)
