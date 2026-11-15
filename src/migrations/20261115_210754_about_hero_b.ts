import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_hero_primary_button_link" AS ENUM('portfolio', 'book', 'packages', 'whatsapp');
  CREATE TYPE "public"."enum_about_hero_secondary_button_link" AS ENUM('portfolio', 'book', 'packages', 'whatsapp');
  CREATE TABLE "about_hero_headline_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"accent" boolean DEFAULT false
  );
  
  ALTER TABLE "about" ADD COLUMN "hero_status_pill_text" varchar;
  ALTER TABLE "about" ADD COLUMN "hero_status_pill_show" boolean DEFAULT true;
  ALTER TABLE "about" ADD COLUMN "hero_primary_button_label" varchar;
  ALTER TABLE "about" ADD COLUMN "hero_primary_button_link" "enum_about_hero_primary_button_link" DEFAULT 'portfolio';
  ALTER TABLE "about" ADD COLUMN "hero_secondary_button_label" varchar;
  ALTER TABLE "about" ADD COLUMN "hero_secondary_button_link" "enum_about_hero_secondary_button_link" DEFAULT 'portfolio';
  ALTER TABLE "about" ADD COLUMN "hero_portrait_id" integer;
  ALTER TABLE "about" ADD COLUMN "hero_portrait_mono" boolean DEFAULT true;
  ALTER TABLE "about" ADD COLUMN "hero_face_frame_left" numeric DEFAULT 29;
  ALTER TABLE "about" ADD COLUMN "hero_face_frame_top" numeric DEFAULT 8;
  ALTER TABLE "about" ADD COLUMN "hero_face_frame_width" numeric DEFAULT 33;
  ALTER TABLE "about" ADD COLUMN "hero_face_frame_height" numeric DEFAULT 39.5;
  ALTER TABLE "about_hero_headline_lines" ADD CONSTRAINT "about_hero_headline_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_hero_headline_lines_order_idx" ON "about_hero_headline_lines" USING btree ("_order");
  CREATE INDEX "about_hero_headline_lines_parent_id_idx" ON "about_hero_headline_lines" USING btree ("_parent_id");
  ALTER TABLE "about" ADD CONSTRAINT "about_hero_portrait_id_media_id_fk" FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_hero_hero_portrait_idx" ON "about" USING btree ("hero_portrait_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_hero_headline_lines" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_hero_headline_lines" CASCADE;
  ALTER TABLE "about" DROP CONSTRAINT "about_hero_portrait_id_media_id_fk";
  
  DROP INDEX "about_hero_hero_portrait_idx";
  ALTER TABLE "about" DROP COLUMN "hero_status_pill_text";
  ALTER TABLE "about" DROP COLUMN "hero_status_pill_show";
  ALTER TABLE "about" DROP COLUMN "hero_primary_button_label";
  ALTER TABLE "about" DROP COLUMN "hero_primary_button_link";
  ALTER TABLE "about" DROP COLUMN "hero_secondary_button_label";
  ALTER TABLE "about" DROP COLUMN "hero_secondary_button_link";
  ALTER TABLE "about" DROP COLUMN "hero_portrait_id";
  ALTER TABLE "about" DROP COLUMN "hero_portrait_mono";
  ALTER TABLE "about" DROP COLUMN "hero_face_frame_left";
  ALTER TABLE "about" DROP COLUMN "hero_face_frame_top";
  ALTER TABLE "about" DROP COLUMN "hero_face_frame_width";
  ALTER TABLE "about" DROP COLUMN "hero_face_frame_height";
  DROP TYPE "public"."enum_about_hero_primary_button_link";
  DROP TYPE "public"."enum_about_hero_secondary_button_link";`)
}
