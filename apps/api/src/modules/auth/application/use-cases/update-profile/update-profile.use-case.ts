import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { USER_REPOSITORY, type UserRepository } from '../../../../user/domain/repositories/user.repository'
import type { User } from '../../../../user/domain/entities/user.entity'

export interface UpdateProfileCommand {
  userId: string
  firstName?: string
  lastName?: string
  avatarUrl?: string | null
}

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<User> {
    const user = await this.userRepo.findById(command.userId)
    if (!user) throw new NotFoundException('User not found')

    const { userId: _userId, ...updates } = command
    return this.userRepo.update(user.id, updates)
  }
}
