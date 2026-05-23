import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator'

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @IsOptional()
  @IsUrl()
  logoUrl?: string | null
}
