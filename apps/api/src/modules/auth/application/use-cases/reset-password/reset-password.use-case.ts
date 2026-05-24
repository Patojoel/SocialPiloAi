import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { USER_REPOSITORY, type UserRepository } from '../../../../user/domain/repositories/user.repository'
import { TypeOrmPasswordResetRepository } from '../../../infrastructure/persistence/repositories/typeorm-password-reset.repository'

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    private readonly passwordResetRepo: TypeOrmPasswordResetRepository,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const reset = await this.passwordResetRepo.findByToken(token)
    if (!reset || reset.isUsed || reset.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token')
    }

    const user = await this.userRepo.findByEmail(reset.email)
    if (!user) throw new BadRequestException('User not found')

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await this.userRepo.update(user.id, { passwordHash })
    await this.passwordResetRepo.markUsed(token)
  }
}
