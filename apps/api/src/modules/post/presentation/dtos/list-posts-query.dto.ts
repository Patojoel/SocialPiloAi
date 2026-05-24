import { IsOptional, IsInt, Min, Max, IsIn, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class ListPostsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20

  @IsOptional()
  @IsIn(['draft', 'scheduled', 'publishing', 'published', 'failed'])
  status?: string

  @IsOptional()
  @IsIn(['facebook', 'instagram', 'tiktok'])
  platform?: string

  @IsOptional()
  @IsString()
  search?: string
}
