import { useWorkspaceList } from '../hooks/useWorkspaceList'
import { cn } from '@/shared/utils/cn'

export const WorkspaceSwitcher = () => {
  const { workspaces, currentWorkspace, handleSwitch } = useWorkspaceList()

  return (
    <div className="relative group">
      <button
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
          'bg-gray-100 hover:bg-gray-200 transition-colors',
        )}
      >
        <span className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
          {currentWorkspace?.name[0]?.toUpperCase() ?? '?'}
        </span>
        <span className="max-w-[120px] truncate text-gray-800">
          {currentWorkspace?.name ?? 'Select workspace'}
        </span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-50">
        {workspaces.map((ws) => (
          <button
            key={ws.id}
            onClick={() => handleSwitch(ws.id)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg',
              ws.id === currentWorkspace?.id && 'bg-primary-50 text-primary-700',
            )}
          >
            <span className="w-5 h-5 rounded bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
              {ws.name[0]?.toUpperCase()}
            </span>
            <span className="truncate">{ws.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
