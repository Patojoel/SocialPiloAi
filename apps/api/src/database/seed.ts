import 'dotenv/config'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as path from 'path'

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env['DATABASE_HOST'] ?? 'localhost',
  port: parseInt(process.env['DATABASE_PORT'] ?? '5432', 10),
  username: process.env['DATABASE_USER'] ?? 'socialpilot',
  password: process.env['DATABASE_PASSWORD'] ?? 'socialpilot',
  database: process.env['DATABASE_NAME'] ?? 'socialpilot_db',
  entities: [path.join(__dirname, '../modules/**/*.orm-entity.{ts,js}')],
  synchronize: false,
})

async function seed() {
  await dataSource.initialize()
  console.log('Connected to database')

  const queryRunner = dataSource.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    // ─── Users ────────────────────────────────────────────────────────────
    const adminPasswordHash = await bcrypt.hash('Admin1234!', 10)
    const userPasswordHash = await bcrypt.hash('User1234!', 10)
    const demoPasswordHash = await bcrypt.hash('Demo1234!', 10)

    // Upsert by email so re-runs are idempotent
    await queryRunner.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, avatar_url, is_active)
       VALUES
         ('00000000-0000-0000-0000-000000000001', 'admin@socialpilot.ai', $1, 'Admin', 'SocialPilot', NULL, true),
         ('00000000-0000-0000-0000-000000000002', 'alice@example.com',    $2, 'Alice',  'Martin',     NULL, true),
         ('00000000-0000-0000-0000-000000000003', 'demo@socialpilot.ai',  $3, 'Demo',   'User',       NULL, true)
       ON CONFLICT (email) DO NOTHING`,
      [adminPasswordHash, userPasswordHash, demoPasswordHash],
    )

    // ─── Workspaces ───────────────────────────────────────────────────────
    await queryRunner.query(
      `INSERT INTO workspaces (id, name, slug, logo_url, owner_id)
       VALUES
         ('10000000-0000-0000-0000-000000000001', 'SocialPilot HQ',  'socialpilot-hq',  NULL, '00000000-0000-0000-0000-000000000001'),
         ('10000000-0000-0000-0000-000000000002', 'Alice''s Brand',  'alices-brand',    NULL, '00000000-0000-0000-0000-000000000002'),
         ('10000000-0000-0000-0000-000000000003', 'Demo Workspace',  'demo-workspace',  NULL, '00000000-0000-0000-0000-000000000003')
       ON CONFLICT (slug) DO NOTHING`,
    )

    // ─── Workspace members ────────────────────────────────────────────────
    await queryRunner.query(
      `INSERT INTO workspace_members (id, workspace_id, user_id, role)
       VALUES
         -- Admin owns SocialPilot HQ
         ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'owner'),
         -- Admin is also admin in Alice's workspace
         ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'admin'),
         -- Alice owns her brand workspace
         ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'owner'),
         -- Alice is member in SocialPilot HQ
         ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'member'),
         -- Demo user owns demo workspace
         ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'owner')
       ON CONFLICT (id) DO NOTHING`,
    )

    await queryRunner.commitTransaction()
    console.log('\nSeed completed successfully!')
    console.log('\nAccounts created:')
    console.log('  admin@socialpilot.ai  /  Admin1234!  (owner: SocialPilot HQ, admin: Alice\'s Brand)')
    console.log('  alice@example.com     /  User1234!   (owner: Alice\'s Brand, member: SocialPilot HQ)')
    console.log('  demo@socialpilot.ai   /  Demo1234!   (owner: Demo Workspace)')
  } catch (err) {
    await queryRunner.rollbackTransaction()
    console.error('Seed failed — transaction rolled back:', err)
    process.exit(1)
  } finally {
    await queryRunner.release()
    await dataSource.destroy()
  }
}

seed()
