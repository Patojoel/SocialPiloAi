import type { RootState } from '@/config/create-store'
import { workspaceAdapterSelectors } from './workspaceSlice'
import { LoadingState } from '@/shared/models/LoadingState'

const selectWorkspaceState = (state: RootState) => state.workspaces

export const selectAllWorkspaces = (state: RootState) =>
  workspaceAdapterSelectors.selectAll(selectWorkspaceState(state))

export const selectCurrentWorkspaceId = (state: RootState) => selectWorkspaceState(state).currentId

export const selectCurrentWorkspace = (state: RootState) => {
  const currentId = selectCurrentWorkspaceId(state)
  if (!currentId) return null
  return workspaceAdapterSelectors.selectById(selectWorkspaceState(state), currentId) ?? null
}

export const selectWorkspacesLoading = (state: RootState) => selectWorkspaceState(state).loading

export const selectWorkspacesError = (state: RootState) => selectWorkspaceState(state).error

export const selectIsWorkspacesPending = (state: RootState) =>
  selectWorkspaceState(state).loading === LoadingState.pending
