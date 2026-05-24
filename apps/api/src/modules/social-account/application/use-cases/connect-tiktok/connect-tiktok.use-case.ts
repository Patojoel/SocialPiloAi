import { Injectable, Inject } from '@nestjs/common'
import { SOCIAL_ACCOUNT_REPOSITORY, type SocialAccountRepository } from '../../../domain/repositories/social-account.repository'
import { TokenCipherService } from '../../../infrastructure/crypto/token-cipher.service'
import type { ConnectTiktokCommand } from './connect-tiktok.command'
import type { SocialAccount } from '../../../domain/entities/social-account.entity'

@Injectable()
export class ConnectTiktokUseCase {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepo: SocialAccountRepository,
    private readonly tokenCipher: TokenCipherService,
  ) {}

  async execute(command: ConnectTiktokCommand): Promise<SocialAccount> {
    const encryptedToken = this.tokenCipher.encrypt(command.code)
    return this.socialAccountRepo.save({
      workspaceId: command.workspaceId,
      platform: 'tiktok',
      accountId: `tt_${Date.now()}`,
      accountName: 'TikTok Account',
      accessTokenEncrypted: encryptedToken,
      expiresAt: null,
      status: 'active',
    })
  }
}
