import { Injectable, Inject, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { USER_REPOSITORY, type UserRepository } from '../../../../user/domain/repositories/user.repository'
import { REFRESH_TOKEN_REPOSITORY, type RefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository'
import type { RegisterCommand } from './register.command'
import type { RegisterResult } from './register.result'

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResult> {
    const existing = await this.userRepo.findByEmail(command.email)
    if (existing) {
      throw new ConflictException('Email already in use')
    }

    const passwordHash = await bcrypt.hash(command.password, 12)
    const user = await this.userRepo.save({
      email: command.email,
      passwordHash,
      firstName: command.firstName,
      lastName: command.lastName,
      avatarUrl: null,
      isActive: true,
    })

    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email)

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      accessToken,
      refreshToken,
    }
  }

  private async generateTokens(userId: string, email: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await this.refreshTokenRepo.save({ userId, token: refreshToken, expiresAt, isRevoked: false })

    return { accessToken, refreshToken }
  }
}
