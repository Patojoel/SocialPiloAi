import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Workspace } from '../../models/Workspace'
import type { UpdateWorkspaceCommand } from './updateWorkspace.command'
import { HttpError } from '@/shared/infra/http/HttpError'

export const updateWorkspace = createAppAsyncThunk<Workspace, UpdateWorkspaceCommand>(
  'workspaces/update',
  async (command, { extra, rejectWithValue }) => {
    try {
      const { id, ...payload } = command
      return await extra.workspaceGateway.update(id, payload)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to update workspace' })
    }
  },
)
