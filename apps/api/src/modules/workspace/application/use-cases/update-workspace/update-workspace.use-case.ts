import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { WORKSPACE_REPOSITORY, type WorkspaceRepository } from '../../../domain/repositories/workspace.repository'
import type { Workspace } from '../../../domain/entities/workspace.entity'
import type { UpdateWorkspaceCommand } from './update-workspace.command'

@Injectable()
export class UpdateWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY) private readonly workspaceRepo: WorkspaceRepository,
  ) {}

  async execute(command: UpdateWorkspaceCommand): Promise<Workspace> {
    const workspace = await this.workspaceRepo.findById(command.id)
    if (!workspace) throw new NotFoundException('Workspace not found')
    if (workspace.ownerId !== command.userId) throw new ForbiddenException('Only the owner can update the workspace')

    const { id, userId: _userId, ...updates } = command
    return this.workspaceRepo.update(id, updates)
  }
}
