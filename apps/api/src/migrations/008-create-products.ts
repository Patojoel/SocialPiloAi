import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProducts1000000000008 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "workspace_id" character varying NOT NULL,
        "name" character varying NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "context" text NOT NULL DEFAULT '',
        "benefits" jsonb NOT NULL DEFAULT '[]',
        "faqs" jsonb NOT NULL DEFAULT '[]',
        "marketing_texts" jsonb NOT NULL DEFAULT '[]',
        "image_urls" jsonb NOT NULL DEFAULT '[]',
        "video_urls" jsonb NOT NULL DEFAULT '[]',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_products_workspace_id" ON "products" ("workspace_id")
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_products_workspace_id"`)
    await queryRunner.query(`DROP TABLE "products"`)
  }
}
