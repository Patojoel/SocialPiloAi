import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsIn,
  IsOptional,
  IsISO8601,
} from 'class-validator'
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content!: string

  @IsArray()
  @IsIn(['facebook', 'instagram', 'tiktok'], { each: true })
  platforms!: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaIds?: string[]

  @IsOptional()
  @IsISO8601()
  scheduledAt?: string
}
