import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_chapters_pull_quote_size" AS ENUM('normal', 'large');
  CREATE TYPE "public"."enum_about_chapters_layout" AS ENUM('text', 'image-right', 'image-left', 'diptych');
  CREATE TYPE "public"."enum_about_chapters_extra" AS ENUM('none', 'values', 'timeline', 'places');
  CREATE TYPE "public"."enum_about_closing_buttons_link" AS ENUM('book', 'portfolio', 'packages', 'whatsapp');
  CREATE TYPE "public"."enum_about_closing_buttons_style" AS ENUM('solid', 'line');
  CREATE TABLE "about_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"olive" varchar
  );
  
  CREATE TABLE "about_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"frame_number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"pull_quote_text" varchar,
  	"pull_quote_olive" varchar,
  	"pull_quote_size" "enum_about_chapters_pull_quote_size" DEFAULT 'normal',
  	"body" jsonb,
  	"layout" "enum_about_chapters_layout" DEFAULT 'text' NOT NULL,
  	"extra" "enum_about_chapters_extra" DEFAULT 'none',
  	"image_id" integer,
  	"caption" varchar,
  	"image2_id" integer,
  	"caption2" varchar
  );
  
  CREATE TABLE "about_reels_frames" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "about_reels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"after_frame" varchar NOT NULL
  );
  
  CREATE TABLE "about_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"when" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"highlight" boolean,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "about_places" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "about_closing_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link" "enum_about_closing_buttons_link" DEFAULT 'book' NOT NULL,
  	"style" "enum_about_closing_buttons_style" DEFAULT 'line'
  );
  
  ALTER TABLE "about" ADD COLUMN "hero_kicker" varchar;
  ALTER TABLE "about" ADD COLUMN "hero_intro" varchar;
  ALTER TABLE "about" ADD COLUMN "hero_signature" varchar;
  ALTER TABLE "about" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "about" ADD COLUMN "hero_caption" varchar;
  ALTER TABLE "about" ADD COLUMN "hero_index_thumbnail_id" integer;
  ALTER TABLE "about" ADD COLUMN "hero_share_image_id" integer;
  ALTER TABLE "about" ADD COLUMN "closing_kicker" varchar;
  ALTER TABLE "about" ADD COLUMN "closing_heading" varchar;
  ALTER TABLE "about" ADD COLUMN "closing_olive" varchar;
  ALTER TABLE "about" ADD COLUMN "closing_image_id" integer;
  ALTER TABLE "about_hero_lines" ADD CONSTRAINT "about_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_chapters" ADD CONSTRAINT "about_chapters_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_chapters" ADD CONSTRAINT "about_chapters_image2_id_media_id_fk" FOREIGN KEY ("image2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_chapters" ADD CONSTRAINT "about_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_reels_frames" ADD CONSTRAINT "about_reels_frames_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_reels_frames" ADD CONSTRAINT "about_reels_frames_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_reels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_reels" ADD CONSTRAINT "about_reels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_timeline" ADD CONSTRAINT "about_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_places" ADD CONSTRAINT "about_places_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_closing_buttons" ADD CONSTRAINT "about_closing_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_hero_lines_order_idx" ON "about_hero_lines" USING btree ("_order");
  CREATE INDEX "about_hero_lines_parent_id_idx" ON "about_hero_lines" USING btree ("_parent_id");
  CREATE INDEX "about_chapters_order_idx" ON "about_chapters" USING btree ("_order");
  CREATE INDEX "about_chapters_parent_id_idx" ON "about_chapters" USING btree ("_parent_id");
  CREATE INDEX "about_chapters_image_idx" ON "about_chapters" USING btree ("image_id");
  CREATE INDEX "about_chapters_image2_idx" ON "about_chapters" USING btree ("image2_id");
  CREATE INDEX "about_reels_frames_order_idx" ON "about_reels_frames" USING btree ("_order");
  CREATE INDEX "about_reels_frames_parent_id_idx" ON "about_reels_frames" USING btree ("_parent_id");
  CREATE INDEX "about_reels_frames_image_idx" ON "about_reels_frames" USING btree ("image_id");
  CREATE INDEX "about_reels_order_idx" ON "about_reels" USING btree ("_order");
  CREATE INDEX "about_reels_parent_id_idx" ON "about_reels" USING btree ("_parent_id");
  CREATE INDEX "about_timeline_order_idx" ON "about_timeline" USING btree ("_order");
  CREATE INDEX "about_timeline_parent_id_idx" ON "about_timeline" USING btree ("_parent_id");
  CREATE INDEX "about_places_order_idx" ON "about_places" USING btree ("_order");
  CREATE INDEX "about_places_parent_id_idx" ON "about_places" USING btree ("_parent_id");
  CREATE INDEX "about_closing_buttons_order_idx" ON "about_closing_buttons" USING btree ("_order");
  CREATE INDEX "about_closing_buttons_parent_id_idx" ON "about_closing_buttons" USING btree ("_parent_id");
  ALTER TABLE "about" ADD CONSTRAINT "about_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_hero_index_thumbnail_id_media_id_fk" FOREIGN KEY ("hero_index_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_hero_share_image_id_media_id_fk" FOREIGN KEY ("hero_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_closing_image_id_media_id_fk" FOREIGN KEY ("closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_hero_hero_image_idx" ON "about" USING btree ("hero_image_id");
  CREATE INDEX "about_hero_hero_index_thumbnail_idx" ON "about" USING btree ("hero_index_thumbnail_id");
  CREATE INDEX "about_hero_hero_share_image_idx" ON "about" USING btree ("hero_share_image_id");
  CREATE INDEX "about_closing_closing_image_idx" ON "about" USING btree ("closing_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_hero_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_chapters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_reels_frames" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_reels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_places" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_closing_buttons" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_hero_lines" CASCADE;
  DROP TABLE "about_chapters" CASCADE;
  DROP TABLE "about_reels_frames" CASCADE;
  DROP TABLE "about_reels" CASCADE;
  DROP TABLE "about_timeline" CASCADE;
  DROP TABLE "about_places" CASCADE;
  DROP TABLE "about_closing_buttons" CASCADE;
  ALTER TABLE "about" DROP CONSTRAINT "about_hero_image_id_media_id_fk";
  
  ALTER TABLE "about" DROP CONSTRAINT "about_hero_index_thumbnail_id_media_id_fk";
  
  ALTER TABLE "about" DROP CONSTRAINT "about_hero_share_image_id_media_id_fk";
  
  ALTER TABLE "about" DROP CONSTRAINT "about_closing_image_id_media_id_fk";
  
  DROP INDEX "about_hero_hero_image_idx";
  DROP INDEX "about_hero_hero_index_thumbnail_idx";
  DROP INDEX "about_hero_hero_share_image_idx";
  DROP INDEX "about_closing_closing_image_idx";
  ALTER TABLE "about" DROP COLUMN "hero_kicker";
  ALTER TABLE "about" DROP COLUMN "hero_intro";
  ALTER TABLE "about" DROP COLUMN "hero_signature";
  ALTER TABLE "about" DROP COLUMN "hero_image_id";
  ALTER TABLE "about" DROP COLUMN "hero_caption";
  ALTER TABLE "about" DROP COLUMN "hero_index_thumbnail_id";
  ALTER TABLE "about" DROP COLUMN "hero_share_image_id";
  ALTER TABLE "about" DROP COLUMN "closing_kicker";
  ALTER TABLE "about" DROP COLUMN "closing_heading";
  ALTER TABLE "about" DROP COLUMN "closing_olive";
  ALTER TABLE "about" DROP COLUMN "closing_image_id";
  DROP TYPE "public"."enum_about_chapters_pull_quote_size";
  DROP TYPE "public"."enum_about_chapters_layout";
  DROP TYPE "public"."enum_about_chapters_extra";
  DROP TYPE "public"."enum_about_closing_buttons_link";
  DROP TYPE "public"."enum_about_closing_buttons_style";`)
}
