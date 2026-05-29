import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { SOCIAL_ACCOUNT_REPOSITORY, type SocialAccountRepository } from '../../../domain/repositories/social-account.repository'
import { TokenCipherService } from '../../../infrastructure/crypto/token-cipher.service'

export interface FacebookPage {
  id: string
  name: string
  category: string
}

interface FbAccountsResponse {
  data: Array<{
    id: string
    name: string
    category: string
    access_token: string
    perms: string[]
  }>
}

@Injectable()
export class GetFacebookPagesUseCase {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepo: SocialAccountRepository,
    private readonly tokenCipher: TokenCipherService,
  ) {}

  async execute(accountId: string, workspaceId: string): Promise<FacebookPage[]> {
    const account = await this.socialAccountRepo.findById(accountId)
    if (!account) throw new NotFoundException('Social account not found')
    if (account.workspaceId !== workspaceId) throw new ForbiddenException()

    const accessToken = this.tokenCipher.decrypt(account.accessTokenEncrypted)

    const url = `https://graph.facebook.com/me/accounts?fields=id,name,category&access_token=${accessToken}`
    const res = await fetch(url)

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Facebook API error: ${err}`)
    }

    const json = await res.json() as FbAccountsResponse
    return json.data.map(({ id, name, category }) => ({ id, name, category }))
  }
}
