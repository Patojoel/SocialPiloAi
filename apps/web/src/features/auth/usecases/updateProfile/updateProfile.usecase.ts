import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { User } from '../../models/Auth'
import type { UpdateProfileCommand } from './updateProfile.command'
import { HttpError } from '@/shared/infra/http/HttpError'

export const updateProfile = createAppAsyncThunk<User, UpdateProfileCommand>(
  'auth/updateProfile',
  async (command, { extra, rejectWithValue }) => {
    try {
      return await extra.authGateway.updateProfile(command)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to update profile' })
    }
  },
)
