import { Injectable, Inject, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { REFRESH_TOKEN_REPOSITORY, type RefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository'

export interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(oldRefreshToken: string): Promise<RefreshTokenResult> {
    const stored = await this.refreshTokenRepo.findByToken(oldRefreshToken)
    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    let payload: { sub: string; email: string }
    try {
      payload = this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      }) as { sub: string; email: string }
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }

    await this.refreshTokenRepo.revokeByToken(oldRefreshToken)

    const newPayload = { sub: payload.sub, email: payload.email }
    const accessToken = this.jwtService.sign(newPayload)
    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await this.refreshTokenRepo.save({
      userId: payload.sub,
      token: newRefreshToken,
      expiresAt,
      isRevoked: false,
    })

    return { accessToken, refreshToken: newRefreshToken }
  }
}
