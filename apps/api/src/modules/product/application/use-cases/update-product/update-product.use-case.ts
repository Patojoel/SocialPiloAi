import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../../domain/repositories/product.repository'
import type { UpdateProductCommand } from './update-product.command'
import type { Product } from '../../../domain/entities/product.entity'

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const existing = await this.productRepo.findById(command.id)
    if (!existing || existing.workspaceId !== command.workspaceId) {
      throw new NotFoundException(`Product ${command.id} not found`)
    }

    const { id, workspaceId: _ws, ...updates } = command
    return this.productRepo.update(id, updates)
  }
}
