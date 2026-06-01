import { Injectable, Inject } from '@nestjs/common'
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../../domain/repositories/product.repository'
import type { CreateProductCommand } from './create-product.command'
import type { Product } from '../../../domain/entities/product.entity'

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    return this.productRepo.save({
      workspaceId: command.workspaceId,
      name: command.name,
      description: command.description,
      context: command.context,
      benefits: command.benefits,
      faqs: command.faqs,
      marketingTexts: command.marketingTexts,
      imageUrls: command.imageUrls,
      videoUrls: command.videoUrls,
    })
  }
}
