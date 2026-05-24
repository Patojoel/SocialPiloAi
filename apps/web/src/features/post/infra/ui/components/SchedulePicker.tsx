import { cn } from '@/shared/utils/cn'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Calendar } from 'lucide-react'

interface SchedulePickerProps {
  registration: UseFormRegisterReturn
  error?: string
  value?: string | null
}

function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

function getMinDatetime(): string {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5)
  return now.toISOString().slice(0, 16)
}

export function SchedulePicker({ registration, error, value }: SchedulePickerProps) {
  const tz = getLocalTimezone()
  const min = getMinDatetime()

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-indigo-500" />
        Schedule Date &amp; Time
        <span className="text-xs text-gray-400 font-normal ml-1">({tz})</span>
      </label>
      <div
        className={cn(
          'relative rounded-xl overflow-hidden ring-1 transition-all duration-200',
          error ? 'ring-red-400' : 'ring-gray-200 focus-within:ring-2 focus-within:ring-indigo-500',
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/40 to-purple-50/40 pointer-events-none" />
        <input
          {...registration}
          type="datetime-local"
          min={min}
          className="relative z-10 w-full px-4 py-2.5 bg-transparent text-sm text-gray-700 focus:outline-none"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {value && !error && (
        <p className="text-xs text-gray-400">
          Will publish at:{' '}
          {new Date(value).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      )}
    </div>
  )
}
