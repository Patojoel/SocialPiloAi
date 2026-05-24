import { Injectable, Inject } from '@nestjs/common'
import { SOCIAL_ACCOUNT_REPOSITORY, type SocialAccountRepository } from '../../../domain/repositories/social-account.repository'
import { TokenCipherService } from '../../../infrastructure/crypto/token-cipher.service'
import type { ConnectFacebookCommand } from './connect-facebook.command'
import type { SocialAccount } from '../../../domain/entities/social-account.entity'

@Injectable()
export class ConnectFacebookUseCase {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepo: SocialAccountRepository,
    private readonly tokenCipher: TokenCipherService,
  ) {}

  async execute(command: ConnectFacebookCommand): Promise<SocialAccount> {
    const encryptedToken = this.tokenCipher.encrypt(command.code)
    return this.socialAccountRepo.save({
      workspaceId: command.workspaceId,
      platform: 'facebook',
      accountId: `fb_${Date.now()}`,
      accountName: 'Facebook Account',
      accessTokenEncrypted: encryptedToken,
      expiresAt: null,
      status: 'active',
    })
  }
}
