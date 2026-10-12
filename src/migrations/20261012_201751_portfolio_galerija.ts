import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_media_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_gallery_order_idx\` ON \`pages_blocks_media_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_gallery_parent_id_idx\` ON \`pages_blocks_media_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_gallery_path_idx\` ON \`pages_blocks_media_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_media_gallery_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_media_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_media_gallery_locales_locale_parent_id_unique\` ON \`pages_blocks_media_gallery_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_media_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_media_gallery_order_idx\` ON \`services_blocks_media_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_media_gallery_parent_id_idx\` ON \`services_blocks_media_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_media_gallery_path_idx\` ON \`services_blocks_media_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_media_gallery_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_media_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_media_gallery_locales_locale_parent_id_uniqu\` ON \`services_blocks_media_gallery_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_media_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_media_gallery_order_idx\` ON \`home_blocks_media_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_media_gallery_parent_id_idx\` ON \`home_blocks_media_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_media_gallery_path_idx\` ON \`home_blocks_media_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_media_gallery_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_media_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_media_gallery_locales_locale_parent_id_unique\` ON \`home_blocks_media_gallery_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_rels\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_rels_media_id_idx\` ON \`pages_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`home_rels\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`home_rels_media_id_idx\` ON \`home_rels\` (\`media_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_media_gallery\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_gallery_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_media_gallery\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_media_gallery_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_media_gallery\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_media_gallery_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`services_id\` integer,
  	\`product_categories_id\` integer,
  	\`products_id\` integer,
  	\`projects_id\` integer,
  	\`faqs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_rels\`("id", "order", "parent_id", "path", "pages_id", "services_id", "product_categories_id", "products_id", "projects_id", "faqs_id") SELECT "id", "order", "parent_id", "path", "pages_id", "services_id", "product_categories_id", "products_id", "projects_id", "faqs_id" FROM \`pages_rels\`;`)
  await db.run(sql`DROP TABLE \`pages_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_rels\` RENAME TO \`pages_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_services_id_idx\` ON \`pages_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_product_categories_id_idx\` ON \`pages_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_products_id_idx\` ON \`pages_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_projects_id_idx\` ON \`pages_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_faqs_id_idx\` ON \`pages_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`services_id\` integer,
  	\`product_categories_id\` integer,
  	\`products_id\` integer,
  	\`projects_id\` integer,
  	\`faqs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_rels\`("id", "order", "parent_id", "path", "pages_id", "services_id", "product_categories_id", "products_id", "projects_id", "faqs_id") SELECT "id", "order", "parent_id", "path", "pages_id", "services_id", "product_categories_id", "products_id", "projects_id", "faqs_id" FROM \`home_rels\`;`)
  await db.run(sql`DROP TABLE \`home_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_rels\` RENAME TO \`home_rels\`;`)
  await db.run(sql`CREATE INDEX \`home_rels_order_idx\` ON \`home_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_parent_idx\` ON \`home_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_path_idx\` ON \`home_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_pages_id_idx\` ON \`home_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_services_id_idx\` ON \`home_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_product_categories_id_idx\` ON \`home_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_products_id_idx\` ON \`home_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_projects_id_idx\` ON \`home_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_faqs_id_idx\` ON \`home_rels\` (\`faqs_id\`);`)
}
