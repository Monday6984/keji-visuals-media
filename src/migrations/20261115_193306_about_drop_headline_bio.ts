import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about" DROP COLUMN "headline";
  ALTER TABLE "about" DROP COLUMN "bio";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about" ADD COLUMN "headline" varchar;
  ALTER TABLE "about" ADD COLUMN "bio" jsonb;`)
}
