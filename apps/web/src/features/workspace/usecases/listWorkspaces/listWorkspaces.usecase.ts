import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Workspace } from '../../models/Workspace'
import { HttpError } from '@/shared/infra/http/HttpError'

export const listWorkspaces = createAppAsyncThunk<Workspace[], void>(
  'workspaces/list',
  async (_arg, { extra, rejectWithValue }) => {
    try {
      return await extra.workspaceGateway.list()
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to list workspaces' })
    }
  },
)
