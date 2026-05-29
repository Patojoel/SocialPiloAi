import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useAppSelector } from '@/config/hooks'
import { useAppDispatch } from '@/config/hooks'
import { selectAllSocialAccounts } from '../../../slices/socialAccountSelectors'
import { fetchFacebookPages } from '../../../usecases/fetchFacebookPages.usecase'
import type { Platform, SocialAccount } from '../../../models/SocialAccount'
import type { FacebookPage } from '../../../models/FacebookPage'

const PLATFORM_CONFIG: Record<Platform, { label: string; icon: string; bg: string; ring: string }> = {
  facebook: {
    label: 'Facebook',
    icon: '📘',
    bg: 'bg-blue-600',
    ring: 'ring-blue-400',
  },
  instagram: {
    label: 'Instagram',
    icon: '📸',
    bg: 'bg-gradient-to-br from-pink-600 to-yellow-400',
    ring: 'ring-pink-400',
  },
  tiktok: {
    label: 'TikTok',
    icon: '🎵',
    bg: 'bg-slate-900',
    ring: 'ring-cyan-400',
  },
}

const STATUS_LABEL: Record<SocialAccount['status'], { label: string; color: string }> = {
  active: { label: 'Active', color: 'text-emerald-600 bg-emerald-50' },
  expired: { label: 'Expired', color: 'text-amber-600 bg-amber-50' },
  revoked: { label: 'Revoked', color: 'text-red-600 bg-red-50' },
}

interface AccountPopoverProps {
  account: SocialAccount
  anchorRef: React.RefObject<HTMLButtonElement | null>
  onClose: () => void
}

function FacebookPagesList({ accountId }: { accountId: string }) {
  const dispatch = useAppDispatch()
  const [pages, setPages] = useState<FacebookPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    dispatch(fetchFacebookPages(accountId))
      .unwrap()
      .then((result) => {
        setPages(result)
        setLoading(false)
      })
      .catch((err: { message?: string }) => {
        setError(err.message ?? 'Failed to load pages')
        setLoading(false)
      })
  }, [accountId, dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-3">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return <p className="text-xs text-red-500 py-1">{error}</p>
  }

  if (pages.length === 0) {
    return <p className="text-xs text-gray-400 py-1">No pages found for this account.</p>
  }

  return (
    <div className="space-y-1">
      {pages.map((page) => (
        <div key={page.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
          <span className="text-sm">📄</span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">{page.name}</p>
            <p className="text-xs text-gray-400 truncate">{page.category}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function AccountPopover({ account, anchorRef, onClose }: AccountPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const config = PLATFORM_CONFIG[account.platform]
  const statusInfo = STATUS_LABEL[account.status]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [anchorRef, onClose])

  return (
    <div
      ref={popoverRef}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64 rounded-xl bg-white border border-gray-100 shadow-xl p-3"
    >
      {/* Arrow */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />

      {/* Account header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-sm', config.bg)}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">{account.accountName}</p>
          <p className="text-xs text-gray-400">{config.label}</p>
        </div>
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full shrink-0', statusInfo.color)}>
          {statusInfo.label}
        </span>
      </div>

      <div className="border-t border-gray-50 pt-2">
        {account.platform === 'facebook' ? (
          <>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Pages disponibles</p>
            <FacebookPagesList accountId={account.id} />
          </>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-1">Publishing target</p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-2">
              <span className="text-sm">{config.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{account.accountName}</p>
                <p className="text-xs text-gray-400">
                  {account.platform === 'instagram' && 'Instagram Business Account'}
                  {account.platform === 'tiktok' && 'TikTok Channel'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface AccountAvatarProps {
  account: SocialAccount
}

function AccountAvatar({ account }: AccountAvatarProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const config = PLATFORM_CONFIG[account.platform]
  const isActive = account.status === 'active'

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        title={account.accountName}
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center text-base',
          'ring-2 ring-offset-1 transition-all duration-150 hover:scale-110',
          config.bg,
          isActive ? config.ring : 'ring-gray-300',
          !isActive && 'opacity-60',
        )}
      >
        {config.icon}
      </button>
      {open && (
        <AccountPopover
          account={account}
          anchorRef={buttonRef}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

export function ConnectedAccountsBar() {
  const accounts = useAppSelector(selectAllSocialAccounts)

  if (accounts.length === 0) return null

  const platforms: Platform[] = ['facebook', 'instagram', 'tiktok']

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">
          Connected accounts
        </span>

        {platforms.map((platform) => {
          const platformAccounts = accounts.filter((a) => a.platform === platform)
          if (platformAccounts.length === 0) return null

          return (
            <div key={platform} className="flex items-center gap-1.5">
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs text-gray-500 font-medium mr-1">
                {PLATFORM_CONFIG[platform].label}
              </span>
              {platformAccounts.map((account) => (
                <AccountAvatar key={account.id} account={account} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
