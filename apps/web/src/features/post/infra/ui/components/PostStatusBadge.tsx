import { cn } from '@/shared/utils/cn'
import type { PostStatus } from '../../../models/Post'
import { Clock, Loader2, CheckCircle, XCircle, FileText } from 'lucide-react'

interface PostStatusBadgeProps {
  status: PostStatus
  className?: string
}

const statusConfig: Record<PostStatus, { label: string; gradient: string; icon: React.ReactNode }> = {
  draft: {
    label: 'Draft',
    gradient: 'from-slate-500 to-slate-400',
    icon: <FileText className="w-3 h-3" />,
  },
  scheduled: {
    label: 'Scheduled',
    gradient: 'from-blue-600 to-blue-400',
    icon: <Clock className="w-3 h-3" />,
  },
  publishing: {
    label: 'Publishing',
    gradient: 'from-amber-500 to-orange-400',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  published: {
    label: 'Published',
    gradient: 'from-emerald-600 to-green-400',
    icon: <CheckCircle className="w-3 h-3" />,
  },
  failed: {
    label: 'Failed',
    gradient: 'from-red-600 to-rose-400',
    icon: <XCircle className="w-3 h-3" />,
  },
}

export function PostStatusBadge({ status, className }: PostStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white',
        'bg-gradient-to-r shadow-sm',
        config.gradient,
        className,
      )}
    >
      {config.icon}
      {config.label}
    </span>
  )
}
