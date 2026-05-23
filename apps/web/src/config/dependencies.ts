import type { AuthGateway } from '@/features/auth/gateway/AuthGateway'
import type { WorkspaceGateway } from '@/features/workspace/gateway/WorkspaceGateway'

export interface Dependencies {
  authGateway: AuthGateway
  workspaceGateway: WorkspaceGateway
}
