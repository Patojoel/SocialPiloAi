import type { MediaGateway } from '../../gateway/MediaGateway'
import type { HttpProvider } from '@/shared/infra/http/HttpProvider'
import { FetchHttpProvider } from '@/shared/infra/http/FetchHttpProvider'
import type { Media, MediaType } from '../../models/Media'
import type { Paginated } from '@/shared/models/Paginated'
import { toCamelCase } from '@/shared/utils/caseTransform'
import { getAccessToken } from '@/features/auth/infra/tokenStorage'
import { HttpError } from '@/shared/infra/http/HttpError'

interface ApiMedia {
  id: string
  workspace_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  type: MediaType
  created_at: string
}

interface ApiPaginatedMedia {
  data: ApiMedia[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export class HttpMediaGateway implements MediaGateway {
  constructor(
    private readonly http: HttpProvider,
    private readonly baseUrl: string,
  ) {}

  async upload(file: File): Promise<Media> {
    const formData = new FormData()
    formData.append('file', file)

    const token = getAccessToken()
    const workspaceId =
      this.http instanceof FetchHttpProvider ? this.http.getWorkspaceId() : null

    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    if (workspaceId) headers['X-Workspace-Id'] = workspaceId

    const res = await fetch(`${this.baseUrl}/media/upload`, {
      method: 'POST',
      headers,
      body: formData,
    })
    if (!res.ok) {
      const body: unknown = await res.json().catch(() => null)
      const detail =
        body !== null &&
        typeof body === 'object' &&
        'detail' in body &&
        typeof (body as Record<string, unknown>).detail === 'string'
          ? (body as Record<string, unknown>).detail as string
          : res.statusText
      throw new HttpError(res.status, detail, body)
    }
    const json = (await res.json()) as { data: ApiMedia }
    return toCamelCase<Media>(json.data)
  }

  async list(page: number, limit: number): Promise<Paginated<Media>> {
    const res = await this.http.get<ApiPaginatedMedia>('/media', {
      params: { page, limit },
    })
    return {
      items: res.data.map((item) => toCamelCase<Media>(item)),
      total: res.meta.total,
      page: res.meta.page,
      limit: res.meta.limit,
      totalPages: res.meta.totalPages,
    }
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/media/${id}`)
  }
}
