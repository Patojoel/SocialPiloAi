import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Post, PostStatus, Platform } from '../models/Post'
import type { Paginated } from '@/shared/models/Paginated'
import { HttpError } from '@/shared/infra/http/HttpError'

interface ListPostsArgs {
  page: number
  limit: number
  status?: PostStatus
  platform?: Platform
}

export const listPosts = createAppAsyncThunk<Paginated<Post>, ListPostsArgs>(
  'posts/list',
  async (query, { extra, rejectWithValue }) => {
    try {
      return await extra.postGateway.list(query)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to load posts' })
    }
  },
)
