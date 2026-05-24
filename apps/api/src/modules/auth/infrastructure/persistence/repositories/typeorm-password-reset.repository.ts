import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PasswordResetOrmEntity } from '../entities/password-reset.orm-entity'

export interface PasswordResetRepository {
  findByToken(token: string): Promise<PasswordResetOrmEntity | null>
  save(data: { email: string; token: string; expiresAt: Date }): Promise<PasswordResetOrmEntity>
  markUsed(token: string): Promise<void>
  deleteByEmail(email: string): Promise<void>
}

@Injectable()
export class TypeOrmPasswordResetRepository implements PasswordResetRepository {
  constructor(
    @InjectRepository(PasswordResetOrmEntity)
    private readonly repo: Repository<PasswordResetOrmEntity>,
  ) {}

  async findByToken(token: string): Promise<PasswordResetOrmEntity | null> {
    return this.repo.findOne({ where: { token } })
  }

  async save(data: { email: string; token: string; expiresAt: Date }): Promise<PasswordResetOrmEntity> {
    const entity = this.repo.create(data)
    return this.repo.save(entity)
  }

  async markUsed(token: string): Promise<void> {
    await this.repo.update({ token }, { isUsed: true })
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.repo.delete({ email })
  }
}
