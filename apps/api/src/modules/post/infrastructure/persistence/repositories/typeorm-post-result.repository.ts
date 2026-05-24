import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { PostResult } from '../../../domain/entities/post-result.entity'
import type { PostResultRepository } from '../../../domain/repositories/post-result.repository'
import { PostResultOrmEntity } from '../entities/post-result.orm-entity'

@Injectable()
export class TypeOrmPostResultRepository implements PostResultRepository {
  constructor(
    @InjectRepository(PostResultOrmEntity)
    private readonly repo: Repository<PostResultOrmEntity>,
  ) {}

  async findByPostId(postId: string): Promise<PostResult[]> {
    return this.repo.find({ where: { postId } }) as unknown as PostResult[]
  }

  async save(result: Omit<PostResult, 'id' | 'createdAt'>): Promise<PostResult> {
    const entity = this.repo.create(result)
    return this.repo.save(entity) as unknown as PostResult
  }

  async update(id: string, data: Partial<PostResult>): Promise<PostResult> {
    await this.repo.update(id, data as Partial<PostResultOrmEntity>)
    const updated = await this.repo.findOne({ where: { id } })
    if (!updated) throw new Error(`PostResult ${id} not found after update`)
    return updated as unknown as PostResult
  }
}
