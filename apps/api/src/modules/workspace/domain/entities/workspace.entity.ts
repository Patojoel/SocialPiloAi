export interface Workspace {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  ownerId: string
  createdAt: Date
  updatedAt: Date
}
