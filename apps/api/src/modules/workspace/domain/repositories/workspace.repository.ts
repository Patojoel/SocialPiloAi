import type { Workspace } from '../entities/workspace.entity'
import type { WorkspaceMember } from '../entities/workspace-member.entity'

export interface WorkspaceRepository {
  findById(id: string): Promise<Workspace | null>
  findBySlug(slug: string): Promise<Workspace | null>
  findByUserId(userId: string): Promise<Workspace[]>
  save(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace>
  update(id: string, data: Partial<Workspace>): Promise<Workspace>
  delete(id: string): Promise<void>
  addMember(member: Omit<WorkspaceMember, 'id' | 'joinedAt'>): Promise<WorkspaceMember>
  findMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null>
}

export const WORKSPACE_REPOSITORY = Symbol('WorkspaceRepository')
