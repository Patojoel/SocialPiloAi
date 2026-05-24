'use client'

import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, LogOut, Settings, User, Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { selectCurrentUser } from '@/features/auth/slices/authSelectors'
import { logout } from '@/features/auth/usecases/logout/logout.usecase'
import {
  selectAllWorkspaces,
  selectCurrentWorkspace,
} from '@/features/workspace/slices/workspaceSelectors'
import { switchWorkspace } from '@/features/workspace/usecases/switchWorkspace/switchWorkspace.usecase'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HeaderProps {
  /** Override breadcrumb label map. Key = pathname segment, value = display label */
  breadcrumbLabels?: Record<string, string>
  /** Notification count badge (0 hides badge) */
  notificationCount?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Helper: resolve human-readable page title from pathname
// ---------------------------------------------------------------------------

const DEFAULT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  posts: 'Posts',
  'social-accounts': 'Social Accounts',
  media: 'Media Library',
  settings: 'Settings',
}

function usePageTitle(labels: Record<string, string>) {
  const { pathname } = useLocation()
  const segment = pathname.replace(/^\//, '').split('/')[0] ?? ''
  return labels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
}

// ---------------------------------------------------------------------------
// Animated gradient breadcrumb title
// ---------------------------------------------------------------------------

function BreadcrumbTitle({ title }: { title: string }) {
  return (
    <motion.h1
      key={title}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'text-lg font-bold',
        'bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400',
        'bg-[length:200%_200%] bg-clip-text text-transparent',
        'animate-gradient-x',
      )}
    >
      {title}
    </motion.h1>
  )
}

// ---------------------------------------------------------------------------
// Workspace switcher dropdown (header variant)
// ---------------------------------------------------------------------------

function HeaderWorkspaceSwitcher() {
  const dispatch = useAppDispatch()
  const workspaces = useAppSelector(selectAllWorkspaces)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  // close on outside click
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium',
          'border border-white/10 bg-white/5 backdrop-blur-xl',
          'text-white transition-all duration-200 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]',
        )}
      >
        <span
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold',
            'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow shadow-indigo-500/40',
          )}
        >
          {currentWorkspace?.name?.[0]?.toUpperCase() ?? '?'}
        </span>
        <span className="max-w-[120px] truncate">{currentWorkspace?.name ?? 'Workspace'}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-gray-400 transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className={cn(
              'absolute left-0 top-full mt-2 w-56 z-50',
              'rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-2xl p-1.5 shadow-2xl shadow-black/60',
            )}
          >
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  dispatch(switchWorkspace(ws.id))
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  ws.id === currentWorkspace?.id
                    ? 'bg-indigo-500/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold',
                    'bg-gradient-to-br from-indigo-500 to-violet-500 text-white',
                  )}
                >
                  {ws.name[0]?.toUpperCase()}
                </span>
                <span className="flex-1 truncate">{ws.name}</span>
                {ws.id === currentWorkspace?.id && (
                  <Check className="h-3.5 w-3.5 text-indigo-400" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Notification bell
// ---------------------------------------------------------------------------

function NotificationBell({ count }: { count: number }) {
  const hasNew = count > 0

  return (
    <button
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-xl',
        'border border-white/10 bg-white/5 text-gray-300 backdrop-blur-xl',
        'transition-all duration-200 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95',
      )}
      aria-label={`${count} notifications`}
    >
      <Bell className="h-4.5 w-4.5" />
      {hasNew && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full',
            'bg-gradient-to-r from-violet-500 to-indigo-500 px-1 text-[10px] font-bold text-white',
            'shadow-md shadow-indigo-500/40',
          )}
        >
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        </motion.span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// User avatar dropdown
// ---------------------------------------------------------------------------

function UserAvatarDropdown() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?'

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setOpen(false)
  }

  const menuItems = [
    { label: 'Profile', icon: <User className="h-4 w-4" />, onClick: () => setOpen(false) },
    { label: 'Settings', icon: <Settings className="h-4 w-4" />, onClick: () => setOpen(false) },
    { label: 'Sign out', icon: <LogOut className="h-4 w-4" />, onClick: handleLogout, danger: true },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2.5 rounded-xl px-2.5 py-1.5',
          'border border-white/10 bg-white/5 backdrop-blur-xl',
          'transition-all duration-200 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]',
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white',
            'bg-gradient-to-br from-indigo-500 to-violet-500',
            'ring-1 ring-cyan-400/30 shadow shadow-cyan-500/20',
          )}
        >
          {initials}
        </div>
        <span className="hidden text-sm font-medium text-white sm:block">
          {user?.firstName ?? 'Account'}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-gray-400 transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className={cn(
              'absolute right-0 top-full mt-2 w-52 z-50',
              'rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-2xl shadow-2xl shadow-black/60',
            )}
          >
            {/* User info header */}
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
            </div>

            {/* Menu items */}
            <div className="p-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    item.danger
                      ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <span
                    className={cn(
                      item.danger ? 'text-red-400' : 'text-gray-500',
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Header export
// ---------------------------------------------------------------------------

export const Header = ({
  breadcrumbLabels = {},
  notificationCount = 0,
  className,
}: HeaderProps) => {
  const labels = { ...DEFAULT_LABELS, ...breadcrumbLabels }
  const title = usePageTitle(labels)

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'sticky top-0 z-20 flex h-16 items-center justify-between gap-4 px-6',
        'border-b border-white/10 bg-gray-950/80 backdrop-blur-2xl',
        'shadow-lg shadow-black/20',
        className,
      )}
    >
      {/* Left: breadcrumb title */}
      <div className="flex items-center gap-3">
        <BreadcrumbTitle title={title} />
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3">
        <HeaderWorkspaceSwitcher />
        <NotificationBell count={notificationCount} />
        <UserAvatarDropdown />
      </div>
    </motion.header>
  )
}
