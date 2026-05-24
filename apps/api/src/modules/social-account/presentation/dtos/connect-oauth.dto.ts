import { IsString, IsNotEmpty } from 'class-validator'

export class ConnectOAuthDto {
  @IsString()
  @IsNotEmpty()
  code!: string

  @IsString()
  @IsNotEmpty()
  workspace_id!: string
}
