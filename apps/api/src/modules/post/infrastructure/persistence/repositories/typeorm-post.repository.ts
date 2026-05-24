import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import type { Post } from '../../../domain/entities/post.entity'
import type { PostRepository, ListPostsFilters } from '../../../domain/repositories/post.repository'
import { PostOrmEntity } from '../entities/post.orm-entity'

@Injectable()
export class TypeOrmPostRepository implements PostRepository {
  constructor(
    @InjectRepository(PostOrmEntity)
    private readonly repo: Repository<PostOrmEntity>,
  ) {}

  async findAllByWorkspace(
    workspaceId: string,
    page: number,
    limit: number,
    filters?: ListPostsFilters,
  ): Promise<{ items: Post[]; total: number }> {
    const where: Record<string, unknown> = { workspaceId }
    if (filters?.status) where['status'] = filters.status
    if (filters?.search) where['content'] = Like(`%${filters.search}%`)

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    let result = items as unknown as Post[]
    if (filters?.platform) {
      result = result.filter((p) => p.platforms.includes(filters.platform!))
    }

    return { items: result, total }
  }

  async findById(id: string): Promise<Post | null> {
    return this.repo.findOne({ where: { id } }) as unknown as Post | null
  }

  async save(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const entity = this.repo.create(post)
    return this.repo.save(entity) as unknown as Post
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    await this.repo.update(id, data as Partial<PostOrmEntity>)
    const updated = await this.repo.findOne({ where: { id } })
    if (!updated) throw new Error(`Post ${id} not found after update`)
    return updated as unknown as Post
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}
