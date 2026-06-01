import { Search, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { PostStatus, Platform } from '../../../models/Post'

const STATUSES: PostStatus[] = ['draft', 'scheduled', 'publishing', 'published', 'failed']
const PLATFORMS: Platform[] = ['facebook', 'instagram', 'tiktok']

const STATUS_STYLES: Record<PostStatus, { idle: string; active: string }> = {
  draft:      { idle: 'border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50',       active: 'border-slate-600 bg-slate-600 text-white shadow-sm' },
  scheduled:  { idle: 'border-blue-100 text-blue-600 hover:border-blue-400 hover:bg-blue-50',           active: 'border-blue-600 bg-blue-600 text-white shadow-sm' },
  publishing: { idle: 'border-amber-100 text-amber-600 hover:border-amber-400 hover:bg-amber-50',       active: 'border-amber-500 bg-amber-500 text-white shadow-sm' },
  published:  { idle: 'border-emerald-100 text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50', active: 'border-emerald-600 bg-emerald-600 text-white shadow-sm' },
  failed:     { idle: 'border-red-100 text-red-500 hover:border-red-400 hover:bg-red-50',               active: 'border-red-500 bg-red-500 text-white shadow-sm' },
}

const STATUS_DOTS: Record<PostStatus, string> = {
  draft: 'bg-slate-400', scheduled: 'bg-blue-500', publishing: 'bg-amber-500', published: 'bg-emerald-500', failed: 'bg-red-500',
}

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Draft', scheduled: 'Scheduled', publishing: 'Publishing', published: 'Published', failed: 'Failed',
}

const PLATFORM_CONFIG: Record<Platform, { icon: string; label: string }> = {
  facebook:  { icon: '📘', label: 'Facebook' },
  instagram: { icon: '📸', label: 'Instagram' },
  tiktok:    { icon: '🎵', label: 'TikTok' },
}

interface PostFiltersBarProps {
  searchQuery: string
  statusFilter: PostStatus | undefined
  platformFilter: Platform | undefined
  onSearchChange: (q: string) => void
  onStatusChange: (s: PostStatus | undefined) => void
  onPlatformChange: (p: Platform | undefined) => void
}

export function PostFiltersBar({
  searchQuery,
  statusFilter,
  platformFilter,
  onSearchChange,
  onStatusChange,
  onPlatformChange,
}: PostFiltersBarProps) {
  const hasActiveFilter = !!statusFilter || !!platformFilter || searchQuery !== ''

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search posts…"
          className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter pills row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
          {STATUSES.map((s) => {
            const active = statusFilter === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => onStatusChange(active ? undefined : s)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150',
                  active ? STATUS_STYLES[s].active : STATUS_STYLES[s].idle,
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', active ? 'bg-white/80' : STATUS_DOTS[s])} />
                {STATUS_LABELS[s]}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* Platform filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform</span>
          {PLATFORMS.map((p) => {
            const active = platformFilter === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPlatformChange(active ? undefined : p)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150',
                  active
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700',
                )}
              >
                <span>{PLATFORM_CONFIG[p].icon}</span>
                {PLATFORM_CONFIG[p].label}
              </button>
            )
          })}
        </div>

        {/* Clear all */}
        {hasActiveFilter && (
          <button
            type="button"
            onClick={() => { onStatusChange(undefined); onPlatformChange(undefined); onSearchChange('') }}
            className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
