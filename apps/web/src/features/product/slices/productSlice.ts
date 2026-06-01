import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { LoadingState } from '@/shared/models/LoadingState'
import type { Product } from '../models/Product'
import { listProducts } from '../usecases/listProducts.usecase'

const productAdapter = createEntityAdapter<Product>()

export interface ProductMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductState {
  loading: LoadingState
  error: string | null
  currentProductId: string | null
  meta: ProductMeta
}

const initialState = productAdapter.getInitialState<ProductState>({
  loading: LoadingState.idle,
  error: null,
  currentProductId: null,
  meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
})

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productAdded: productAdapter.addOne,
    productUpdated(state, action: { payload: Product }) {
      productAdapter.updateOne(state, { id: action.payload.id, changes: action.payload })
    },
    productRemoved: productAdapter.removeOne,
    productsLoaded: productAdapter.setAll,
    setCurrentProductId(state, action: { payload: string | null }) {
      state.currentProductId = action.payload
    },
    setProductsLoading(state, action: { payload: LoadingState }) {
      state.loading = action.payload
    },
    setProductsMeta(state, action: { payload: ProductMeta }) {
      state.meta = action.payload
    },
    setProductsError(state, action: { payload: string | null }) {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = LoadingState.pending
        state.error = null
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = LoadingState.success
        productAdapter.setAll(state, action.payload.items)
        state.meta = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        }
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = LoadingState.failed
        state.error = action.payload?.message ?? 'Failed to load products'
      })
  },
})

export const {
  productAdded,
  productUpdated,
  productRemoved,
  productsLoaded,
  setCurrentProductId,
  setProductsLoading,
  setProductsMeta,
  setProductsError,
} = productSlice.actions

export const productReducer = productSlice.reducer
export const productAdapterSelectors = productAdapter.getSelectors()
