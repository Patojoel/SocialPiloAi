import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { Notify } from '@/shared/utils/Notify'
import { uploadMedia } from '@/features/media/usecases/uploadMedia.usecase'
import {
  productAdded,
  productUpdated,
  productRemoved,
  setCurrentProductId,
  setProductsLoading,
} from '../../../slices/productSlice'
import {
  selectAllProducts,
  selectCurrentProduct,
  selectProductsLoading,
  selectProductsMeta,
} from '../../../slices/productSelectors'
import { listProducts } from '../../../usecases/listProducts.usecase'
import { createProduct } from '../../../usecases/createProduct.usecase'
import { updateProduct } from '../../../usecases/updateProduct.usecase'
import { deleteProduct } from '../../../usecases/deleteProduct.usecase'
import { productSchema } from '../../validation/productSchema'
import type { ProductFormValues } from '../../validation/productSchema'
import { ProductFormFactory } from '../../factories/ProductFormFactory'
import { ProductCommandFactory } from '../../factories/ProductCommandFactory'
import { LoadingState } from '@/shared/models/LoadingState'
import type { Product } from '../../../models/Product'

export function useProducts() {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectAllProducts)
  const loading = useAppSelector(selectProductsLoading)
  const meta = useAppSelector(selectProductsMeta)
  const currentProduct = useAppSelector(selectCurrentProduct)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: ProductFormFactory.buildFormValue(),
  })

  const handleOpenCreate = () => {
    form.reset(ProductFormFactory.buildFormValue())
    dispatch(setCurrentProductId(null))
    setIsDrawerOpen(true)
  }

  const handleOpenEdit = (product: Product) => {
    form.reset(ProductFormFactory.buildFormValue(product))
    dispatch(setCurrentProductId(product.id))
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    dispatch(setCurrentProductId(null))
    form.reset(ProductFormFactory.buildFormValue())
  }

  const handleSubmit = form.handleSubmit((values) => {
    const command = ProductCommandFactory.buildCommand(values)

    if (currentProduct) {
      dispatch(setProductsLoading(LoadingState.pending))
      void dispatch(updateProduct({ id: currentProduct.id, ...command })).then((action) => {
        if (updateProduct.fulfilled.match(action)) {
          dispatch(productUpdated(action.payload))
          dispatch(setCurrentProductId(null))
          dispatch(setProductsLoading(LoadingState.success))
          setIsDrawerOpen(false)
          Notify.success('Product updated successfully')
        } else {
          dispatch(setProductsLoading(LoadingState.failed))
          Notify.error(action.payload?.message ?? 'Failed to update product')
        }
      })
    } else {
      dispatch(setProductsLoading(LoadingState.pending))
      void dispatch(createProduct(command)).then((action) => {
        if (createProduct.fulfilled.match(action)) {
          dispatch(productAdded(action.payload))
          dispatch(setProductsLoading(LoadingState.success))
          setIsDrawerOpen(false)
          Notify.success('Product created successfully')
        } else {
          dispatch(setProductsLoading(LoadingState.failed))
          Notify.error(action.payload?.message ?? 'Failed to create product')
        }
      })
    }
  })

  const handleOpenDelete = (id: string) => {
    setDeletingId(id)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeletingId(null)
  }

  const handleConfirmDelete = () => {
    if (!deletingId) return
    const idToDelete = deletingId
    void dispatch(deleteProduct(idToDelete)).then((action) => {
      if (deleteProduct.fulfilled.match(action)) {
        dispatch(productRemoved(idToDelete))
        dispatch(setCurrentProductId(null))
        setIsDeleteModalOpen(false)
        setDeletingId(null)
        Notify.success('Product deleted')
      } else {
        Notify.error(action.payload?.message ?? 'Failed to delete product')
      }
    })
  }

  const handlePageChange = (page: number) => {
    void dispatch(listProducts({ page, limit: meta.limit }))
  }

  /**
   * Upload a file to Cloudinary via the existing media gateway.
   * Returns the secure URL on success, or null on failure.
   */
  const handleUploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    const action = await dispatch(uploadMedia(file))
    setIsUploading(false)

    if (uploadMedia.fulfilled.match(action)) {
      return action.payload.url
    }

    Notify.error(action.payload?.message ?? 'Upload failed')
    return null
  }

  return {
    products,
    loading,
    meta,
    currentProduct,
    isDrawerOpen,
    isDeleteModalOpen,
    isUploading,
    deletingId,
    form,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
    handleSubmit,
    handleOpenDelete,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handlePageChange,
    handleUploadFile,
  }
}
