import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { SocialAccount } from '../models/SocialAccount'
import { HttpError } from '@/shared/infra/http/HttpError'

export const listSocialAccounts = createAppAsyncThunk<SocialAccount[], void>(
  'socialAccounts/list',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.socialAccountGateway.list()
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to list social accounts' })
    }
  },
)
