import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductOrmEntity } from './infrastructure/persistence/entities/product.orm-entity'
import { TypeOrmProductRepository } from './infrastructure/persistence/repositories/typeorm-product.repository'
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository'
import { ListProductsUseCase } from './application/use-cases/list-products/list-products.use-case'
import { GetProductUseCase } from './application/use-cases/get-product/get-product.use-case'
import { CreateProductUseCase } from './application/use-cases/create-product/create-product.use-case'
import { UpdateProductUseCase } from './application/use-cases/update-product/update-product.use-case'
import { DeleteProductUseCase } from './application/use-cases/delete-product/delete-product.use-case'
import { ProductController } from './presentation/controllers/product.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: TypeOrmProductRepository },
    ListProductsUseCase,
    GetProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
