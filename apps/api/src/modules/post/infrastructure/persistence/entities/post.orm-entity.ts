import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('posts')
export class PostOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'workspace_id' })
  workspaceId!: string

  @Column({ type: 'text' })
  content!: string

  @Column({ type: 'simple-array' })
  platforms!: string[]

  @Column({ default: 'draft' })
  status!: string

  @Column({ name: 'media_ids', type: 'simple-array', nullable: true })
  mediaIds!: string[]

  @Column({ name: 'scheduled_at', type: 'timestamptz', nullable: true })
  scheduledAt!: Date | null

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt!: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
