export interface AuthTokensDto {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface JwtPayloadDto {
  sub: string
  email: string
  workspaceId?: string
}
