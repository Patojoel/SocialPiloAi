import type { Product } from '../entities/product.entity'

export interface ProductRepository {
  findAllByWorkspace(
    workspaceId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ items: Product[]; total: number }>
  findById(id: string): Promise<Product | null>
  save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>
  update(id: string, data: Partial<Omit<Product, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>>): Promise<Product>
  delete(id: string): Promise<void>
}

export const PRODUCT_REPOSITORY = Symbol('ProductRepository')
