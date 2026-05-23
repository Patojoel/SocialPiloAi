import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useRegister } from '../hooks/useRegister'
import { useAppSelector } from '@/config/hooks'
import { selectIsAuthenticated } from '@/features/auth/slices/authSelectors'
import { cn } from '@/shared/utils/cn'
import { AuthRoutes } from '@/routes/routes'

const RegisterPage = () => {
  const { form, handleSubmit, error, isPending } = useRegister()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const {
    register,
    formState: { errors },
  } = form

  return (
    <AuthLayout title="Create account" subtitle="Start managing your social media with AI">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input
              {...register('firstName')}
              className={cn(
                'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
                errors.firstName ? 'border-red-500' : 'border-gray-300',
              )}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input
              {...register('lastName')}
              className={cn(
                'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
                errors.lastName ? 'border-red-500' : 'border-gray-300',
              )}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            className={cn(
              'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.email ? 'border-red-500' : 'border-gray-300',
            )}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
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
          disabled={isPending}
          className={cn(
            'w-full py-2 px-4 rounded-md text-white font-medium text-sm transition-colors',
            isPending ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700',
          )}
        >
          {isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to={AuthRoutes.LOGIN} className="text-primary-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage
