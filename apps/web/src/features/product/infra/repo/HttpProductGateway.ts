import type { ProductGateway, ListProductsQuery, SaveProductPayload } from '../../gateway/ProductGateway'
import type { HttpProvider } from '@/shared/infra/http/HttpProvider'
import type { Product, ProductFaq } from '../../models/Product'
import type { Paginated } from '@/shared/models/Paginated'
import { toCamelCase } from '@/shared/utils/caseTransform'

interface ApiProduct {
  id: string
  workspace_id: string
  name: string
  description: string
  context: string
  benefits: string[]
  faqs: ProductFaq[]
  marketing_texts: string[]
  image_urls: string[]
  video_urls: string[]
  created_at: string
  updated_at: string
}

interface ApiPaginatedProducts {
  data: ApiProduct[]
  meta: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export class HttpProductGateway implements ProductGateway {
  constructor(private readonly http: HttpProvider) {}

  async list(query: ListProductsQuery): Promise<Paginated<Product>> {
    const params: Record<string, string | number> = {
      page: query.page,
      limit: query.limit,
    }
    if (query.search) params['search'] = query.search

    const res = await this.http.get<ApiPaginatedProducts>('/products', { params })
    return {
      items: res.data.map((p) => toCamelCase<Product>(p)),
      total: res.meta.total,
      page: res.meta.page,
      limit: res.meta.limit,
      totalPages: res.meta.total_pages,
    }
  }

  async getById(id: string): Promise<Product> {
    const res = await this.http.get<{ data: ApiProduct }>(`/products/${id}`)
    return toCamelCase<Product>(res.data)
  }

  async create(payload: SaveProductPayload): Promise<Product> {
    const res = await this.http.post<{ data: ApiProduct }>('/products', {
      name: payload.name,
      description: payload.description,
      context: payload.context,
      benefits: payload.benefits,
      faqs: payload.faqs,
      marketingTexts: payload.marketingTexts,
      imageUrls: payload.imageUrls,
      videoUrls: payload.videoUrls,
    })
    return toCamelCase<Product>(res.data)
  }

  async update(id: string, payload: Partial<SaveProductPayload>): Promise<Product> {
    const body: Record<string, unknown> = {}
    if (payload.name !== undefined) body['name'] = payload.name
    if (payload.description !== undefined) body['description'] = payload.description
    if (payload.context !== undefined) body['context'] = payload.context
    if (payload.benefits !== undefined) body['benefits'] = payload.benefits
    if (payload.faqs !== undefined) body['faqs'] = payload.faqs
    if (payload.marketingTexts !== undefined) body['marketingTexts'] = payload.marketingTexts
    if (payload.imageUrls !== undefined) body['imageUrls'] = payload.imageUrls
    if (payload.videoUrls !== undefined) body['videoUrls'] = payload.videoUrls

    const res = await this.http.patch<{ data: ApiProduct }>(`/products/${id}`, body)
    return toCamelCase<Product>(res.data)
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/products/${id}`)
  }
}
