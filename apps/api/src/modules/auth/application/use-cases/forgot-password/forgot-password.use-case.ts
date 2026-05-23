import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomBytes } from 'crypto'
import { USER_REPOSITORY, type UserRepository } from '../../../../user/domain/repositories/user.repository'
import { TypeOrmPasswordResetRepository } from '../../../infrastructure/persistence/repositories/typeorm-password-reset.repository'

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    private readonly passwordResetRepo: TypeOrmPasswordResetRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email)
    if (!user) return // Silent for security

    await this.passwordResetRepo.deleteByEmail(email)

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    await this.passwordResetRepo.save({ email, token, expiresAt })

    // TODO: Send email via Resend
    console.warn(`Password reset token for ${email}: ${token}`)
  }
}
