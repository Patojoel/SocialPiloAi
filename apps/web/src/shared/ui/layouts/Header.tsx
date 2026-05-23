import { useAppDispatch, useAppSelector } from '@/config/hooks'
import { selectCurrentUser } from '@/features/auth/slices/authSelectors'
import { logout } from '@/features/auth/usecases/logout/logout.usecase'
import { WorkspaceSwitcher } from '@/features/workspace/infra/ui/components/WorkspaceSwitcher'

export const Header = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <WorkspaceSwitcher />
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {user?.firstName} {user?.lastName}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
