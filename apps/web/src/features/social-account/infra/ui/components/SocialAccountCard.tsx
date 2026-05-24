import { cn } from '@/shared/utils/cn'
import type { Platform, SocialAccount } from '../../../models/SocialAccount'
import { X, Plus } from 'lucide-react'

interface SocialAccountCardProps {
  platform: Platform
  accounts: SocialAccount[]
  onConnect: (platform: Platform) => void
  onDisconnect: (id: string) => void
}

const platformConfig: Record<
  Platform,
  {
    label: string
    gradient: string
    borderGradient: string
    icon: string
    textColor: string
  }
> = {
  facebook: {
    label: 'Facebook',
    gradient: 'from-blue-600 to-blue-400',
    borderGradient: 'from-blue-500 to-blue-300',
    icon: '📘',
    textColor: 'text-blue-50',
  },
  instagram: {
    label: 'Instagram',
    gradient: 'from-pink-600 via-purple-500 to-yellow-400',
    borderGradient: 'from-pink-500 via-purple-400 to-yellow-300',
    icon: '📸',
    textColor: 'text-pink-50',
  },
  tiktok: {
    label: 'TikTok',
    gradient: 'from-slate-900 via-pink-500 to-cyan-400',
    borderGradient: 'from-slate-700 via-pink-400 to-cyan-300',
    icon: '🎵',
    textColor: 'text-slate-50',
  },
}

export function SocialAccountCard({ platform, accounts, onConnect, onDisconnect }: SocialAccountCardProps) {
  const config = platformConfig[platform]

  return (
    <div
      className={cn(
        'relative rounded-2xl p-[2px] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
        'bg-gradient-to-br',
        config.borderGradient,
      )}
    >
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className={cn('bg-gradient-to-br p-6', config.gradient)}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{config.icon}</span>
              <div>
                <h3 className={cn('text-xl font-bold', config.textColor)}>{config.label}</h3>
                <p className={cn('text-sm opacity-80', config.textColor)}>
                  {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
                </p>
              </div>
            </div>
            <button
              onClick={() => onConnect(platform)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold',
                'bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200',
                'border border-white/30 hover:border-white/50',
                config.textColor,
              )}
            >
              <Plus className="w-4 h-4" />
              Connect
            </button>
          </div>

          {accounts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                    'bg-white/20 backdrop-blur-sm border border-white/30',
                    config.textColor,
                  )}
                >
                  <span className="max-w-[120px] truncate">{account.accountName}</span>
                  {account.status !== 'active' && (
                    <span className="text-yellow-300 text-xs">({account.status})</span>
                  )}
                  <button
                    onClick={() => onDisconnect(account.id)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    aria-label={`Disconnect ${account.accountName}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {accounts.length === 0 && (
            <p className={cn('text-sm opacity-70', config.textColor)}>
              No accounts connected yet. Click Connect to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
