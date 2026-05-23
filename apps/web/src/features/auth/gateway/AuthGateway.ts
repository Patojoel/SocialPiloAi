import type { User, AuthTokens } from '../models/Auth'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthGateway {
  login(payload: LoginPayload): Promise<{ user: User; accessToken: string; refreshToken: string; expiresIn: number }>
  register(payload: RegisterPayload): Promise<{ user: User; accessToken: string; refreshToken: string }>
  logout(refreshToken: string): Promise<void>
  refresh(refreshToken: string): Promise<AuthTokens>
  me(): Promise<User>
  forgotPassword(email: string): Promise<void>
  resetPassword(token: string, password: string): Promise<void>
  updateProfile(data: Partial<Pick<User, 'firstName' | 'lastName' | 'avatarUrl'>>): Promise<User>
}
