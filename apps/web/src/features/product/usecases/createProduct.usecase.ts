import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Product } from '../models/Product'
import type { SaveProductPayload } from '../gateway/ProductGateway'
import { HttpError } from '@/shared/infra/http/HttpError'

export const createProduct = createAppAsyncThunk<Product, SaveProductPayload>(
  'products/create',
  async (payload, { extra, rejectWithValue }) => {
    try {
      return await extra.productGateway.create(payload)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to create product' })
    }
  },
)
