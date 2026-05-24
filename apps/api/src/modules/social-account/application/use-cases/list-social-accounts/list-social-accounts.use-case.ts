import { Injectable, Inject } from '@nestjs/common'
import { SOCIAL_ACCOUNT_REPOSITORY, type SocialAccountRepository } from '../../../domain/repositories/social-account.repository'
import type { SocialAccount } from '../../../domain/entities/social-account.entity'

@Injectable()
export class ListSocialAccountsUseCase {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepo: SocialAccountRepository,
  ) {}

  async execute(workspaceId: string): Promise<SocialAccount[]> {
    return this.socialAccountRepo.findAll(workspaceId)
  }
}
