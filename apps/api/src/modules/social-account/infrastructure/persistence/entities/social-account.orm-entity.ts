import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('social_accounts')
export class SocialAccountOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'workspace_id' })
  workspaceId!: string

  @Column()
  platform!: string

  @Column({ name: 'account_id' })
  accountId!: string

  @Column({ name: 'account_name' })
  accountName!: string

  @Column({ name: 'access_token_encrypted', type: 'text' })
  accessTokenEncrypted!: string

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt!: Date | null

  @Column({ default: 'active' })
  status!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
