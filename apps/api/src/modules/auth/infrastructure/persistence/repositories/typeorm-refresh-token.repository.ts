import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThan, Repository } from 'typeorm'
import type { RefreshToken } from '../../../domain/entities/refresh-token.entity'
import type { RefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository'
import { RefreshTokenOrmEntity } from '../entities/refresh-token.orm-entity'

@Injectable()
export class TypeOrmRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repo: Repository<RefreshTokenOrmEntity>,
  ) {}

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.repo.findOne({ where: { token } })
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return this.repo.find({ where: { userId } })
  }

  async save(token: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken> {
    const entity = this.repo.create(token)
    return this.repo.save(entity)
  }

  async revokeByToken(token: string): Promise<void> {
    await this.repo.update({ token }, { isRevoked: true })
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.repo.update({ userId }, { isRevoked: true })
  }

  async deleteExpired(): Promise<void> {
    await this.repo.delete({ expiresAt: LessThan(new Date()) })
  }
}
