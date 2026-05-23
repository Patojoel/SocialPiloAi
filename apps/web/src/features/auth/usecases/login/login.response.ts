import type { User } from '../../models/Auth'

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}
