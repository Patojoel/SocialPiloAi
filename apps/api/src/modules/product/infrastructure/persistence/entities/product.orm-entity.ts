import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import type { ProductFaq } from '../../../domain/entities/product.entity'

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'workspace_id' })
  workspaceId!: string

  @Column()
  name!: string

  @Column({ type: 'text' })
  description!: string

  @Column({ type: 'text' })
  context!: string

  @Column({ type: 'jsonb', default: '[]' })
  benefits!: string[]

  @Column({ type: 'jsonb', default: '[]' })
  faqs!: ProductFaq[]

  @Column({ name: 'marketing_texts', type: 'jsonb', default: '[]' })
  marketingTexts!: string[]

  @Column({ name: 'image_urls', type: 'jsonb', default: '[]' })
  imageUrls!: string[]

  @Column({ name: 'video_urls', type: 'jsonb', default: '[]' })
  videoUrls!: string[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
