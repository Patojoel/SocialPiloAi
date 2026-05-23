import 'dotenv/config'
import { DataSource } from 'typeorm'
import * as path from 'path'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DATABASE_HOST'] ?? 'localhost',
  port: parseInt(process.env['DATABASE_PORT'] ?? '5432', 10),
  username: process.env['DATABASE_USER'] ?? 'socialpilot',
  password: process.env['DATABASE_PASSWORD'] ?? 'socialpilot',
  database: process.env['DATABASE_NAME'] ?? 'socialpilot_db',
  entities: [path.join(__dirname, '../modules/**/*.orm-entity.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  synchronize: false,
})
