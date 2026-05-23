export interface PaginationMetaDto {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponseDto<T> {
  data: T[]
  meta: PaginationMetaDto
}
