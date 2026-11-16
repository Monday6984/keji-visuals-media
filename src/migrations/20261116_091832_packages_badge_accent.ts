import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_packages_accent" AS ENUM('none', 'bronze', 'silver', 'gold');
  ALTER TABLE "packages" ADD COLUMN "badge" varchar;
  ALTER TABLE "packages" ADD COLUMN "accent" "enum_packages_accent" DEFAULT 'none';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages" DROP COLUMN "badge";
  ALTER TABLE "packages" DROP COLUMN "accent";
  DROP TYPE "public"."enum_packages_accent";`)
}
