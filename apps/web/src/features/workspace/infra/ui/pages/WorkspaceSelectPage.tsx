import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/config/hooks'
import { selectAllWorkspaces } from '@/features/workspace/slices/workspaceSelectors'
import { useCreateWorkspace } from '../hooks/useCreateWorkspace'
import { cn } from '@/shared/utils/cn'

const WorkspaceSelectPage = () => {
  const workspaces = useAppSelector(selectAllWorkspaces)
  const navigate = useNavigate()
  const { form, handleSubmit } = useCreateWorkspace()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select a workspace</h1>

        {workspaces.length > 0 && (
          <div className="mb-6 space-y-2">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-3">
                  <span className="text-primary-700 font-bold text-sm">{ws.name[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{ws.name}</p>
                  <p className="text-xs text-gray-500">{ws.slug}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Create a new workspace</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                {...register('name')}
                placeholder="Workspace name"
                className={cn(
                  'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
                  errors.name ? 'border-red-500' : 'border-gray-300',
                )}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md text-white font-medium text-sm bg-primary-600 hover:bg-primary-700"
            >
              Create workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceSelectPage
