import type { RootState } from '@/config/create-store'
import { productAdapterSelectors } from './productSlice'

const selectProductState = (state: RootState) => state.products

export const selectAllProducts = (state: RootState) =>
  productAdapterSelectors.selectAll(selectProductState(state))

export const selectCurrentProduct = (state: RootState) => {
  const id = selectProductState(state).currentProductId
  if (!id) return null
  return productAdapterSelectors.selectById(selectProductState(state), id) ?? null
}

export const selectProductsLoading = (state: RootState) => selectProductState(state).loading

export const selectProductsError = (state: RootState) => selectProductState(state).error

export const selectProductsMeta = (state: RootState) => selectProductState(state).meta

export const selectProductById = (id: string) => (state: RootState) =>
  productAdapterSelectors.selectById(selectProductState(state), id) ?? null
