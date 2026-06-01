import type { ProductFaq } from '../../../domain/entities/product.entity'

export interface UpdateProductCommand {
  id: string
  workspaceId: string
  name?: string
  description?: string
  context?: string
  benefits?: string[]
  faqs?: ProductFaq[]
  marketingTexts?: string[]
  imageUrls?: string[]
  videoUrls?: string[]
}
