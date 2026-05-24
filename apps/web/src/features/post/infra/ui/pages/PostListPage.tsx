import { useNavigate } from 'react-router-dom'
import { Plus, Loader2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { usePostList } from '../hooks/usePostList'
import { PostCard } from '../components/PostCard'
import { PostFilters } from '../components/PostFilters'
import { PostRoutes } from '../../routes/postRoutes'
import { LoadingState } from '@/shared/models/LoadingState'

const PostListPage = () => {
  const navigate = useNavigate()
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
    handleDuplicate,
  } = usePostList()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <p className="mt-1 text-gray-500">Manage and schedule your social media content.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(PostRoutes.CREATE)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white',
              'bg-gradient-to-r from-indigo-600 to-violet-600',
              'hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30',
              'transition-all duration-200',
            )}
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <PostFilters
          statusFilter={filters.status}
          platformFilter={filters.platform}
          onStatusChange={handleStatusFilter}
          onPlatformChange={handlePlatformFilter}
        />
      </div>

      {loading === LoadingState.pending && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      )}

      {loading !== LoadingState.pending && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-gray-600 font-medium">No posts yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first post to get started</p>
          <button
            onClick={() => navigate(PostRoutes.CREATE)}
            className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-lg shadow-indigo-500/30"
          >
            Create Post
          </button>
        </div>
      )}

      {loading !== LoadingState.pending && posts.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
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
        </>
      )}
    </div>
  )
}

export default PostListPage
