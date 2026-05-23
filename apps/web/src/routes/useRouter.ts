import { useNavigate } from 'react-router-dom'
import { AuthRoutes, WorkspaceRoutes, AppRoutes } from './routes'

export const useRouter = () => {
  const navigate = useNavigate()

  return {
    toLogin: () => navigate(AuthRoutes.LOGIN, { replace: true }),
    toRegister: () => navigate(AuthRoutes.REGISTER),
    toDashboard: () => navigate(AppRoutes.DASHBOARD),
    toWorkspaceSelect: () => navigate(WorkspaceRoutes.SELECT),
  }
}
