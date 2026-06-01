export const AuthRoutes = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const

export const WorkspaceRoutes = {
  SELECT: '/workspace-select',
} as const

export const AppRoutes = {
  DASHBOARD: '/dashboard',
} as const

export const SocialAccountRoutes = {
  LIST: '/social-accounts',
  OAUTH_CALLBACK_FB: '/auth/facebook/callback',
  OAUTH_CALLBACK_TT: '/auth/tiktok/callback',
} as const

export const MediaRoutes = {
  LIST: '/media',
} as const

export const PostRoutes = {
  LIST: '/posts',
  CREATE: '/posts/new',
  EDIT: '/posts/:id/edit',
  DETAIL: '/posts/:id',
} as const

export const ProductRoutes = {
  LIST: '/products',
} as const
