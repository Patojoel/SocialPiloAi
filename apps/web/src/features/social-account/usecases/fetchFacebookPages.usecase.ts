import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { FacebookPage } from '../models/FacebookPage'
import { HttpError } from '@/shared/infra/http/HttpError'

export const fetchFacebookPages = createAppAsyncThunk<FacebookPage[], string>(
  'socialAccounts/fetchFacebookPages',
  async (accountId, { extra, rejectWithValue }) => {
    try {
      return await extra.socialAccountGateway.getFacebookPages(accountId)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to fetch Facebook pages' })
    }
  },
)
