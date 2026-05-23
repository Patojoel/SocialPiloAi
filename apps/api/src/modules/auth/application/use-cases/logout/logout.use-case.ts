import { Injectable, Inject } from '@nestjs/common'
import { REFRESH_TOKEN_REPOSITORY, type RefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository'

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: RefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    await this.refreshTokenRepo.revokeByToken(refreshToken)
  }
}
