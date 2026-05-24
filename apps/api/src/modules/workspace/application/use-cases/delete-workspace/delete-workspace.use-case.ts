import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { WORKSPACE_REPOSITORY, type WorkspaceRepository } from '../../../domain/repositories/workspace.repository'

@Injectable()
export class DeleteWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY) private readonly workspaceRepo: WorkspaceRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const workspace = await this.workspaceRepo.findById(id)
    if (!workspace) throw new NotFoundException('Workspace not found')
    if (workspace.ownerId !== userId) throw new ForbiddenException('Only the owner can delete the workspace')
    await this.workspaceRepo.delete(id)
  }
}
