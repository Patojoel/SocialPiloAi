import type { Product } from '../../domain/entities/product.entity'

export interface SerializedProduct {
  id: string
  workspace_id: string
  name: string
  description: string
  context: string
  benefits: string[]
  faqs: { question: string; answer: string }[]
  marketing_texts: string[]
  image_urls: string[]
  video_urls: string[]
  created_at: string
  updated_at: string
}

export function serializeProduct(product: Product): SerializedProduct {
  return {
    id: product.id,
    workspace_id: product.workspaceId,
    name: product.name,
    description: product.description,
    context: product.context,
    benefits: product.benefits,
    faqs: product.faqs,
    marketing_texts: product.marketingTexts,
    image_urls: product.imageUrls,
    video_urls: product.videoUrls,
    created_at: product.createdAt.toISOString(),
    updated_at: product.updatedAt.toISOString(),
  }
}
