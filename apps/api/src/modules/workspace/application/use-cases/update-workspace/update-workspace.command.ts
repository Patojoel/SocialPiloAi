export interface UpdateWorkspaceCommand {
  id: string
  userId: string
  name?: string
  logoUrl?: string | null
}
