export type Platform = 'facebook' | 'instagram' | 'tiktok'
export type ConnectionStatus = 'active' | 'expired' | 'revoked'

export interface SocialAccount {
  id: string
  workspaceId: string
  platform: Platform
  accountId: string
  accountName: string
  expiresAt: string | null
  status: ConnectionStatus
  createdAt: string
}
