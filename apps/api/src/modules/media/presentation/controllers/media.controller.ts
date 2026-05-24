import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { UploadMediaUseCase } from '../../application/use-cases/upload-media/upload-media.use-case'
import { ListMediaUseCase } from '../../application/use-cases/list-media/list-media.use-case'
import { DeleteMediaUseCase } from '../../application/use-cases/delete-media/delete-media.use-case'
import { ListMediaQueryDto } from '../dtos/list-media-query.dto'

@ApiTags('media')
@ApiBearerAuth()
@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(
    private readonly uploadMediaUseCase: UploadMediaUseCase,
    private readonly listMediaUseCase: ListMediaUseCase,
    private readonly deleteMediaUseCase: DeleteMediaUseCase,
  ) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    if (!workspaceId) throw new BadRequestException('X-Workspace-Id header is required')
    if (!file) throw new BadRequestException('file is required')
    const media = await this.uploadMediaUseCase.execute(file, workspaceId)
    return { data: media }
  }

  @Get()
  async list(
    @Query() query: ListMediaQueryDto,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    if (!workspaceId) throw new BadRequestException('X-Workspace-Id header is required')
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const result = await this.listMediaUseCase.execute(workspaceId, page, limit)
    return {
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    if (!workspaceId) throw new BadRequestException('X-Workspace-Id header is required')
    await this.deleteMediaUseCase.execute(id, workspaceId)
  }
}
