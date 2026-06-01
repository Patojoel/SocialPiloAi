import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { SOCIAL_ACCOUNT_REPOSITORY, type SocialAccountRepository } from '../../../domain/repositories/social-account.repository'
import { TokenCipherService } from '../../../infrastructure/crypto/token-cipher.service'
import type { ConnectTiktokCommand } from './connect-tiktok.command'
import type { SocialAccount } from '../../../domain/entities/social-account.entity'

// TikTok v2 /oauth/token/ returns a flat response (no data wrapper)
interface TiktokTokenResponse {
  access_token: string
  refresh_token: string
  open_id: string
  scope: string
  expires_in: number
  refresh_expires_in: number
  token_type: string
  error?: string
  error_description?: string
}

interface TiktokUserResponse {
  data: {
    user: {
      open_id: string
      display_name: string
      avatar_url: string
    }
  }
  error: { code: string; message: string }
}

@Injectable()
export class ConnectTiktokUseCase {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepo: SocialAccountRepository,
    private readonly tokenCipher: TokenCipherService,
  ) {}

  async execute(command: ConnectTiktokCommand): Promise<SocialAccount> {
    const clientKey = process.env['TIKTOK_CLIENT_KEY'] ?? ''
    const clientSecret = process.env['TIKTOK_CLIENT_SECRET'] ?? ''
    const redirectUri = process.env['TIKTOK_REDIRECT_URI'] ?? ''

    // 1. Exchange code for access token (TikTok API v2)
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code: command.code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      throw new BadRequestException(`TikTok token exchange failed: ${err}`)
    }

    const tokenData = await tokenRes.json() as TiktokTokenResponse
    if (tokenData.error) {
      throw new BadRequestException(`TikTok token error: ${tokenData.error_description ?? tokenData.error}`)
    }

    const { access_token, open_id, expires_in } = tokenData

    // 2. Fetch user display name
    const userRes = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url',
      { headers: { Authorization: `Bearer ${access_token}` } },
    )

    const userWrapper = await userRes.json() as TiktokUserResponse
    const displayName = userWrapper.data?.user?.display_name ?? `TikTok (${open_id})`

    const expiresAt = new Date(Date.now() + expires_in * 1000)
    const encryptedToken = this.tokenCipher.encrypt(access_token)

    return this.socialAccountRepo.save({
      workspaceId: command.workspaceId,
      platform: 'tiktok',
      accountId: open_id,
      accountName: displayName,
      accessTokenEncrypted: encryptedToken,
      expiresAt,
      status: 'active',
    })
  }
}
