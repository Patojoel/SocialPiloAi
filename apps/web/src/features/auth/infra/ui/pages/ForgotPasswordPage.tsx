import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useForgotPassword } from '../hooks/useForgotPassword'
import { cn } from '@/shared/utils/cn'
import { AuthRoutes } from '@/routes/routes'

const ForgotPasswordPage = () => {
  const { form, handleSubmit, submitted } = useForgotPassword()
  const {
    register,
    formState: { errors },
  } = form

  if (submitted) {
    return (
      <AuthLayout title="Check your email">
        <p className="text-center text-gray-600 text-sm">
          If that email address is in our system, we&apos;ve sent a password reset link.
        </p>
        <Link
          to={AuthRoutes.LOGIN}
          className="mt-4 block text-center text-primary-600 hover:underline text-sm"
        >
          Back to login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Forgot password" subtitle="Enter your email to receive a reset link">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white font-medium text-sm bg-primary-600 hover:bg-primary-700"
        >
          Send reset link
        </button>
      </form>
      <Link
        to={AuthRoutes.LOGIN}
        className="mt-4 block text-center text-sm text-gray-600 hover:underline"
      >
        Back to login
      </Link>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
