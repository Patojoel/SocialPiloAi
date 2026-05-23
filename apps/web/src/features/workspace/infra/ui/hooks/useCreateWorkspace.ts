import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '@/config/hooks'
import { createWorkspace } from '@/features/workspace/usecases/createWorkspace/createWorkspace.usecase'
import { createWorkspaceSchema, type CreateWorkspaceFormValues } from '../validation/workspaceSchema'
import { WorkspaceCommandFactory } from '../factories/WorkspaceCommandFactory'

export const useCreateWorkspace = () => {
  const dispatch = useAppDispatch()

  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: '' },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    const command = WorkspaceCommandFactory.buildCommand(values)
    await dispatch(createWorkspace(command))
    form.reset()
  })

  return { form, handleSubmit }
}
