import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Product } from '../models/Product'
import type { SaveProductPayload } from '../gateway/ProductGateway'
import { HttpError } from '@/shared/infra/http/HttpError'

interface UpdateProductArgs extends Partial<SaveProductPayload> {
  id: string
}

export const updateProduct = createAppAsyncThunk<Product, UpdateProductArgs>(
  'products/update',
  async ({ id, ...payload }, { extra, rejectWithValue }) => {
    try {
      return await extra.productGateway.update(id, payload)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to update product' })
    }
  },
)
