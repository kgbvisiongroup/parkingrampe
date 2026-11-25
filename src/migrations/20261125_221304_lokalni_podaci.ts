import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`settings_business_opening_hours_days\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`settings_business_opening_hours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_business_opening_hours_days_order_idx\` ON \`settings_business_opening_hours_days\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`settings_business_opening_hours_days_parent_idx\` ON \`settings_business_opening_hours_days\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_business_opening_hours\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`opens\` text NOT NULL,
  	\`closes\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_business_opening_hours_order_idx\` ON \`settings_business_opening_hours\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_business_opening_hours_parent_id_idx\` ON \`settings_business_opening_hours\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`business_street_address\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`business_postal_code\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`business_address_locality\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`business_address_region\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`business_latitude\` numeric;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`business_longitude\` numeric;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`business_price_range\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`business_area_served\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`business_google_business_url\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`settings_business_opening_hours_days\`;`)
  await db.run(sql`DROP TABLE \`settings_business_opening_hours\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`business_street_address\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`business_postal_code\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`business_address_locality\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`business_address_region\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`business_latitude\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`business_longitude\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`business_price_range\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`business_area_served\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`business_google_business_url\`;`)
}
