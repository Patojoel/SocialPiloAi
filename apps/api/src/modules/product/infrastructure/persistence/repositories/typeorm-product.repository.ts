import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import type { Product, ProductFaq } from '../../../domain/entities/product.entity'
import type { ProductRepository } from '../../../domain/repositories/product.repository'
import { ProductOrmEntity } from '../entities/product.orm-entity'

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  private map(orm: ProductOrmEntity): Product {
    return {
      id: orm.id,
      workspaceId: orm.workspaceId,
      name: orm.name,
      description: orm.description,
      context: orm.context,
      benefits: orm.benefits,
      faqs: orm.faqs as ProductFaq[],
      marketingTexts: orm.marketingTexts,
      imageUrls: orm.imageUrls,
      videoUrls: orm.videoUrls,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    }
  }

  async findAllByWorkspace(
    workspaceId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ items: Product[]; total: number }> {
    const where: Record<string, unknown> = { workspaceId }
    if (search) where['name'] = ILike(`%${search}%`)

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return { items: items.map((e) => this.map(e)), total }
  }

  async findById(id: string): Promise<Product | null> {
    const orm = await this.repo.findOne({ where: { id } })
    return orm ? this.map(orm) : null
  }

  async save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const entity = this.repo.create(product)
    const saved = await this.repo.save(entity)
    return this.map(saved)
  }

  async update(
    id: string,
    data: Partial<Omit<Product, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Product> {
    await this.repo.update(id, data as Partial<ProductOrmEntity>)
    const updated = await this.repo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException(`Product ${id} not found after update`)
    return this.map(updated)
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}
