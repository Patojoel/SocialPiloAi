import type { CreateWorkspaceFormValues } from '../validation/workspaceSchema'
import type { CreateWorkspaceCommand } from '../../usecases/createWorkspace/createWorkspace.command'

export class WorkspaceCommandFactory {
  static buildCommand(data: CreateWorkspaceFormValues): CreateWorkspaceCommand {
    return {
      name: data.name,
      ...(data.slug && { slug: data.slug }),
    }
  }
}
