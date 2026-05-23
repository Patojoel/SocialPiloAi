import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import { getRefreshToken, clearSession } from '../../infra/tokenStorage'

export const logout = createAppAsyncThunk<void, void>(
  'auth/logout',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      const token = getRefreshToken()
      if (token) await extra.authGateway.logout(token)
      clearSession()
    } catch (err) {
      clearSession()
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Logout failed' })
    }
  },
)
