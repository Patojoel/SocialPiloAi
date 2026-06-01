import type { ProductFaq } from '../../../domain/entities/product.entity'

export interface CreateProductCommand {
  workspaceId: string
  name: string
  description: string
  context: string
  benefits: string[]
  faqs: ProductFaq[]
  marketingTexts: string[]
  imageUrls: string[]
  videoUrls: string[]
}
