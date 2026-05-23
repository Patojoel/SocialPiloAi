import { Injectable, Inject } from '@nestjs/common'
import { WORKSPACE_REPOSITORY, type WorkspaceRepository } from '../../../domain/repositories/workspace.repository'
import type { Workspace } from '../../../domain/entities/workspace.entity'

@Injectable()
export class ListWorkspacesUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY) private readonly workspaceRepo: WorkspaceRepository,
  ) {}

  async execute(userId: string): Promise<Workspace[]> {
    return this.workspaceRepo.findByUserId(userId)
  }
}
