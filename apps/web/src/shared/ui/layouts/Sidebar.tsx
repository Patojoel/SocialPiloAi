'use client'

import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Users,
  Image as ImageIcon,
  Package,
  Settings,
  Menu,
  X,
  ChevronDown,
  Check,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { selectCurrentUser } from '@/features/auth/slices/authSelectors'
import {
  selectAllWorkspaces,
  selectCurrentWorkspace,
} from '@/features/workspace/slices/workspaceSelectors'
import { switchWorkspace } from '@/features/workspace/usecases/switchWorkspace/switchWorkspace.usecase'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

interface SidebarProps {
  logoText?: string
  navItems?: NavItem[]
  className?: string
}

// ---------------------------------------------------------------------------
// Animated gradient logo text
// ---------------------------------------------------------------------------

function GradientLogoText({ text }: { text: string }) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400',
        'bg-[length:200%_200%] bg-clip-text text-transparent',
        'animate-gradient-x text-2xl font-extrabold tracking-tight',
      )}
    >
      {text}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Workspace switcher (bottom section)
// ---------------------------------------------------------------------------

function WorkspaceSwitcherPanel() {
  const dispatch = useAppDispatch()
  const workspaces = useAppSelector(selectAllWorkspaces)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const [open, setOpen] = React.useState(false)

  const handleSwitch = (id: string) => {
    dispatch(switchWorkspace(id))
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'group w-full flex items-center justify-between gap-2',
          'rounded-xl px-4 py-3 text-left text-sm',
          'bg-white/5 hover:bg-white/10 border border-white/10',
          'backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
              'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30',
            )}
          >
            {currentWorkspace?.name?.[0]?.toUpperCase() ?? '?'}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Workspace</p>
            <p className="truncate text-sm font-medium text-white">
              {currentWorkspace?.name ?? 'Select workspace'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className={cn(
              'absolute bottom-full left-0 mb-2 w-full z-50',
              'rounded-xl border border-white/10 bg-gray-900/90 backdrop-blur-2xl p-1.5 shadow-2xl',
            )}
          >
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleSwitch(ws.id)}
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
// Sidebar content (shared between mobile / desktop)
// ---------------------------------------------------------------------------

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Posts', to: '/posts', icon: <FileText className="h-5 w-5" /> },
  { label: 'Products', to: '/products', icon: <Package className="h-5 w-5" /> },
  { label: 'Social Accounts', to: '/social-accounts', icon: <Users className="h-5 w-5" /> },
  { label: 'Media Library', to: '/media', icon: <ImageIcon className="h-5 w-5" /> },
  { label: 'Settings', to: '/settings', icon: <Settings className="h-5 w-5" /> },
]

function SidebarContent({
  logoText,
  navItems,
}: {
  logoText: string
  navItems: NavItem[]
}) {
  const user = useAppSelector(selectCurrentUser)
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Logo */}
      <div className="relative m-4 overflow-hidden rounded-2xl border border-white/10 p-5 backdrop-blur-xl bg-gradient-to-br from-indigo-600/20 via-violet-600/15 to-purple-600/20">
        {/* animated ambient blob */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(99,102,241,0.35) 0%, transparent 60%)',
              'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.35) 0%, transparent 60%)',
              'radial-gradient(circle at 50% 80%, rgba(168,85,247,0.35) 0%, transparent 60%)',
              'radial-gradient(circle at 20% 50%, rgba(99,102,241,0.35) 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <GradientLogoText text={logoText} />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-none">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                  'transition-colors duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/25 via-violet-600/20 to-purple-600/25 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white',
                )}
              >
                {/* Active glow pulse */}
                {isActive && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/15 via-violet-500/15 to-cyan-500/15"
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Icon */}
                <span
                  className={cn(
                    'relative z-10 transition-colors duration-200',
                    isActive
                      ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                      : 'text-gray-500 group-hover:text-indigo-400',
                  )}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span className="relative z-10">{item.label}</span>

                {/* Active left-bar accent */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500" />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: workspace + user */}
      <div className="space-y-3 border-t border-white/10 p-4">
        <WorkspaceSwitcherPanel />

        {/* User card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.18 }}
          className={cn(
            'relative overflow-hidden rounded-xl border border-white/10 p-4 backdrop-blur-xl',
            'bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-purple-600/15',
          )}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, rgba(99,102,241,0.5) 0%, transparent 60%)',
                'radial-gradient(circle at 100% 100%, rgba(139,92,246,0.5) 0%, transparent 60%)',
                'radial-gradient(circle at 0% 0%, rgba(99,102,241,0.5) 0%, transparent 60%)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative flex items-center gap-3">
            {/* Avatar */}
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                'bg-gradient-to-br from-indigo-500 to-violet-500',
                'ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/20',
              )}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export const Sidebar = ({
  logoText = 'SocialPilot AI',
  navItems = DEFAULT_NAV_ITEMS,
  className,
}: SidebarProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className={cn(
          'fixed left-4 top-4 z-50 md:hidden',
          'flex h-10 w-10 items-center justify-center rounded-xl',
          'border border-white/10 bg-black/60 text-white backdrop-blur-xl',
          'transition-colors hover:bg-white/10',
        )}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: mobileOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 md:hidden',
          'bg-gradient-to-br from-gray-950/98 via-black/98 to-gray-950/98 backdrop-blur-2xl',
          'border-r border-white/10 shadow-2xl shadow-indigo-500/10',
          className,
        )}
      >
        <SidebarContent logoText={logoText} navItems={navItems} />
      </motion.aside>

      {/* Desktop sidebar */}
      <motion.aside
        className={cn(
          'hidden md:flex md:flex-col fixed inset-y-0 left-0 z-30 w-72',
          'bg-gradient-to-br from-gray-950/98 via-black/98 to-gray-950/98 backdrop-blur-2xl',
          'border-r border-white/10 shadow-2xl shadow-indigo-500/10',
          className,
        )}
        style={{ perspective: '1200px' }}
      >
        {/* Animated ambient background */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-25"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.2) 0%, transparent 55%)',
              'radial-gradient(circle at 80% 80%, rgba(139,92,246,0.2) 0%, transparent 55%)',
              'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.2) 0%, transparent 55%)',
              'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.2) 0%, transparent 55%)',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <SidebarContent logoText={logoText} navItems={navItems} />
      </motion.aside>
    </>
  )
}
