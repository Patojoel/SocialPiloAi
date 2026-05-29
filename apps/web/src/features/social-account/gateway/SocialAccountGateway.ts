import type { SocialAccount, Platform } from '../models/SocialAccount'
import type { FacebookPage } from '../models/FacebookPage'

export interface SocialAccountGateway {
  list(): Promise<SocialAccount[]>
  disconnect(id: string): Promise<void>
  getConnectUrl(platform: Platform): Promise<string>
  getFacebookPages(accountId: string): Promise<FacebookPage[]>
}
