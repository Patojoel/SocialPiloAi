import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: '⊞' },
  { label: 'Posts', to: '/posts', icon: '📝' },
  { label: 'Social Accounts', to: '/social-accounts', icon: '🔗' },
]

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <span className="text-lg font-bold text-primary-600">SocialPilot AI</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50',
              )
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
