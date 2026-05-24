import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import type { WorkspaceRole } from '../../../domain/entities/workspace-member.entity'

@Entity('workspace_members')
export class WorkspaceMemberOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'workspace_id' })
  workspaceId!: string

  @Column({ name: 'user_id' })
  userId!: string

  @Column({ default: 'member' })
  role!: WorkspaceRole

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt!: Date
}
