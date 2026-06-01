import type { Product } from '../models/Product'
import type { Paginated } from '@/shared/models/Paginated'

export interface ListProductsQuery {
  page: number
  limit: number
  search?: string
}

export interface SaveProductPayload {
  name: string
  description: string
  context: string
  benefits: string[]
  faqs: { question: string; answer: string }[]
  marketingTexts: string[]
  imageUrls: string[]
  videoUrls: string[]
}

export interface ProductGateway {
  list(query: ListProductsQuery): Promise<Paginated<Product>>
  getById(id: string): Promise<Product>
  create(payload: SaveProductPayload): Promise<Product>
  update(id: string, payload: Partial<SaveProductPayload>): Promise<Product>
  delete(id: string): Promise<void>
}
