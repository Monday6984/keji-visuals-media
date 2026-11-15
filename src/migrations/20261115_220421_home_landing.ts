import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_landing_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_id" integer NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"background_id" integer NOT NULL,
  	"video_url" varchar,
  	"poster_id" integer
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"landing_kicker" varchar,
  	"landing_intro_enabled" boolean DEFAULT true,
  	"landing_footer_left" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home_landing_items" ADD CONSTRAINT "home_landing_items_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_landing_items" ADD CONSTRAINT "home_landing_items_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_landing_items" ADD CONSTRAINT "home_landing_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_landing_items" ADD CONSTRAINT "home_landing_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_landing_items_order_idx" ON "home_landing_items" USING btree ("_order");
  CREATE INDEX "home_landing_items_parent_id_idx" ON "home_landing_items" USING btree ("_parent_id");
  CREATE INDEX "home_landing_items_category_idx" ON "home_landing_items" USING btree ("category_id");
  CREATE INDEX "home_landing_items_background_idx" ON "home_landing_items" USING btree ("background_id");
  CREATE INDEX "home_landing_items_poster_idx" ON "home_landing_items" USING btree ("poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_landing_items" CASCADE;
  DROP TABLE "home" CASCADE;`)
}
