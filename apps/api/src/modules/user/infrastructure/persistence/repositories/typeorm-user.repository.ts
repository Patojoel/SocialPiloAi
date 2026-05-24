import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { User } from '../../../domain/entities/user.entity'
import type { UserRepository } from '../../../domain/repositories/user.repository'
import { UserOrmEntity } from '../entities/user.orm-entity'

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } })
  }

  async save(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const entity = this.repo.create(user)
    return this.repo.save(entity)
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repo.update(id, data)
    const updated = await this.repo.findOne({ where: { id } })
    if (!updated) throw new Error(`User ${id} not found after update`)
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}
