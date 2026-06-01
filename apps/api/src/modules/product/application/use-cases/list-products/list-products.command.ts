export interface ListProductsCommand {
  workspaceId: string
  page: number
  limit: number
  search?: string
}
