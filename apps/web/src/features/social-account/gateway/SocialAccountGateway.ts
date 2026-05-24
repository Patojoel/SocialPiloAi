import type { SocialAccount, Platform } from '../models/SocialAccount'

export interface SocialAccountGateway {
  list(): Promise<SocialAccount[]>
  disconnect(id: string): Promise<void>
  getConnectUrl(platform: Platform): Promise<string>
}
