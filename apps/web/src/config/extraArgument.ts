import { FetchHttpProvider } from '@/shared/infra/http/FetchHttpProvider'
import { HttpAuthGateway } from '@/features/auth/infra/repo/HttpAuthGateway'
import { HttpWorkspaceGateway } from '@/features/workspace/infra/repo/HttpWorkspaceGateway'
import type { Dependencies } from './dependencies'

const API_URL = (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'http://localhost:3000'

export const httpProvider = new FetchHttpProvider(`${API_URL}/api/v1`)

export const dependencies: Dependencies = {
  authGateway: new HttpAuthGateway(httpProvider),
  workspaceGateway: new HttpWorkspaceGateway(httpProvider),
}
