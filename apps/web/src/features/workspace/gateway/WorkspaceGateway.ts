import type { Workspace } from '../models/Workspace'

export interface CreateWorkspacePayload {
  name: string
  slug?: string
}

export interface UpdateWorkspacePayload {
  name?: string
  logoUrl?: string | null
}

export interface WorkspaceGateway {
  list(): Promise<Workspace[]>
  getById(id: string): Promise<Workspace>
  create(payload: CreateWorkspacePayload): Promise<Workspace>
  update(id: string, payload: UpdateWorkspacePayload): Promise<Workspace>
  delete(id: string): Promise<void>
}
