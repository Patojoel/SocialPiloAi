import { useAppDispatch, useAppSelector } from '@/config/hooks'
import {
  selectAllWorkspaces,
  selectCurrentWorkspace,
  selectIsWorkspacesPending,
} from '@/features/workspace/slices/workspaceSelectors'
import { switchWorkspace } from '@/features/workspace/usecases/switchWorkspace/switchWorkspace.usecase'

export const useWorkspaceList = () => {
  const dispatch = useAppDispatch()
  const workspaces = useAppSelector(selectAllWorkspaces)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const isPending = useAppSelector(selectIsWorkspacesPending)

  const handleSwitch = (id: string) => {
    dispatch(switchWorkspace(id))
  }

  return { workspaces, currentWorkspace, isPending, handleSwitch }
}
