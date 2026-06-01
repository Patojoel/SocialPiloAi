import { createAppAsyncThunk } from '@/config/create-app-async-thunk'
import type { Paginated } from '@/shared/models/Paginated'
import type { Product } from '../models/Product'
import { HttpError } from '@/shared/infra/http/HttpError'

interface ListProductsArgs {
  page: number
  limit: number
  search?: string
}

export const listProducts = createAppAsyncThunk<Paginated<Product>, ListProductsArgs>(
  'products/list',
  async (args, { extra, rejectWithValue }) => {
    try {
      return await extra.productGateway.list(args)
    } catch (err) {
      if (err instanceof HttpError) return rejectWithValue({ message: err.message, status: err.status })
      if (err instanceof Error) return rejectWithValue({ message: err.message })
      return rejectWithValue({ message: 'Failed to list products' })
    }
  },
)
