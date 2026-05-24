import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { CreateWorkspaceCommand } from './createWorkspace.command'
import type { CreateWorkspaceResponse } from './createWorkspace.response'
import { HttpError } from '@/shared/infra/http/HttpError'

export const createWorkspace = createAppAsyncThunk<CreateWorkspaceResponse, CreateWorkspaceCommand>(
  'workspaces/create',
  async (command, { extra, rejectWithValue }) => {
    try {
      return await extra.workspaceGateway.create(command)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to create workspace' })
    }
  },
)
