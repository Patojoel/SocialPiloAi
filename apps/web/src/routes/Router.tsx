import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ProtectedRoute } from '@/shared/ui/components/ProtectedRoute'
import { DashboardLayout } from '@/shared/ui/layouts/DashboardLayout'
import { AuthRoutes, WorkspaceRoutes } from './routes'

const LoginPage = lazy(() => import('@/features/auth/infra/ui/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/infra/ui/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/infra/ui/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/infra/ui/pages/ResetPasswordPage'))
const WorkspaceSelectPage = lazy(() => import('@/features/workspace/infra/ui/pages/WorkspaceSelectPage'))

const DashboardPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
    <p className="text-gray-600 mt-2">Welcome to SocialPilot AI</p>
  </div>
)

const router = createBrowserRouter([
  { path: AuthRoutes.LOGIN, element: <Suspense><LoginPage /></Suspense> },
  { path: AuthRoutes.REGISTER, element: <Suspense><RegisterPage /></Suspense> },
  { path: AuthRoutes.FORGOT_PASSWORD, element: <Suspense><ForgotPasswordPage /></Suspense> },
  { path: AuthRoutes.RESET_PASSWORD, element: <Suspense><ResetPasswordPage /></Suspense> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: WorkspaceRoutes.SELECT, element: <Suspense><WorkspaceSelectPage /></Suspense> },
      {
        element: <DashboardLayout />,
        children: [{ path: '/dashboard', element: <DashboardPage /> }],
      },
    ],
  },
  { path: '/', element: <Suspense><LoginPage /></Suspense> },
])

export const Router = () => <RouterProvider router={router} />
