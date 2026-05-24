import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ProtectedRoute } from '@/shared/ui/components/ProtectedRoute'
import { DashboardLayout } from '@/shared/ui/layouts/DashboardLayout'
import { AuthRoutes, WorkspaceRoutes, SocialAccountRoutes, MediaRoutes, PostRoutes } from './routes'
import { store } from '@/provider/Provider'
import { listSocialAccounts } from '@/features/social-account/usecases/listSocialAccounts.usecase'
import { listMedia } from '@/features/media/usecases/listMedia.usecase'
import { listPosts } from '@/features/post/usecases/listPosts.usecase'
import { getPostById } from '@/features/post/usecases/getPostById.usecase'

const LoginPage = lazy(() => import('@/features/auth/infra/ui/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/infra/ui/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/infra/ui/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/infra/ui/pages/ResetPasswordPage'))
const WorkspaceSelectPage = lazy(() => import('@/features/workspace/infra/ui/pages/WorkspaceSelectPage'))
const SocialAccountsPage = lazy(() => import('@/features/social-account/infra/ui/pages/SocialAccountsPage'))
const OAuthCallbackPage = lazy(() => import('@/features/social-account/infra/ui/pages/OAuthCallbackPage'))
const MediaPage = lazy(() => import('@/features/media/infra/ui/pages/MediaPage'))
const PostListPage = lazy(() => import('@/features/post/infra/ui/pages/PostListPage'))
const PostCreatePage = lazy(() => import('@/features/post/infra/ui/pages/PostCreatePage'))
const PostDetailPage = lazy(() => import('@/features/post/infra/ui/pages/PostDetailPage'))

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
        path: SocialAccountRoutes.OAUTH_CALLBACK_FB,
        element: <Suspense><OAuthCallbackPage /></Suspense>,
      },
      {
        path: SocialAccountRoutes.OAUTH_CALLBACK_TT,
        element: <Suspense><OAuthCallbackPage /></Suspense>,
      },
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          {
            path: SocialAccountRoutes.LIST,
            element: <Suspense><SocialAccountsPage /></Suspense>,
            loader: async () => {
              void store.dispatch(listSocialAccounts())
              return null
            },
          },
          {
            path: MediaRoutes.LIST,
            element: <Suspense><MediaPage /></Suspense>,
            loader: async () => {
              void store.dispatch(listMedia({ page: 1, limit: 20 }))
              return null
            },
          },
          {
            path: PostRoutes.LIST,
            element: <Suspense><PostListPage /></Suspense>,
            loader: async () => {
              void store.dispatch(listPosts({ page: 1, limit: 20 }))
              return null
            },
          },
          {
            path: PostRoutes.CREATE,
            element: <Suspense><PostCreatePage /></Suspense>,
            loader: async () => {
              void store.dispatch(listMedia({ page: 1, limit: 100 }))
              return null
            },
          },
          {
            path: PostRoutes.EDIT,
            element: <Suspense><PostCreatePage /></Suspense>,
            loader: async ({ params }) => {
              if (params['id']) {
                void store.dispatch(getPostById(params['id']))
                void store.dispatch(listMedia({ page: 1, limit: 100 }))
              }
              return null
            },
          },
          {
            path: PostRoutes.DETAIL,
            element: <Suspense><PostDetailPage /></Suspense>,
            loader: async ({ params }) => {
              if (params['id']) {
                void store.dispatch(getPostById(params['id']))
              }
              return null
            },
          },
        ],
      },
    ],
  },
  { path: '/', element: <Suspense><LoginPage /></Suspense> },
])

export const Router = () => <RouterProvider router={router} />
