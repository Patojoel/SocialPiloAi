import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../../domain/repositories/product.repository'

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(id: string, workspaceId: string): Promise<void> {
    const existing = await this.productRepo.findById(id)
    if (!existing || existing.workspaceId !== workspaceId) {
      throw new NotFoundException(`Product ${id} not found`)
    }
    await this.productRepo.delete(id)
  }
}
