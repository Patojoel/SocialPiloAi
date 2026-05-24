import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkspaceOrmEntity } from './infrastructure/persistence/entities/workspace.orm-entity'
import { WorkspaceMemberOrmEntity } from './infrastructure/persistence/entities/workspace-member.orm-entity'
import { TypeOrmWorkspaceRepository } from './infrastructure/persistence/repositories/typeorm-workspace.repository'
import { WORKSPACE_REPOSITORY } from './domain/repositories/workspace.repository'
import { CreateWorkspaceUseCase } from './application/use-cases/create-workspace/create-workspace.use-case'
import { ListWorkspacesUseCase } from './application/use-cases/list-workspaces/list-workspaces.use-case'
import { GetWorkspaceUseCase } from './application/use-cases/get-workspace/get-workspace.use-case'
import { UpdateWorkspaceUseCase } from './application/use-cases/update-workspace/update-workspace.use-case'
import { DeleteWorkspaceUseCase } from './application/use-cases/delete-workspace/delete-workspace.use-case'
import { WorkspaceController } from './presentation/controllers/workspace.controller'

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceOrmEntity, WorkspaceMemberOrmEntity])],
  providers: [
    { provide: WORKSPACE_REPOSITORY, useClass: TypeOrmWorkspaceRepository },
    CreateWorkspaceUseCase,
    ListWorkspacesUseCase,
    GetWorkspaceUseCase,
    UpdateWorkspaceUseCase,
    DeleteWorkspaceUseCase,
  ],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
