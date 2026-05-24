import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Platform } from '../models/SocialAccount'
import { HttpError } from '@/shared/infra/http/HttpError'

export const initOAuthConnection = createAppAsyncThunk<void, Platform>(
  'socialAccounts/initOAuth',
  async (platform, { extra, rejectWithValue }) => {
    try {
      const url = await extra.socialAccountGateway.getConnectUrl(platform)
      window.location.href = url
      return
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to initiate OAuth connection' })
    }
  },
)
