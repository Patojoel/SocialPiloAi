import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { ListProductsUseCase } from '../../application/use-cases/list-products/list-products.use-case'
import { GetProductUseCase } from '../../application/use-cases/get-product/get-product.use-case'
import { CreateProductUseCase } from '../../application/use-cases/create-product/create-product.use-case'
import { UpdateProductUseCase } from '../../application/use-cases/update-product/update-product.use-case'
import { DeleteProductUseCase } from '../../application/use-cases/delete-product/delete-product.use-case'
import { CreateProductDto } from '../dtos/create-product.dto'
import { UpdateProductDto } from '../dtos/update-product.dto'
import { ListProductsQueryDto } from '../dtos/list-products-query.dto'
import { serializeProduct } from '../serializers/product.serializer'

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  private getWorkspaceId(workspaceId: string | undefined): string {
    if (!workspaceId) throw new BadRequestException('X-Workspace-Id header is required')
    return workspaceId
  }

  @Get()
  async list(
    @Query() query: ListProductsQueryDto,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const result = await this.listProductsUseCase.execute(wsId, page, limit, query.search)
    return {
      data: result.items.map(serializeProduct),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    }
  }

  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const product = await this.getProductUseCase.execute(id, wsId)
    return { data: serializeProduct(product) }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateProductDto,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const product = await this.createProductUseCase.execute({
      workspaceId: wsId,
      name: dto.name,
      description: dto.description,
      context: dto.context,
      benefits: dto.benefits,
      faqs: dto.faqs,
      marketingTexts: dto.marketingTexts,
      imageUrls: dto.imageUrls ?? [],
      videoUrls: dto.videoUrls ?? [],
    })
    return { data: serializeProduct(product) }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    const product = await this.updateProductUseCase.execute({
      id,
      workspaceId: wsId,
      name: dto.name,
      description: dto.description,
      context: dto.context,
      benefits: dto.benefits,
      faqs: dto.faqs,
      marketingTexts: dto.marketingTexts,
      imageUrls: dto.imageUrls,
      videoUrls: dto.videoUrls,
    })
    return { data: serializeProduct(product) }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Headers('x-workspace-id') workspaceId: string,
  ) {
    const wsId = this.getWorkspaceId(workspaceId)
    await this.deleteProductUseCase.execute(id, wsId)
  }
}
