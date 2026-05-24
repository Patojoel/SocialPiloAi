import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { SocialAccount, Platform } from '../../../domain/entities/social-account.entity'
import type { SocialAccountRepository } from '../../../domain/repositories/social-account.repository'
import { SocialAccountOrmEntity } from '../entities/social-account.orm-entity'

@Injectable()
export class TypeOrmSocialAccountRepository implements SocialAccountRepository {
  constructor(
    @InjectRepository(SocialAccountOrmEntity)
    private readonly repo: Repository<SocialAccountOrmEntity>,
  ) {}

  async findAll(workspaceId: string): Promise<SocialAccount[]> {
    return this.repo.find({ where: { workspaceId } }) as unknown as SocialAccount[]
  }

  async findById(id: string): Promise<SocialAccount | null> {
    return this.repo.findOne({ where: { id } }) as unknown as SocialAccount | null
  }

  async findByWorkspaceAndPlatform(workspaceId: string, platform: Platform): Promise<SocialAccount[]> {
    return this.repo.find({ where: { workspaceId, platform } }) as unknown as SocialAccount[]
  }

  async save(account: Omit<SocialAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialAccount> {
    const entity = this.repo.create(account)
    return this.repo.save(entity) as unknown as SocialAccount
  }

  async update(id: string, data: Partial<SocialAccount>): Promise<SocialAccount> {
    await this.repo.update(id, data as Partial<SocialAccountOrmEntity>)
    const updated = await this.repo.findOne({ where: { id } })
    if (!updated) throw new Error(`SocialAccount ${id} not found after update`)
    return updated as unknown as SocialAccount
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}
