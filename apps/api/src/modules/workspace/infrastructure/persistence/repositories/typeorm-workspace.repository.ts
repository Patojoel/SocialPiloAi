import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import type { Workspace } from '../../../domain/entities/workspace.entity'
import type { WorkspaceMember } from '../../../domain/entities/workspace-member.entity'
import type { WorkspaceRepository } from '../../../domain/repositories/workspace.repository'
import { WorkspaceOrmEntity } from '../entities/workspace.orm-entity'
import { WorkspaceMemberOrmEntity } from '../entities/workspace-member.orm-entity'

@Injectable()
export class TypeOrmWorkspaceRepository implements WorkspaceRepository {
  constructor(
    @InjectRepository(WorkspaceOrmEntity)
    private readonly workspaceRepo: Repository<WorkspaceOrmEntity>,
    @InjectRepository(WorkspaceMemberOrmEntity)
    private readonly memberRepo: Repository<WorkspaceMemberOrmEntity>,
  ) {}

  async findById(id: string): Promise<Workspace | null> {
    return this.workspaceRepo.findOne({ where: { id } })
  }

  async findBySlug(slug: string): Promise<Workspace | null> {
    return this.workspaceRepo.findOne({ where: { slug } })
  }

  async findByUserId(userId: string): Promise<Workspace[]> {
    const members = await this.memberRepo.find({ where: { userId } })
    const ids = members.map((m) => m.workspaceId)
    if (ids.length === 0) return []
    return this.workspaceRepo.find({ where: { id: In(ids) } })
  }

  async save(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace> {
    const entity = this.workspaceRepo.create(workspace)
    return this.workspaceRepo.save(entity)
  }

  async update(id: string, data: Partial<Workspace>): Promise<Workspace> {
    await this.workspaceRepo.update(id, data)
    const updated = await this.workspaceRepo.findOne({ where: { id } })
    if (!updated) throw new Error(`Workspace ${id} not found after update`)
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.workspaceRepo.delete(id)
  }

  async addMember(member: Omit<WorkspaceMember, 'id' | 'joinedAt'>): Promise<WorkspaceMember> {
    const entity = this.memberRepo.create(member)
    return this.memberRepo.save(entity)
  }

  async findMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
    return this.memberRepo.findOne({ where: { workspaceId, userId } })
  }
}
