import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../../domain/repositories/product.repository'
import type { Product } from '../../../domain/entities/product.entity'

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(id: string, workspaceId: string): Promise<Product> {
    const product = await this.productRepo.findById(id)
    if (!product || product.workspaceId !== workspaceId) {
      throw new NotFoundException(`Product ${id} not found`)
    }
    return product
  }
}
