export type WorkspaceRole = 'owner' | 'admin' | 'member'

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: WorkspaceRole
  joinedAt: Date
}
