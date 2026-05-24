import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { LoadingState } from '@/shared/models/LoadingState'
import type { Workspace } from '../models/Workspace'
import { createWorkspace } from '../usecases/createWorkspace/createWorkspace.usecase'
import { listWorkspaces } from '../usecases/listWorkspaces/listWorkspaces.usecase'
import { updateWorkspace } from '../usecases/updateWorkspace/updateWorkspace.usecase'
import { deleteWorkspace } from '../usecases/deleteWorkspace/deleteWorkspace.usecase'
import { switchWorkspace } from '../usecases/switchWorkspace/switchWorkspace.usecase'

const workspaceAdapter = createEntityAdapter<Workspace>()

export interface WorkspaceState {
  loading: LoadingState
  error: string | null
  currentId: string | null
}

const initialState = workspaceAdapter.getInitialState<WorkspaceState>({
  loading: LoadingState.idle,
  error: null,
  currentId: null,
})

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setCurrentWorkspace(state, action: { payload: string }) {
      state.currentId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listWorkspaces.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(listWorkspaces.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        workspaceAdapter.setAll(state, action.payload)
        // Auto-select first workspace if none is currently active
        if (!state.currentId && action.payload.length > 0) {
          state.currentId = action.payload[0]!.id
        }
      })
      .addCase(listWorkspaces.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Failed to load workspaces'
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        workspaceAdapter.addOne(state, action.payload)
        state.currentId = action.payload.id
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        workspaceAdapter.updateOne(state, { id: action.payload.id, changes: action.payload })
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        workspaceAdapter.removeOne(state, action.payload)
        if (state.currentId === action.payload) {
          const remaining = Object.keys(state.entities)
          state.currentId = remaining.length > 0 ? (remaining[0] ?? null) : null
        }
      })
      .addCase(switchWorkspace.fulfilled, (state, action) => {
        state.currentId = action.payload
      })
  },
})

export const { setCurrentWorkspace } = workspaceSlice.actions
export const workspaceReducer = workspaceSlice.reducer
export const workspaceAdapterSelectors = workspaceAdapter.getSelectors()
