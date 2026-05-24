import { cn } from '@/shared/utils/cn'
import { Loader2, Send, Clock, Save } from 'lucide-react'
import { LoadingState } from '@/shared/models/LoadingState'

type PublishAction = 'draft' | 'publish' | 'schedule'

interface PublishActionsProps {
  loading: LoadingState
  onAction: (action: PublishAction) => void
  hasScheduledAt: boolean
}

export function PublishActions({ loading, onAction, hasScheduledAt }: PublishActionsProps) {
  const isPending = loading === LoadingState.pending

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        disabled={isPending}
        onClick={() => onAction('draft')}
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold',
          'border border-gray-300 text-gray-700',
          'hover:bg-gray-50 hover:border-gray-400 transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Draft
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => onAction('publish')}
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white',
          'bg-gradient-to-r from-indigo-600 to-violet-600',
          'hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30',
          'hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Publish Now
      </button>

      {hasScheduledAt && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => onAction('schedule')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white',
            'bg-gradient-to-r from-violet-600 to-purple-600',
            'hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30',
            'hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
          Schedule
        </button>
      )}
    </div>
  )
}
