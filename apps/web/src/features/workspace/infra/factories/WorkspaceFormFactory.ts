import type { Workspace } from '../../models/Workspace'
import type { CreateWorkspaceFormValues } from '../validation/workspaceSchema'

export class WorkspaceFormFactory {
  static buildFormValue(workspace?: Workspace): Partial<CreateWorkspaceFormValues> {
    if (!workspace) return { name: '' }
    return { name: workspace.name }
  }
}
