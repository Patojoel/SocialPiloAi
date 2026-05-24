import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('media')
export class MediaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'workspace_id' })
  workspaceId!: string

  @Column({ type: 'text' })
  url!: string

  @Column()
  filename!: string

  @Column({ name: 'mime_type' })
  mimeType!: string

  @Column({ type: 'bigint' })
  size!: number

  @Column()
  type!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
