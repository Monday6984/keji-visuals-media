import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_hero_lines" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_hero_lines" CASCADE;
  ALTER TABLE "about" DROP CONSTRAINT "about_hero_image_id_media_id_fk";
  
  DROP INDEX "about_hero_hero_image_idx";
  ALTER TABLE "about" DROP COLUMN "hero_signature";
  ALTER TABLE "about" DROP COLUMN "hero_image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"olive" varchar
  );
  
  ALTER TABLE "about" ADD COLUMN "hero_signature" varchar;
  ALTER TABLE "about" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "about_hero_lines" ADD CONSTRAINT "about_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_hero_lines_order_idx" ON "about_hero_lines" USING btree ("_order");
  CREATE INDEX "about_hero_lines_parent_id_idx" ON "about_hero_lines" USING btree ("_parent_id");
  ALTER TABLE "about" ADD CONSTRAINT "about_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_hero_hero_image_idx" ON "about" USING btree ("hero_image_id");`)
}
