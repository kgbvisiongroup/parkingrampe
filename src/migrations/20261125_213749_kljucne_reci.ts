import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`services_locales\` ADD \`keyword\` text;`)
  await db.run(sql`ALTER TABLE \`product_categories_locales\` ADD \`keyword\` text;`)
  await db.run(sql`ALTER TABLE \`home_locales\` ADD \`heading\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`services_locales\` DROP COLUMN \`keyword\`;`)
  await db.run(sql`ALTER TABLE \`product_categories_locales\` DROP COLUMN \`keyword\`;`)
  await db.run(sql`ALTER TABLE \`home_locales\` DROP COLUMN \`heading\`;`)
}
