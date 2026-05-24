import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreatePosts1000000000007 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "workspace_id" character varying NOT NULL,
        "content" text NOT NULL,
        "platforms" text NOT NULL,
        "status" character varying NOT NULL DEFAULT 'draft',
        "media_ids" text,
        "scheduled_at" TIMESTAMP WITH TIME ZONE,
        "published_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_posts" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_posts_workspace_id" ON "posts" ("workspace_id")
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_posts_status" ON "posts" ("status")
    `)
    await queryRunner.query(`
      CREATE TABLE "post_results" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "post_id" character varying NOT NULL,
        "platform" character varying NOT NULL,
        "external_id" character varying,
        "status" character varying NOT NULL DEFAULT 'pending',
        "error_message" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_post_results" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_post_results_post_id" ON "post_results" ("post_id")
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_post_results_post_id"`)
    await queryRunner.query(`DROP TABLE "post_results"`)
    await queryRunner.query(`DROP INDEX "IDX_posts_status"`)
    await queryRunner.query(`DROP INDEX "IDX_posts_workspace_id"`)
    await queryRunner.query(`DROP TABLE "posts"`)
  }
}
