// Tokens stored in memory only (never localStorage)
let accessToken: string | null = null
let refreshToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function getRefreshToken(): string | null {
  return refreshToken
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }): void {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken
}

export function clearSession(): void {
  accessToken = null
  refreshToken = null
}
