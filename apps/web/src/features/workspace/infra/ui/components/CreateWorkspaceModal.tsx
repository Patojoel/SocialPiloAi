import { useCreateWorkspace } from '../hooks/useCreateWorkspace'
import { cn } from '@/shared/utils/cn'

interface Props {
  onClose: () => void
}

export const CreateWorkspaceModal = ({ onClose }: Props) => {
  const { form, handleSubmit } = useCreateWorkspace()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create workspace</h2>
        <form
          onSubmit={async (e) => {
            await handleSubmit(e)
            onClose()
          }}
          className="space-y-3"
        >
          <div>
            <input
              {...register('name')}
              placeholder="Workspace name"
              className={cn(
                'w-full px-3 py-2 border rounded-md text-sm',
                errors.name ? 'border-red-500' : 'border-gray-300',
              )}
              autoFocus
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
