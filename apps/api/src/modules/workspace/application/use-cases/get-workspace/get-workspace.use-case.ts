import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { WORKSPACE_REPOSITORY, type WorkspaceRepository } from '../../../domain/repositories/workspace.repository'
import type { Workspace } from '../../../domain/entities/workspace.entity'

@Injectable()
export class GetWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY) private readonly workspaceRepo: WorkspaceRepository,
  ) {}

  async execute(id: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepo.findById(id)
    if (!workspace) throw new NotFoundException('Workspace not found')

    const member = await this.workspaceRepo.findMember(id, userId)
    if (!member) throw new ForbiddenException('Access denied')

    return workspace
  }
}
