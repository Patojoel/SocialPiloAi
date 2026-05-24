export type Platform = 'facebook' | 'instagram' | 'tiktok'
export type ConnectionStatus = 'active' | 'expired' | 'revoked'

export interface SocialAccount {
  id: string
  workspaceId: string
  platform: Platform
  accountId: string
  accountName: string
  accessTokenEncrypted: string
  expiresAt: Date | null
  status: ConnectionStatus
  createdAt: Date
  updatedAt: Date
}
