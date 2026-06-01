import { useState } from 'react'
import { Plus, Search, ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { LoadingState } from '@/shared/models/LoadingState'
import { useProducts } from '../hooks/useProducts'
import { ProductTable } from '../components/ProductTable'
import { ProductDrawer } from '../components/ProductDrawer'
import { DeleteProductModal } from '../components/DeleteProductModal'

const ProductListPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const {
    products,
    loading,
    meta,
    currentProduct,
    isDrawerOpen,
    isDeleteModalOpen,
    form,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
    handleSubmit,
    handleOpenDelete,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handlePageChange,
    isUploading,
    handleUploadFile,
  } = useProducts()

  const isPending = loading === LoadingState.pending
  const totalPages = meta.totalPages

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {meta.total} product{meta.total !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New product
        </button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
        />
      </div>

      {/* Table */}
      <ProductTable
        products={products}
        loading={isPending}
        searchQuery={searchQuery}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-gray-500">
            Page {meta.page} of {totalPages} — {meta.total} total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                meta.page <= 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                    page === meta.page
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100',
                  )}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= totalPages}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                meta.page >= totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <ProductDrawer
        open={isDrawerOpen}
        isEditing={currentProduct !== null}
        loading={loading}
        isUploading={isUploading}
        form={form}
        onSubmit={handleSubmit}
        onClose={handleCloseDrawer}
        onUploadFile={handleUploadFile}
      />

      {/* Delete modal */}
      <DeleteProductModal
        open={isDeleteModalOpen}
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
      />
    </div>
  )
}

export default ProductListPage
