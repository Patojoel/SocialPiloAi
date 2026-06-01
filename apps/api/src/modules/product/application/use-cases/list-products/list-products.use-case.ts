import { Injectable, Inject } from '@nestjs/common'
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../../domain/repositories/product.repository'
import type { Product } from '../../../domain/entities/product.entity'

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(
    workspaceId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ items: Product[]; total: number; page: number; limit: number; totalPages: number }> {
    const { items, total } = await this.productRepo.findAllByWorkspace(workspaceId, page, limit, search)
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
