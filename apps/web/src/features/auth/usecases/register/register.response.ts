import type { User } from '../../models/Auth'

export interface RegisterResponse {
  user: User
  accessToken: string
  refreshToken: string
}
