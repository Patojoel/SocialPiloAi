import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import { httpProvider } from '@/config/extraArgument'

export const switchWorkspace = createAppAsyncThunk<string, string>(
  'workspaces/switch',
  async (workspaceId, { rejectWithValue }) => {
    try {
      httpProvider.setWorkspaceId(workspaceId)
      return workspaceId
    } catch (err) {
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to switch workspace' })
    }
  },
)
