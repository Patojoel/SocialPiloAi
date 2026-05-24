import { cn } from '@/shared/utils/cn'
import type { Post, Platform } from '../../../models/Post'
import { PostStatusBadge } from './PostStatusBadge'
import { Edit2, Copy, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PostRoutes } from '../../routes/postRoutes'

interface PostCardProps {
  post: Post
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

const platformColors: Record<Platform, string> = {
  facebook: 'bg-blue-100 text-blue-700',
  instagram: 'bg-pink-100 text-pink-700',
  tiktok: 'bg-slate-900 text-cyan-400',
}

const platformLabels: Record<Platform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function PostCard({ post, onDuplicate, onDelete }: PostCardProps) {
  const navigate = useNavigate()
  const preview = post.content.length > 120 ? `${post.content.slice(0, 120)}...` : post.content

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl border border-gray-100 p-5',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60',
        'cursor-pointer',
      )}
      onClick={() => navigate(PostRoutes.DETAIL.replace(':id', post.id))}
    >
      <div className="flex items-start justify-between mb-3">
        <PostStatusBadge status={post.status} />
        <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">{preview}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.platforms.map((platform) => (
          <span
            key={platform}
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              platformColors[platform],
            )}
          >
            {platformLabels[platform]}
          </span>
        ))}
      </div>

      {post.scheduledAt && (
        <p className="text-xs text-gray-400 mb-3">
          Scheduled: {formatDate(post.scheduledAt)}
        </p>
      )}

      <div
        className="flex items-center gap-2 pt-3 border-t border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => navigate(PostRoutes.EDIT.replace(':id', post.id))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDuplicate(post.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Duplicate
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  )
}
