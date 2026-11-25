import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`services_price_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`price_from\` numeric,
  	\`price_to\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_price_table_order_idx\` ON \`services_price_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_price_table_parent_id_idx\` ON \`services_price_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_price_table_locales\` (
  	\`item\` text NOT NULL,
  	\`note\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_price_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_price_table_locales_locale_parent_id_unique\` ON \`services_price_table_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_faq_order_idx\` ON \`services_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_faq_parent_id_idx\` ON \`services_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_faq_locales\` (
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_faq_locales_locale_parent_id_unique\` ON \`services_faq_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`product_categories_price_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`price_from\` numeric,
  	\`price_to\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`product_categories_price_table_order_idx\` ON \`product_categories_price_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_price_table_parent_id_idx\` ON \`product_categories_price_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`product_categories_price_table_locales\` (
  	\`item\` text NOT NULL,
  	\`note\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`product_categories_price_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`product_categories_price_table_locales_locale_parent_id_uniq\` ON \`product_categories_price_table_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`product_categories_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`product_categories_faq_order_idx\` ON \`product_categories_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_faq_parent_id_idx\` ON \`product_categories_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`product_categories_faq_locales\` (
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`product_categories_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`product_categories_faq_locales_locale_parent_id_unique\` ON \`product_categories_faq_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`services_locales\` ADD \`heading\` text;`)
  await db.run(sql`ALTER TABLE \`services_locales\` ADD \`guide\` text;`)
  await db.run(sql`ALTER TABLE \`product_categories_locales\` ADD \`heading\` text;`)
  await db.run(sql`ALTER TABLE \`product_categories_locales\` ADD \`guide\` text;`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`series\` text;`)
  await db.run(sql`ALTER TABLE \`products_locales\` ADD \`seo_text\` text;`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`client\` text;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` ADD \`city\` text;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` ADD \`object_type\` text;`)
  await db.run(sql`ALTER TABLE \`projects_rels\` ADD \`products_id\` integer REFERENCES products(id);`)
  await db.run(sql`CREATE INDEX \`projects_rels_products_id_idx\` ON \`projects_rels\` (\`products_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`services_price_table\`;`)
  await db.run(sql`DROP TABLE \`services_price_table_locales\`;`)
  await db.run(sql`DROP TABLE \`services_faq\`;`)
  await db.run(sql`DROP TABLE \`services_faq_locales\`;`)
  await db.run(sql`DROP TABLE \`product_categories_price_table\`;`)
  await db.run(sql`DROP TABLE \`product_categories_price_table_locales\`;`)
  await db.run(sql`DROP TABLE \`product_categories_faq\`;`)
  await db.run(sql`DROP TABLE \`product_categories_faq_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_projects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_projects_rels\`("id", "order", "parent_id", "path", "media_id") SELECT "id", "order", "parent_id", "path", "media_id" FROM \`projects_rels\`;`)
  await db.run(sql`DROP TABLE \`projects_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_projects_rels\` RENAME TO \`projects_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`projects_rels_order_idx\` ON \`projects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_parent_idx\` ON \`projects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_path_idx\` ON \`projects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_media_id_idx\` ON \`projects_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`services_locales\` DROP COLUMN \`heading\`;`)
  await db.run(sql`ALTER TABLE \`services_locales\` DROP COLUMN \`guide\`;`)
  await db.run(sql`ALTER TABLE \`product_categories_locales\` DROP COLUMN \`heading\`;`)
  await db.run(sql`ALTER TABLE \`product_categories_locales\` DROP COLUMN \`guide\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`series\`;`)
  await db.run(sql`ALTER TABLE \`products_locales\` DROP COLUMN \`seo_text\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`client\`;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` DROP COLUMN \`city\`;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` DROP COLUMN \`object_type\`;`)
}
