import { Injectable, Inject, ConflictException } from '@nestjs/common'
import { WORKSPACE_REPOSITORY, type WorkspaceRepository } from '../../../domain/repositories/workspace.repository'
import type { CreateWorkspaceCommand } from './create-workspace.command'
import type { Workspace } from '../../../domain/entities/workspace.entity'

@Injectable()
export class CreateWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY) private readonly workspaceRepo: WorkspaceRepository,
  ) {}

  async execute(command: CreateWorkspaceCommand): Promise<Workspace> {
    const slug = command.slug ?? this.generateSlug(command.name)
    const existing = await this.workspaceRepo.findBySlug(slug)
    if (existing) throw new ConflictException('Workspace slug already taken')

    const workspace = await this.workspaceRepo.save({
      name: command.name,
      slug,
      logoUrl: null,
      ownerId: command.ownerId,
    })

    await this.workspaceRepo.addMember({
      workspaceId: workspace.id,
      userId: command.ownerId,
      role: 'owner',
    })

    return workspace
  }

  private generateSlug(name: string): string {
    return (
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 50) +
      '-' +
      Math.random().toString(36).slice(2, 7)
    )
  }
}
