import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { SOCIAL_ACCOUNT_REPOSITORY, type SocialAccountRepository } from '../../../domain/repositories/social-account.repository'

@Injectable()
export class DisconnectSocialAccountUseCase {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly socialAccountRepo: SocialAccountRepository,
  ) {}

  async execute(id: string, workspaceId: string): Promise<void> {
    const account = await this.socialAccountRepo.findById(id)
    if (!account) throw new NotFoundException(`Social account ${id} not found`)
    if (account.workspaceId !== workspaceId) throw new ForbiddenException('Access denied')
    await this.socialAccountRepo.delete(id)
  }
}
