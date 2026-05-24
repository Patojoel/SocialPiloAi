import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { ResetPasswordCommand } from './resetPassword.command'
import { HttpError } from '@/shared/infra/http/HttpError'

export const resetPassword = createAppAsyncThunk<void, ResetPasswordCommand>(
  'auth/resetPassword',
  async (command, { extra, rejectWithValue }) => {
    try {
      await extra.authGateway.resetPassword(command.token, command.password)
      return
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to reset password' })
    }
  },
)
