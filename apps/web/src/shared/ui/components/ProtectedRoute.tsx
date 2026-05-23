import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/config/hooks'
import { selectIsAuthenticated } from '@/features/auth/slices/authSelectors'
import { AuthRoutes } from '@/routes/routes'

export const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to={AuthRoutes.LOGIN} replace />
}
