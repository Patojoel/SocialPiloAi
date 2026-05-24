import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMedia1000000000006 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "media" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "workspace_id" character varying NOT NULL,
        "url" text NOT NULL,
        "filename" character varying NOT NULL,
        "mime_type" character varying NOT NULL,
        "size" bigint NOT NULL,
        "type" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_media" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_media_workspace_id" ON "media" ("workspace_id")
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_media_workspace_id"`)
    await queryRunner.query(`DROP TABLE "media"`)
  }
}
