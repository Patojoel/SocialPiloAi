import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SOCIAL_ACCOUNT_REPOSITORY, type SocialAccountRepository } from '../../../domain/repositories/social-account.repository'
import { TokenCipherService } from '../../../infrastructure/crypto/token-cipher.service'
import type { ConnectInstagramCommand } from './connect-instagram.command'
import type { SocialAccount } from '../../../domain/entities/social-account.entity'

interface FbTokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
}

interface FbPage {
  id: string
  name: string
  access_token: string
  instagram_business_account?: { id: string }
}

interface FbAccountsResponse {
  data: FbPage[]
}

interface IgUserResponse {
  id: string
  name: string
  username: string
}

@Injectable()
export class ConnectInstagramUseCase {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepo: SocialAccountRepository,
    private readonly tokenCipher: TokenCipherService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: ConnectInstagramCommand): Promise<SocialAccount> {
    const appId = this.configService.get<string>('app.facebookAppId') ?? process.env['FACEBOOK_APP_ID'] ?? ''
    const appSecret = process.env['FACEBOOK_APP_SECRET'] ?? ''
    const port = this.configService.get<number>('app.port') ?? 3000
    const redirectUri = `http://localhost:${port}/api/v1/auth/instagram/callback`

    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', appId)
    tokenUrl.searchParams.set('client_secret', appSecret)
    tokenUrl.searchParams.set('redirect_uri', redirectUri)
    tokenUrl.searchParams.set('code', command.code)

    const tokenRes = await fetch(tokenUrl.toString())
    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      throw new BadRequestException(`Instagram token exchange failed: ${err}`)
    }
    const tokenData = await tokenRes.json() as FbTokenResponse
    const userAccessToken = tokenData.access_token

    const pagesRes = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${userAccessToken}`,
    )
    const pagesJson = await pagesRes.json() as FbAccountsResponse
    const pages = pagesJson.data ?? []

    const pageWithIg = pages.find((p) => p.instagram_business_account?.id)
    if (!pageWithIg || !pageWithIg.instagram_business_account) {
      throw new BadRequestException(
        'No Instagram Business Account found. Make sure your Instagram account is a Business or Creator account and is linked to a Facebook Page.',
      )
    }

    const igUserId = pageWithIg.instagram_business_account.id
    const pageAccessToken = pageWithIg.access_token

    // 4. Fetch Instagram user info (username + name)
    const igUserRes = await fetch(
      `https://graph.facebook.com/v18.0/${igUserId}?fields=id,name,username&access_token=${pageAccessToken}`,
    )
    const igUser = await igUserRes.json() as IgUserResponse

    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : null

    // Store the page access token (needed to publish via /{ig-user-id}/media)
    const encryptedToken = this.tokenCipher.encrypt(pageAccessToken)

    return this.socialAccountRepo.save({
      workspaceId: command.workspaceId,
      platform: 'instagram',
      accountId: igUserId,
      accountName: igUser.username ?? igUser.name ?? pageWithIg.name,
      accessTokenEncrypted: encryptedToken,
      expiresAt,
      status: 'active',
    })
  }
}
