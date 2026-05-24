import { cn } from '@/shared/utils/cn'
import type { UseFormRegisterReturn } from 'react-hook-form'
import type { Platform } from '../../../models/Post'

interface PostEditorProps {
  registration: UseFormRegisterReturn
  value: string
  platforms: Platform[]
  error?: string
}

const PLATFORM_LIMITS: Record<Platform, number> = {
  facebook: 63206,
  instagram: 2200,
  tiktok: 2200,
}

function getEffectiveLimit(platforms: Platform[]): number {
  if (platforms.length === 0) return 2200
  return Math.min(...platforms.map((p) => PLATFORM_LIMITS[p]))
}

export function PostEditor({ registration, value, platforms, error }: PostEditorProps) {
  const limit = getEffectiveLimit(platforms)
  const count = value.length
  const remaining = limit - count
  const percentage = Math.min((count / limit) * 100, 100)

  const counterColor =
    remaining < 0
      ? 'text-red-600'
      : remaining < 50
        ? 'text-amber-500'
        : remaining < 200
          ? 'text-yellow-500'
          : 'text-gray-400'

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'relative rounded-xl overflow-hidden transition-all duration-200',
          'ring-1',
          error
            ? 'ring-red-400'
            : 'ring-gray-200 focus-within:ring-2 focus-within:ring-indigo-500',
        )}
      >
        <div
          className={cn(
            'absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none',
            'bg-gradient-to-br from-indigo-50/50 to-purple-50/30',
            'focus-within:opacity-100',
          )}
          style={{ zIndex: 0 }}
        />
        <textarea
          {...registration}
          rows={8}
          className="relative z-10 w-full resize-none p-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed"
          placeholder="Write your post content here..."
        />
        <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-white/80 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  percentage >= 100
                    ? 'bg-gradient-to-r from-red-500 to-rose-400'
                    : percentage >= 85
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500',
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {platforms.length > 0 && (
              <span className="text-xs text-gray-400">
                Limit: {limit.toLocaleString()} chars
              </span>
            )}
          </div>
          <span className={cn('text-xs font-mono font-semibold', counterColor)}>
            {remaining < 0 ? `${Math.abs(remaining)} over limit` : `${remaining} remaining`}
          </span>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
