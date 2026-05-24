import type { AuthGateway, LoginPayload, RegisterPayload } from '../../gateway/AuthGateway'
import type { HttpProvider } from '@/shared/infra/http/HttpProvider'
import type { User, AuthTokens } from '../../models/Auth'
import { toCamelCase } from '@/shared/utils/caseTransform'

interface ApiUser {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url: string | null
}

interface ApiLoginResponse {
  data: {
    user: ApiUser
    accessToken: string
    refreshToken: string
    expires_in: number
  }
}

export class HttpAuthGateway implements AuthGateway {
  constructor(private readonly http: HttpProvider) {}

  async login(payload: LoginPayload) {
    const res = await this.http.post<ApiLoginResponse>('/auth/login', payload)
    return {
      user: toCamelCase<User>(res.data.user),
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      expiresIn: res.data.expires_in,
    }
  }

  async register(payload: RegisterPayload) {
    const res = await this.http.post<{ data: { user: ApiUser; accessToken: string; refreshToken: string } }>(
      '/auth/register',
      payload,
    )
    return {
      user: toCamelCase<User>(res.data.user),
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.http.post('/auth/logout', { refreshToken })
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const res = await this.http.post<{ data: { access_token: string; refresh_token: string; expires_in: number } }>(
      '/auth/refresh',
      { refreshToken },
    )
    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
      expiresIn: res.data.expires_in,
    }
  }

  async me(): Promise<User> {
    const res = await this.http.get<{ data: ApiUser }>('/auth/me')
    return toCamelCase<User>(res.data)
  }

  async forgotPassword(email: string): Promise<void> {
    await this.http.post('/auth/forgot-password', { email })
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await this.http.post('/auth/reset-password', { token, password })
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await this.http.patch<{ data: ApiUser }>('/auth/profile', data)
    return toCamelCase<User>(res.data)
  }
}
