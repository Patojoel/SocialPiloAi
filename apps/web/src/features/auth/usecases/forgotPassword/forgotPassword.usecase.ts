import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { ForgotPasswordCommand } from './forgotPassword.command'
import { HttpError } from '@/shared/infra/http/HttpError'

export const forgotPassword = createAppAsyncThunk<void, ForgotPasswordCommand>(
  'auth/forgotPassword',
  async (command, { extra, rejectWithValue }) => {
    try {
      await extra.authGateway.forgotPassword(command.email)
      return
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to send reset email' })
    }
  },
)
