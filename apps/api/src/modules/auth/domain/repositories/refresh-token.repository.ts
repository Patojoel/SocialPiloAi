import type { RefreshToken } from '../entities/refresh-token.entity'

export interface RefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>
  findByUserId(userId: string): Promise<RefreshToken[]>
  save(token: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken>
  revokeByToken(token: string): Promise<void>
  revokeAllByUserId(userId: string): Promise<void>
  deleteExpired(): Promise<void>
}

export const REFRESH_TOKEN_REPOSITORY = Symbol('RefreshTokenRepository')
