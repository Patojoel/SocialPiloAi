import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SOCIAL_ACCOUNT_REPOSITORY, type SocialAccountRepository } from '../../../domain/repositories/social-account.repository'
import { TokenCipherService } from '../../../infrastructure/crypto/token-cipher.service'
import type { ConnectFacebookCommand } from './connect-facebook.command'
import type { SocialAccount } from '../../../domain/entities/social-account.entity'

interface FbTokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
}

interface FbUserResponse {
  id: string
  name: string
}

@Injectable()
export class ConnectFacebookUseCase {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepo: SocialAccountRepository,
    private readonly tokenCipher: TokenCipherService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: ConnectFacebookCommand): Promise<SocialAccount> {
    const appId = this.configService.get<string>('app.facebookAppId') ?? process.env['FACEBOOK_APP_ID'] ?? ''
    const appSecret = process.env['FACEBOOK_APP_SECRET'] ?? ''
    const port = this.configService.get<number>('app.port') ?? 3000
    const redirectUri = `http://localhost:${port}/api/v1/auth/facebook/callback`

    // Exchange code for user access token
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', appId)
    tokenUrl.searchParams.set('client_secret', appSecret)
    tokenUrl.searchParams.set('redirect_uri', redirectUri)
    tokenUrl.searchParams.set('code', command.code)

    const tokenRes = await fetch(tokenUrl.toString())
    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      throw new BadRequestException(`Facebook token exchange failed: ${err}`)
    }
    const tokenData = await tokenRes.json() as FbTokenResponse
    const accessToken = tokenData.access_token

    // Fetch user identity
    const userRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name&access_token=${accessToken}`,
    )
    const userData = await userRes.json() as FbUserResponse

    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : null

    const encryptedToken = this.tokenCipher.encrypt(accessToken)

    return this.socialAccountRepo.save({
      workspaceId: command.workspaceId,
      platform: 'facebook',
      accountId: userData.id,
      accountName: userData.name,
      accessTokenEncrypted: encryptedToken,
      expiresAt,
      status: 'active',
    })
  }
}
