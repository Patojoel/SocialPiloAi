import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

@Entity('post_results')
export class PostResultOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'post_id' })
  postId!: string

  @Column()
  platform!: string

  @Column({ name: 'external_id', type: 'varchar', nullable: true })
  externalId!: string | null

  @Column({ default: 'pending' })
  status!: string

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
