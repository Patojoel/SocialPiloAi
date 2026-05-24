import type { SocialAccountGateway } from '../../gateway/SocialAccountGateway'
import type { HttpProvider } from '@/shared/infra/http/HttpProvider'
import type { SocialAccount, Platform } from '../../models/SocialAccount'
import { toCamelCase } from '@/shared/utils/caseTransform'

interface ApiSocialAccount {
  id: string
  workspace_id: string
  platform: Platform
  account_id: string
  account_name: string
  expires_at: string | null
  status: 'active' | 'expired' | 'revoked'
  created_at: string
}

export class HttpSocialAccountGateway implements SocialAccountGateway {
  constructor(private readonly http: HttpProvider) {}

  async list(): Promise<SocialAccount[]> {
    const res = await this.http.get<{ data: ApiSocialAccount[] }>('/social-accounts')
    return res.data.map((item) => toCamelCase<SocialAccount>(item))
  }

  async disconnect(id: string): Promise<void> {
    await this.http.delete(`/social-accounts/${id}`)
  }

  async getConnectUrl(platform: Platform): Promise<string> {
    const res = await this.http.get<{ data: { url: string } }>(`/social-accounts/connect/${platform}`)
    return res.data.url
  }
}
