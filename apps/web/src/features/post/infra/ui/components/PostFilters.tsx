import { cn } from '@/shared/utils/cn'
import type { PostStatus, Platform } from '../../../models/Post'

interface PostFiltersProps {
  statusFilter: PostStatus | undefined
  platformFilter: Platform | undefined
  onStatusChange: (status: PostStatus | undefined) => void
  onPlatformChange: (platform: Platform | undefined) => void
}

const statuses: PostStatus[] = ['draft', 'scheduled', 'publishing', 'published', 'failed']
const platforms: Platform[] = ['facebook', 'instagram', 'tiktok']

const statusLabels: Record<PostStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  publishing: 'Publishing',
  published: 'Published',
  failed: 'Failed',
}

const platformLabels: Record<Platform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
}

const statusColors: Record<PostStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 hover:bg-slate-200 data-[active=true]:bg-slate-600 data-[active=true]:text-white',
  scheduled: 'bg-blue-50 text-blue-700 hover:bg-blue-100 data-[active=true]:bg-blue-600 data-[active=true]:text-white',
  publishing: 'bg-amber-50 text-amber-700 hover:bg-amber-100 data-[active=true]:bg-amber-500 data-[active=true]:text-white',
  published: 'bg-green-50 text-green-700 hover:bg-green-100 data-[active=true]:bg-emerald-600 data-[active=true]:text-white',
  failed: 'bg-red-50 text-red-700 hover:bg-red-100 data-[active=true]:bg-red-600 data-[active=true]:text-white',
}

export function PostFilters({ statusFilter, platformFilter, onStatusChange, onPlatformChange }: PostFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              data-active={statusFilter === s}
              onClick={() => onStatusChange(statusFilter === s ? undefined : s)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all duration-150',
                statusColors[s],
              )}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Platform</span>
        <div className="flex flex-wrap gap-1.5">
          {platforms.map((p) => (
            <button
              key={p}
              type="button"
              data-active={platformFilter === p}
              onClick={() => onPlatformChange(platformFilter === p ? undefined : p)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150',
                platformFilter === p
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600',
              )}
            >
              {platformLabels[p]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
