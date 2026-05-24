import { MediaUploader } from '../components/MediaUploader'
import { MediaLibrary } from '../components/MediaLibrary'
import { useMedia } from '../hooks/useMedia'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { LoadingState } from '@/shared/models/LoadingState'

function MediaGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
          <div className="aspect-square bg-gray-100 animate-pulse" />
          <div className="px-2 py-1.5 bg-white space-y-1">
            <div className="h-2.5 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

const MediaPage = () => {
  const { items, loading, meta, handleDelete, handlePageChange } = useMedia()
  const isLoading = loading === LoadingState.pending
console.log(items)
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="mt-2 text-gray-500">Upload and manage images and videos for your posts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Upload Media</h2>
        <MediaUploader />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">
            All Media
            {meta.total > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({meta.total} files)</span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <MediaGridSkeleton />
        ) : (
          <MediaLibrary items={items} onDelete={handleDelete} />
        )}

        {!isLoading && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center border transition-colors',
                meta.page <= 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600',
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center border transition-colors',
                meta.page >= meta.totalPages
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600',
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaPage
