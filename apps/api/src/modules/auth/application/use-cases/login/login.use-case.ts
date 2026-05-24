import { Injectable, Inject, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { USER_REPOSITORY, type UserRepository } from '../../../../user/domain/repositories/user.repository'
import { REFRESH_TOKEN_REPOSITORY, type RefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository'
import type { LoginCommand } from './login.command'

export interface LoginResult {
  user: { id: string; email: string; firstName: string; lastName: string; avatarUrl: string | null }
  accessToken: string
  refreshToken: string
  expiresIn: number
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(command.email)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(command.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await this.refreshTokenRepo.save({ userId: user.id, token: refreshToken, expiresAt, isRevoked: false })

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatarUrl: user.avatarUrl },
      accessToken,
      refreshToken,
      expiresIn: 900,
    }
  }
}
