import { useSearchParams, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useResetPassword } from '../hooks/useResetPassword'
import { cn } from '@/shared/utils/cn'
import { AuthRoutes } from '@/routes/routes'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()
  const { form, handleSubmit } = useResetPassword(token)
  const {
    register,
    formState: { errors, isSubmitSuccessful },
  } = form

  if (isSubmitSuccessful) {
    navigate(AuthRoutes.LOGIN)
    return null
  }

  return (
    <AuthLayout title="Reset password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
          <input
            {...register('password')}
            type="password"
            className={cn(
              'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.password ? 'border-red-500' : 'border-gray-300',
            )}
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            className={cn(
              'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300',
            )}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white font-medium text-sm bg-primary-600 hover:bg-primary-700"
        >
          Reset password
        </button>
      </form>
    </AuthLayout>
  )
}

export default ResetPasswordPage
