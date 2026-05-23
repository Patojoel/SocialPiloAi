import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { LoginCommand } from './login.command'
import type { LoginResponse } from './login.response'
import { setTokens } from '../../infra/tokenStorage'
import { HttpError } from '@/shared/infra/http/HttpError'

export const login = createAppAsyncThunk<LoginResponse, LoginCommand>(
  'auth/login',
  async (command, { extra, rejectWithValue }) => {
    try {
      const result = await extra.authGateway.login(command)
      setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken })
      return result
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Login failed' })
    }
  },
)
