import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye, Pencil, Trash2, ChevronUp, ChevronDown,
  Clock, Loader2, CheckCircle2, XCircle, FileText,
  Calendar, ArrowUpDown,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { Post, PostStatus, Platform } from '../../../models/Post'
import { PostRoutes } from '../../routes/postRoutes'

// ─── Config ────────────────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<Platform, { label: string; icon: string; bg: string; text: string }> = {
  facebook:  { label: 'Facebook',  icon: '📘', bg: 'bg-blue-50',  text: 'text-blue-700'  },
  instagram: { label: 'Instagram', icon: '📸', bg: 'bg-pink-50',  text: 'text-pink-700'  },
  tiktok:    { label: 'TikTok',    icon: '🎵', bg: 'bg-slate-100', text: 'text-slate-700' },
}

const STATUS_CONFIG: Record<PostStatus, { label: string; icon: React.ReactNode; bg: string; text: string; dot: string }> = {
  draft:      { label: 'Draft',      icon: <FileText   className="w-3 h-3" />, bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  scheduled:  { label: 'Scheduled',  icon: <Clock      className="w-3 h-3" />, bg: 'bg-blue-50',   text: 'text-blue-700',  dot: 'bg-blue-500'  },
  publishing: { label: 'Publishing', icon: <Loader2    className="w-3 h-3 animate-spin" />, bg: 'bg-amber-50',  text: 'text-amber-700', dot: 'bg-amber-500' },
  published:  { label: 'Published',  icon: <CheckCircle2 className="w-3 h-3" />, bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  failed:     { label: 'Failed',     icon: <XCircle    className="w-3 h-3" />, bg: 'bg-red-50',    text: 'text-red-600',   dot: 'bg-red-500'   },
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PostStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', cfg.bg, cfg.text)}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function PlatformBadge({ platform }: { platform: Platform }) {
  const cfg = PLATFORM_CONFIG[platform]
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', cfg.bg, cfg.text)}>
      <span className="text-xs">{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-gray-100 rounded-md animate-pulse" style={{ width: `${60 + (i * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  )
}

// ─── Sort types ─────────────────────────────────────────────────────────────

type SortKey = 'content' | 'status' | 'scheduledAt' | 'createdAt'
type SortDir = 'asc' | 'desc'

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" />
  return dir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-indigo-600" />
    : <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface PostTableProps {
  posts: Post[]
  loading: boolean
  searchQuery: string
  onDelete: (id: string) => void
}

export function PostTable({ posts, loading, searchQuery, onDelete }: PostTableProps) {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = posts.filter((p) =>
    searchQuery === '' || p.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sorted = [...filtered].sort((a, b) => {
    let valA: string | null = null
    let valB: string | null = null
    if (sortKey === 'content')     { valA = a.content;     valB = b.content }
    if (sortKey === 'status')      { valA = a.status;      valB = b.status }
    if (sortKey === 'scheduledAt') { valA = a.scheduledAt; valB = b.scheduledAt }
    if (sortKey === 'createdAt')   { valA = a.createdAt;   valB = b.createdAt }
    if (!valA && !valB) return 0
    if (!valA) return 1
    if (!valB) return -1
    return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })

  const thClass = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80 group cursor-pointer select-none hover:text-gray-700 transition-colors'
  const thStatic = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80'

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={thClass} onClick={() => handleSort('content')}>
                <div className="flex items-center gap-1.5">
                  Content
                  <SortIcon col="content" sortKey={sortKey} dir={sortDir} />
                </div>
              </th>
              <th className={thStatic}>Platforms</th>
              <th className={thClass} onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1.5">
                  Status
                  <SortIcon col="status" sortKey={sortKey} dir={sortDir} />
                </div>
              </th>
              <th className={thClass} onClick={() => handleSort('scheduledAt')}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Scheduled
                  <SortIcon col="scheduledAt" sortKey={sortKey} dir={sortDir} />
                </div>
              </th>
              <th className={thClass} onClick={() => handleSort('createdAt')}>
                <div className="flex items-center gap-1.5">
                  Created
                  <SortIcon col="createdAt" sortKey={sortKey} dir={sortDir} />
                </div>
              </th>
              <th className={thStatic + ' text-right'}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm">
                      {searchQuery ? 'No posts match your search' : 'No posts yet'}
                    </p>
                    {!searchQuery && (
                      <p className="text-gray-400 text-xs">Create your first post to get started</p>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {!loading && sorted.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-indigo-50/30 transition-colors duration-100 group/row"
              >
                {/* Content */}
                <td className="px-4 py-3.5 max-w-[280px]">
                  <p className="text-gray-800 font-medium text-sm truncate leading-snug">
                    {post.content.slice(0, 80)}{post.content.length > 80 ? '…' : ''}
                  </p>
                  {post.mediaIds.length > 0 && (
                    <span className="text-xs text-gray-400 mt-0.5 block">{post.mediaIds.length} media</span>
                  )}
                </td>

                {/* Platforms */}
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {post.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={post.status} />
                </td>

                {/* Scheduled */}
                <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                  {post.scheduledAt ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-400" />
                      {formatDate(post.scheduledAt)}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>

                {/* Created */}
                <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                  {formatDate(post.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1 opacity-60 group-hover/row:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(PostRoutes.DETAIL.replace(':id', post.id))}
                      title="View"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(PostRoutes.EDIT.replace(':id', post.id))}
                      title="Edit"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(post.id)}
                      title="Delete"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
