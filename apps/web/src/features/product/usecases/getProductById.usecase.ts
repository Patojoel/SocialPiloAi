import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Product } from '../models/Product'
import { HttpError } from '@/shared/infra/http/HttpError'

export const getProductById = createAppAsyncThunk<Product, string>(
  'products/getById',
  async (id, { extra, rejectWithValue }) => {
    try {
      return await extra.productGateway.getById(id)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to fetch product' })
    }
  },
)
