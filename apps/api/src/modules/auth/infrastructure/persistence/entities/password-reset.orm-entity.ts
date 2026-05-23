import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

@Entity('password_resets')
export class PasswordResetOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  @Index()
  email!: string

  @Column({ unique: true, type: 'text' })
  token!: string

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date

  @Column({ name: 'is_used', default: false })
  isUsed!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
