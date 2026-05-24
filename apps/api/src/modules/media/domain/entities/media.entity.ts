export type MediaType = 'image' | 'video'

export interface Media {
  id: string
  workspaceId: string
  url: string
  filename: string
  mimeType: string
  size: number
  type: MediaType
  createdAt: Date
}
