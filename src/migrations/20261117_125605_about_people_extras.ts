import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_about_chapters_extra" ADD VALUE 'team';
  CREATE TABLE "about_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"line" varchar,
  	"photo_id" integer,
  	"show" boolean DEFAULT true,
  	"order" numeric
  );
  
  CREATE TABLE "about_off_the_clock" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "about_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "about_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"testimonials_id" integer
  );
  
  ALTER TABLE "about_chapters" ADD COLUMN "aside_heading" varchar;
  ALTER TABLE "about_chapters" ADD COLUMN "aside_body" jsonb;
  ALTER TABLE "about" ADD COLUMN "next_on_my_list_text" varchar;
  ALTER TABLE "about" ADD COLUMN "next_on_my_list_link_label" varchar;
  ALTER TABLE "about" ADD COLUMN "next_on_my_list_link_url" varchar;
  ALTER TABLE "about_team" ADD CONSTRAINT "about_team_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_team" ADD CONSTRAINT "about_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_off_the_clock" ADD CONSTRAINT "about_off_the_clock_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_credits" ADD CONSTRAINT "about_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_team_order_idx" ON "about_team" USING btree ("_order");
  CREATE INDEX "about_team_parent_id_idx" ON "about_team" USING btree ("_parent_id");
  CREATE INDEX "about_team_photo_idx" ON "about_team" USING btree ("photo_id");
  CREATE INDEX "about_off_the_clock_order_idx" ON "about_off_the_clock" USING btree ("_order");
  CREATE INDEX "about_off_the_clock_parent_id_idx" ON "about_off_the_clock" USING btree ("_parent_id");
  CREATE INDEX "about_credits_order_idx" ON "about_credits" USING btree ("_order");
  CREATE INDEX "about_credits_parent_id_idx" ON "about_credits" USING btree ("_parent_id");
  CREATE INDEX "about_rels_order_idx" ON "about_rels" USING btree ("order");
  CREATE INDEX "about_rels_parent_idx" ON "about_rels" USING btree ("parent_id");
  CREATE INDEX "about_rels_path_idx" ON "about_rels" USING btree ("path");
  CREATE INDEX "about_rels_testimonials_id_idx" ON "about_rels" USING btree ("testimonials_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_team" CASCADE;
  DROP TABLE "about_off_the_clock" CASCADE;
  DROP TABLE "about_credits" CASCADE;
  DROP TABLE "about_rels" CASCADE;
  ALTER TABLE "about_chapters" ALTER COLUMN "extra" SET DATA TYPE text;
  ALTER TABLE "about_chapters" ALTER COLUMN "extra" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_about_chapters_extra";
  CREATE TYPE "public"."enum_about_chapters_extra" AS ENUM('none', 'values', 'timeline', 'places');
  ALTER TABLE "about_chapters" ALTER COLUMN "extra" SET DEFAULT 'none'::"public"."enum_about_chapters_extra";
  ALTER TABLE "about_chapters" ALTER COLUMN "extra" SET DATA TYPE "public"."enum_about_chapters_extra" USING "extra"::"public"."enum_about_chapters_extra";
  ALTER TABLE "about_chapters" DROP COLUMN "aside_heading";
  ALTER TABLE "about_chapters" DROP COLUMN "aside_body";
  ALTER TABLE "about" DROP COLUMN "next_on_my_list_text";
  ALTER TABLE "about" DROP COLUMN "next_on_my_list_link_label";
  ALTER TABLE "about" DROP COLUMN "next_on_my_list_link_url";`)
}
