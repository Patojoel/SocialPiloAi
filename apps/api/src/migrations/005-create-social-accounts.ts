import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSocialAccounts1000000000005 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "social_accounts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "workspace_id" character varying NOT NULL,
        "platform" character varying NOT NULL,
        "account_id" character varying NOT NULL,
        "account_name" character varying NOT NULL,
        "access_token_encrypted" text NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE,
        "status" character varying NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_social_accounts" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_social_accounts_workspace_id" ON "social_accounts" ("workspace_id")
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_social_accounts_platform" ON "social_accounts" ("platform")
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_social_accounts_platform"`)
    await queryRunner.query(`DROP INDEX "IDX_social_accounts_workspace_id"`)
    await queryRunner.query(`DROP TABLE "social_accounts"`)
  }
}
