import type { AuthGateway } from '@/features/auth/gateway/AuthGateway'
import type { WorkspaceGateway } from '@/features/workspace/gateway/WorkspaceGateway'
import type { SocialAccountGateway } from '@/features/social-account/gateway/SocialAccountGateway'
import type { MediaGateway } from '@/features/media/gateway/MediaGateway'
import type { PostGateway } from '@/features/post/gateway/PostGateway'

export interface Dependencies {
  authGateway: AuthGateway
  workspaceGateway: WorkspaceGateway
  socialAccountGateway: SocialAccountGateway
  mediaGateway: MediaGateway
  postGateway: PostGateway
}
