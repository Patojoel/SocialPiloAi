import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

@Entity('refresh_tokens')
export class RefreshTokenOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'user_id' })
  @Index()
  userId!: string

  @Column({ unique: true, type: 'text' })
  token!: string

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date

  @Column({ name: 'is_revoked', default: false })
  isRevoked!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
