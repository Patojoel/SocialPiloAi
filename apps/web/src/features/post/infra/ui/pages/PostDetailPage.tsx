import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Video } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { usePostDetail } from '../hooks/usePostDetail'
import { useDeletePost } from '../hooks/useDeletePost'
import { PostStatusBadge } from '../components/PostStatusBadge'
import { PostRoutes } from '../../routes/postRoutes'
import type { Platform } from '../../../models/Post'
import { useAppSelector } from '@/config/hooks'
import { selectMediaByIds } from '@/features/media/slices/mediaSelectors'

const platformColors: Record<Platform, string> = {
  facebook: 'bg-blue-100 text-blue-700',
  instagram: 'bg-pink-100 text-pink-700',
  tiktok: 'bg-slate-900 text-cyan-400',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const PostDetailPage = () => {
  const navigate = useNavigate()
  const { post } = usePostDetail()
  const { handleDelete } = useDeletePost()
  const mediaItems = useAppSelector(selectMediaByIds(post?.mediaIds ?? []))

  if (!post) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Post not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(PostRoutes.LIST)}
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Post Detail</h1>
            <p className="text-sm text-gray-400">Created {formatDate(post.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(PostRoutes.EDIT.replace(':id', post.id))}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(post.id)}
            className="px-4 py-2 rounded-lg bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <PostStatusBadge status={post.status} />
              <div className="flex flex-wrap gap-1.5">
                {post.platforms.map((p) => (
                  <span key={p} className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', platformColors[p])}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Platform Results</h3>
            </div>
            {post.platforms.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {post.platforms.map((platform) => (
                  <div key={platform} className="px-6 py-4 flex items-center gap-4">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', platformColors[platform])}>
                      {platform}
                    </span>
                    <span className="text-sm text-gray-500 flex-1">
                      {post.status === 'published' ? 'Published successfully' : post.status === 'failed' ? 'Failed to publish' : 'Pending'}
                    </span>
                    {post.publishedAt && (
                      <span className="text-xs text-gray-400">{formatDate(post.publishedAt)}</span>
                    )}
                    <ExternalLink className="w-4 h-4 text-gray-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">No platform results yet.</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <PostStatusBadge status={post.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-700">{formatDate(post.createdAt)}</span>
              </div>
              {post.scheduledAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Scheduled</span>
                  <span className="text-gray-700">{formatDate(post.scheduledAt)}</span>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Published</span>
                  <span className="text-gray-700">{formatDate(post.publishedAt)}</span>
                </div>
              )}
              {mediaItems.length > 0 && (
                <div className="pt-1">
                  <span className="text-gray-500 text-sm">Media ({mediaItems.length})</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mediaItems.map((item) => (
                      <div key={item.id} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                        {item.type === 'image' ? (
                          <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            <Video className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage
