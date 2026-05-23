import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { CurrentUser, type JwtPayload } from '@/shared/decorators/current-user.decorator'
import { CreateWorkspaceUseCase } from '../../application/use-cases/create-workspace/create-workspace.use-case'
import { ListWorkspacesUseCase } from '../../application/use-cases/list-workspaces/list-workspaces.use-case'
import { GetWorkspaceUseCase } from '../../application/use-cases/get-workspace/get-workspace.use-case'
import { UpdateWorkspaceUseCase } from '../../application/use-cases/update-workspace/update-workspace.use-case'
import { DeleteWorkspaceUseCase } from '../../application/use-cases/delete-workspace/delete-workspace.use-case'
import { CreateWorkspaceDto } from '../dtos/create-workspace.dto'
import { UpdateWorkspaceDto } from '../dtos/update-workspace.dto'

@ApiTags('workspaces')
@ApiBearerAuth()
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(
    private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
    private readonly listWorkspacesUseCase: ListWorkspacesUseCase,
    private readonly getWorkspaceUseCase: GetWorkspaceUseCase,
    private readonly updateWorkspaceUseCase: UpdateWorkspaceUseCase,
    private readonly deleteWorkspaceUseCase: DeleteWorkspaceUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    const workspaces = await this.listWorkspacesUseCase.execute(user.sub)
    return { data: workspaces }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateWorkspaceDto, @CurrentUser() user: JwtPayload) {
    const workspace = await this.createWorkspaceUseCase.execute({ ...dto, ownerId: user.sub })
    return { data: workspace }
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const workspace = await this.getWorkspaceUseCase.execute(id, user.sub)
    return { data: workspace }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const workspace = await this.updateWorkspaceUseCase.execute({ id, userId: user.sub, ...dto })
    return { data: workspace }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    await this.deleteWorkspaceUseCase.execute(id, user.sub)
  }
}
