import { cn } from '@/shared/utils/cn'
import type { Platform } from '../../../models/Post'
import { Check } from 'lucide-react'

interface PlatformSelectorProps {
  selected: Platform[]
  onChange: (platforms: Platform[]) => void
  error?: string
}

const platforms: Array<{
  id: Platform
  label: string
  icon: string
  gradient: string
  glow: string
  textColor: string
}> = [
  {
    id: 'facebook',
    label: 'Facebook',
    icon: '📘',
    gradient: 'from-blue-600 to-blue-400',
    glow: 'shadow-blue-500/40',
    textColor: 'text-blue-700',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: '📸',
    gradient: 'from-pink-600 via-purple-500 to-yellow-400',
    glow: 'shadow-pink-500/40',
    textColor: 'text-pink-700',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: '🎵',
    gradient: 'from-slate-900 via-pink-500 to-cyan-400',
    glow: 'shadow-cyan-500/40',
    textColor: 'text-slate-900',
  },
]

export function PlatformSelector({ selected, onChange, error }: PlatformSelectorProps) {
  const toggle = (platform: Platform) => {
    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform))
    } else {
      onChange([...selected, platform])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        {platforms.map((p) => {
          const isSelected = selected.includes(p.id)
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={cn(
                'flex-1 relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200',
                isSelected
                  ? [
                      'border-transparent bg-gradient-to-br text-white shadow-lg',
                      p.gradient,
                      p.glow,
                    ]
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm',
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-2xl">{p.icon}</span>
              <span
                className={cn(
                  'text-xs font-semibold',
                  isSelected ? 'text-white' : p.textColor,
                )}
              >
                {p.label}
              </span>
            </button>
          )
        })}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
