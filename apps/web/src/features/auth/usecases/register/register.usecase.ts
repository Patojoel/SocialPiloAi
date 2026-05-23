import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { RegisterCommand } from './register.command'
import type { RegisterResponse } from './register.response'
import { setTokens } from '../../infra/tokenStorage'
import { HttpError } from '@/shared/infra/http/HttpError'

export const register = createAppAsyncThunk<RegisterResponse, RegisterCommand>(
  'auth/register',
  async (command, { extra, rejectWithValue }) => {
    try {
      const result = await extra.authGateway.register(command)
      setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken })
      return result
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Registration failed' })
    }
  },
)
