import { FetchHttpProvider } from '@/shared/infra/http/FetchHttpProvider'
import { HttpAuthGateway } from '@/features/auth/infra/repo/HttpAuthGateway'
import { HttpWorkspaceGateway } from '@/features/workspace/infra/repo/HttpWorkspaceGateway'
import { HttpSocialAccountGateway } from '@/features/social-account/infra/repo/HttpSocialAccountGateway'
import { HttpMediaGateway } from '@/features/media/infra/repo/HttpMediaGateway'
import { HttpPostGateway } from '@/features/post/infra/repo/HttpPostGateway'
import type { Dependencies } from './dependencies'

const API_URL = (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'http://localhost:3000'

export const httpProvider = new FetchHttpProvider(`${API_URL}/api/v1`)

export const dependencies: Dependencies = {
  authGateway: new HttpAuthGateway(httpProvider),
  workspaceGateway: new HttpWorkspaceGateway(httpProvider),
  socialAccountGateway: new HttpSocialAccountGateway(httpProvider),
  mediaGateway: new HttpMediaGateway(httpProvider, `${API_URL}/api/v1`),
  postGateway: new HttpPostGateway(httpProvider),
}
