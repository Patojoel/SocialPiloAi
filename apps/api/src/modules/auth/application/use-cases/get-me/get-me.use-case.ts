import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { USER_REPOSITORY, type UserRepository } from '../../../../user/domain/repositories/user.repository'
import type { User } from '../../../../user/domain/entities/user.entity'

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string): Promise<Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'avatarUrl'>> {
    const user = await this.userRepo.findById(userId)
    if (!user) throw new NotFoundException('User not found')
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatarUrl: user.avatarUrl }
  }
}
