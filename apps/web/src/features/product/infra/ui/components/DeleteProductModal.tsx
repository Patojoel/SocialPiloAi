import { Loader2, Trash2 } from 'lucide-react'
import { LoadingState } from '@/shared/models/LoadingState'

interface DeleteProductModalProps {
  open: boolean
  loading: LoadingState
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteProductModal({ open, loading, onConfirm, onCancel }: DeleteProductModalProps) {
  if (!open) return null

  const isPending = loading === LoadingState.pending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>

        <h2 className="text-base font-semibold text-gray-900 text-center">Delete product</h2>
        <p className="text-sm text-gray-500 text-center mt-1.5">
          This action is irreversible. The product will be permanently deleted.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
