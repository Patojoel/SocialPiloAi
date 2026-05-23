export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface JwtPayload {
  sub: string
  email: string
  workspaceId?: string
}
