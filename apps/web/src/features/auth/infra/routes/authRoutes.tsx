import { lazy } from 'react'
import { AuthRoutes } from '@/routes/routes'

const LoginPage = lazy(() => import('../ui/pages/LoginPage'))
const RegisterPage = lazy(() => import('../ui/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('../ui/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('../ui/pages/ResetPasswordPage'))

export const authRouteDefinitions = [
  { path: AuthRoutes.LOGIN, element: <LoginPage /> },
  { path: AuthRoutes.REGISTER, element: <RegisterPage /> },
  { path: AuthRoutes.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: AuthRoutes.RESET_PASSWORD, element: <ResetPasswordPage /> },
]
