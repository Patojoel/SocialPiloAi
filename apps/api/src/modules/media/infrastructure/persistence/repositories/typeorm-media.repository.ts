import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { Media } from '../../../domain/entities/media.entity'
import type { MediaRepository } from '../../../domain/repositories/media.repository'
import { MediaOrmEntity } from '../entities/media.orm-entity'

@Injectable()
export class TypeOrmMediaRepository implements MediaRepository {
  constructor(
    @InjectRepository(MediaOrmEntity)
    private readonly repo: Repository<MediaOrmEntity>,
  ) {}

  async findAll(workspaceId: string, page: number, limit: number): Promise<{ items: Media[]; total: number }> {
    const [items, total] = await this.repo.findAndCount({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { items: items as unknown as Media[], total }
  }

  async findById(id: string): Promise<Media | null> {
    return this.repo.findOne({ where: { id } }) as unknown as Media | null
  }

  async save(media: Omit<Media, 'id' | 'createdAt'>): Promise<Media> {
    const entity = this.repo.create(media)
    return this.repo.save(entity) as unknown as Media
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}
