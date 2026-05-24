export type WorkspaceRole = 'owner' | 'admin' | 'member'

export interface WorkspaceDto {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceMemberDto {
  id: string
  workspaceId: string
  userId: string
  role: WorkspaceRole
  joinedAt: string
}
