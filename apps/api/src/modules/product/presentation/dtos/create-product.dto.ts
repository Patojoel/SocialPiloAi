import { IsString, IsArray, IsOptional, ValidateNested, MinLength } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ProductFaqDto {
  @IsString()
  question!: string

  @IsString()
  answer!: string
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name!: string

  @ApiProperty()
  @IsString()
  description!: string

  @ApiProperty()
  @IsString()
  context!: string

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  benefits!: string[]

  @ApiProperty({ type: [ProductFaqDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductFaqDto)
  faqs!: ProductFaqDto[]

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  marketingTexts!: string[]

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[]

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videoUrls?: string[]
}
