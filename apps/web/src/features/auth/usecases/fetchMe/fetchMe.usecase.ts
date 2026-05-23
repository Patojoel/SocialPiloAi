import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { User } from '../../models/Auth'
import { HttpError } from '@/shared/infra/http/HttpError'

export const fetchMe = createAppAsyncThunk<User, void>(
  'auth/fetchMe',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.authGateway.me()
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to fetch user' })
    }
  },
)
