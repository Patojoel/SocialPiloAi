import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { usePostList } from '../hooks/usePostList'
import { PostTable } from '../components/PostTable'
import { PostFiltersBar } from '../components/PostFiltersBar'
import { PostRoutes } from '../../routes/postRoutes'
import { LoadingState } from '@/shared/models/LoadingState'
import { ConnectedAccountsBar } from '@/features/social-account/infra/ui/components/ConnectedAccountsBar'

const PostListPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const {
    posts,
    loading,
    meta,
    filters,
    handleRefresh,
    handlePageChange,
    handleStatusFilter,
    handlePlatformFilter,
    handleDelete,
  } = usePostList()

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {meta.total > 0 ? `${meta.total} post${meta.total > 1 ? 's' : ''}` : 'Manage your social media content'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(PostRoutes.CREATE)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white',
              'bg-gradient-to-r from-indigo-600 to-violet-600',
              'hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/25',
              'transition-all duration-200',
            )}
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </div>

      {/* Connected accounts */}
      <ConnectedAccountsBar />

      {/* Filters */}
      <PostFiltersBar
        searchQuery={searchQuery}
        statusFilter={filters.status}
        platformFilter={filters.platform}
        onSearchChange={setSearchQuery}
        onStatusChange={handleStatusFilter}
        onPlatformChange={handlePlatformFilter}
      />

      {/* Table */}
      <PostTable
        posts={posts}
        loading={loading === LoadingState.pending}
        searchQuery={searchQuery}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {!loading && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-400">
            Page {meta.page} of {meta.totalPages} — {meta.total} posts
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center border text-sm transition-all',
                meta.page <= 1
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50',
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-medium transition-all',
                    page === meta.page
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50',
                  )}
                >
                  {page}
                </button>
              )
            })}

            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center border text-sm transition-all',
                meta.page >= meta.totalPages
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50',
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostListPage
