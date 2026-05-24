import type { SocialAccount, Platform } from '../entities/social-account.entity'

export interface SocialAccountRepository {
  findAll(workspaceId: string): Promise<SocialAccount[]>
  findById(id: string): Promise<SocialAccount | null>
  findByWorkspaceAndPlatform(workspaceId: string, platform: Platform): Promise<SocialAccount[]>
  save(account: Omit<SocialAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialAccount>
  update(id: string, data: Partial<SocialAccount>): Promise<SocialAccount>
  delete(id: string): Promise<void>
}

export const SOCIAL_ACCOUNT_REPOSITORY = Symbol('SocialAccountRepository')
