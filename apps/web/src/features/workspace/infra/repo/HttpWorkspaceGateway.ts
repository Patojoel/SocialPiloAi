import type { WorkspaceGateway, CreateWorkspacePayload, UpdateWorkspacePayload } from '../../gateway/WorkspaceGateway'
import type { HttpProvider } from '@/shared/infra/http/HttpProvider'
import type { Workspace } from '../../models/Workspace'
import { toCamelCase } from '@/shared/utils/caseTransform'

interface ApiWorkspace {
  id: string
  name: string
  slug: string
  logo_url: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export class HttpWorkspaceGateway implements WorkspaceGateway {
  constructor(private readonly http: HttpProvider) {}

  async list(): Promise<Workspace[]> {
    const res = await this.http.get<{ data: ApiWorkspace[] }>('/workspaces')
    return res.data.map((w) => toCamelCase<Workspace>(w))
  }

  async getById(id: string): Promise<Workspace> {
    const res = await this.http.get<{ data: ApiWorkspace }>(`/workspaces/${id}`)
    return toCamelCase<Workspace>(res.data)
  }

  async create(payload: CreateWorkspacePayload): Promise<Workspace> {
    const res = await this.http.post<{ data: ApiWorkspace }>('/workspaces', payload)
    return toCamelCase<Workspace>(res.data)
  }

  async update(id: string, payload: UpdateWorkspacePayload): Promise<Workspace> {
    const res = await this.http.patch<{ data: ApiWorkspace }>(`/workspaces/${id}`, payload)
    return toCamelCase<Workspace>(res.data)
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/workspaces/${id}`)
  }
}
