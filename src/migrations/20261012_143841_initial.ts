import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_highlights_order_idx\` ON \`pages_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_highlights_parent_id_idx\` ON \`pages_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_highlights_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_highlights\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_highlights_locales_locale_parent_id_unique\` ON \`pages_highlights_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_slides_order_idx\` ON \`pages_blocks_hero_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_slides_parent_id_idx\` ON \`pages_blocks_hero_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_slides_image_idx\` ON \`pages_blocks_hero_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_slides_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero_slides\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_hero_slides_locales_locale_parent_id_unique\` ON \`pages_blocks_hero_slides_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`height\` text DEFAULT 'large',
  	\`interval\` numeric DEFAULT 3.5,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_order_idx\` ON \`pages_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_parent_id_idx\` ON \`pages_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_path_idx\` ON \`pages_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_intro_band\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`tone\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_band_order_idx\` ON \`pages_blocks_intro_band\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_band_parent_id_idx\` ON \`pages_blocks_intro_band\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_band_path_idx\` ON \`pages_blocks_intro_band\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_intro_band_locales\` (
  	\`text\` text NOT NULL,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_intro_band\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_intro_band_locales_locale_parent_id_unique\` ON \`pages_blocks_intro_band_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_category_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'top',
  	\`columns\` text DEFAULT '4',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_category_grid_order_idx\` ON \`pages_blocks_category_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_category_grid_parent_id_idx\` ON \`pages_blocks_category_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_category_grid_path_idx\` ON \`pages_blocks_category_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_category_grid_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_category_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_category_grid_locales_locale_parent_id_unique\` ON \`pages_blocks_category_grid_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_product_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'featured',
  	\`category_id\` integer,
  	\`limit\` numeric DEFAULT 6,
  	\`columns\` text DEFAULT '3',
  	\`tone\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_product_tiles_order_idx\` ON \`pages_blocks_product_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_product_tiles_parent_id_idx\` ON \`pages_blocks_product_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_product_tiles_path_idx\` ON \`pages_blocks_product_tiles\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_product_tiles_category_idx\` ON \`pages_blocks_product_tiles\` (\`category_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_product_tiles_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_product_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_product_tiles_locales_locale_parent_id_unique\` ON \`pages_blocks_product_tiles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_image_tiles_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_image_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_tiles_tiles_order_idx\` ON \`pages_blocks_image_tiles_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_tiles_tiles_parent_id_idx\` ON \`pages_blocks_image_tiles_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_tiles_tiles_image_idx\` ON \`pages_blocks_image_tiles_tiles\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_image_tiles_tiles_locales\` (
  	\`title\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_image_tiles_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_image_tiles_tiles_locales_locale_parent_id_uniq\` ON \`pages_blocks_image_tiles_tiles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_image_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '3',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_tiles_order_idx\` ON \`pages_blocks_image_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_tiles_parent_id_idx\` ON \`pages_blocks_image_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_tiles_path_idx\` ON \`pages_blocks_image_tiles\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_image_tiles_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_image_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_image_tiles_locales_locale_parent_id_unique\` ON \`pages_blocks_image_tiles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_order_idx\` ON \`pages_blocks_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_parent_id_idx\` ON \`pages_blocks_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_path_idx\` ON \`pages_blocks_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_image_idx\` ON \`pages_blocks_banner\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_banner_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_banner_locales_locale_parent_id_unique\` ON \`pages_blocks_banner_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_band\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`tone\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_band_order_idx\` ON \`pages_blocks_cta_band\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_band_parent_id_idx\` ON \`pages_blocks_cta_band\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_band_path_idx\` ON \`pages_blocks_cta_band\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_band_locales\` (
  	\`text\` text NOT NULL,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta_band\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_cta_band_locales_locale_parent_id_unique\` ON \`pages_blocks_cta_band_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_order_idx\` ON \`pages_blocks_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_parent_id_idx\` ON \`pages_blocks_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_services_path_idx\` ON \`pages_blocks_services\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_services_locales\` (
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_services_locales_locale_parent_id_unique\` ON \`pages_blocks_services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_projects\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`limit\` numeric DEFAULT 6,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_projects_order_idx\` ON \`pages_blocks_projects\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_projects_parent_id_idx\` ON \`pages_blocks_projects\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_projects_path_idx\` ON \`pages_blocks_projects\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_projects_locales\` (
  	\`heading\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_projects_locales_locale_parent_id_unique\` ON \`pages_blocks_projects_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_text_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`image_position\` text DEFAULT 'right',
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`tone\` text DEFAULT 'white',
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_text_image_order_idx\` ON \`pages_blocks_text_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_text_image_parent_id_idx\` ON \`pages_blocks_text_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_text_image_path_idx\` ON \`pages_blocks_text_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_text_image_image_idx\` ON \`pages_blocks_text_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_text_image_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_text_image\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_text_image_locales_locale_parent_id_unique\` ON \`pages_blocks_text_image_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`align\` text DEFAULT 'left',
  	\`tone\` text DEFAULT 'white',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_order_idx\` ON \`pages_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_parent_id_idx\` ON \`pages_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_path_idx\` ON \`pages_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text_locales\` (
  	\`heading\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_rich_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_rich_text_locales_locale_parent_id_unique\` ON \`pages_blocks_rich_text_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'home',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_order_idx\` ON \`pages_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_parent_id_idx\` ON \`pages_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_path_idx\` ON \`pages_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_faq_locales_locale_parent_id_unique\` ON \`pages_blocks_faq_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_clients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_clients_order_idx\` ON \`pages_blocks_clients\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_clients_parent_id_idx\` ON \`pages_blocks_clients\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_clients_path_idx\` ON \`pages_blocks_clients\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_clients_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_clients_locales_locale_parent_id_unique\` ON \`pages_blocks_clients_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_order_idx\` ON \`pages_blocks_contact\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_parent_id_idx\` ON \`pages_blocks_contact\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_path_idx\` ON \`pages_blocks_contact\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_contact_locales_locale_parent_id_unique\` ON \`pages_blocks_contact_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`embed_url\` text,
  	\`height\` numeric DEFAULT 440,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_order_idx\` ON \`pages_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_parent_id_idx\` ON \`pages_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_path_idx\` ON \`pages_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_map_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_map\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_map_locales_locale_parent_id_unique\` ON \`pages_blocks_map_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`template\` text DEFAULT 'default' NOT NULL,
  	\`hero_image_id\` integer,
  	\`meta_no_index\` integer DEFAULT false,
  	\`meta_canonical\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_hero_image_idx\` ON \`pages\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`pages_locales\` (
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`lead\` text,
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_slug_idx\` ON \`pages_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_locales_locale_parent_id_unique\` ON \`pages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_rels\` (
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
  await db.run(sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_services_id_idx\` ON \`pages_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_product_categories_id_idx\` ON \`pages_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_products_id_idx\` ON \`pages_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_projects_id_idx\` ON \`pages_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_faqs_id_idx\` ON \`pages_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE TABLE \`services_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'check',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_features_order_idx\` ON \`services_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_features_parent_id_idx\` ON \`services_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_features_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_features_locales_locale_parent_id_unique\` ON \`services_features_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_hero_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_hero_slides_order_idx\` ON \`services_blocks_hero_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_hero_slides_parent_id_idx\` ON \`services_blocks_hero_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_hero_slides_image_idx\` ON \`services_blocks_hero_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_hero_slides_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_hero_slides\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_hero_slides_locales_locale_parent_id_unique\` ON \`services_blocks_hero_slides_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`height\` text DEFAULT 'large',
  	\`interval\` numeric DEFAULT 3.5,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_hero_order_idx\` ON \`services_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_hero_parent_id_idx\` ON \`services_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_hero_path_idx\` ON \`services_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_intro_band\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`tone\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_intro_band_order_idx\` ON \`services_blocks_intro_band\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_intro_band_parent_id_idx\` ON \`services_blocks_intro_band\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_intro_band_path_idx\` ON \`services_blocks_intro_band\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_intro_band_locales\` (
  	\`text\` text NOT NULL,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_intro_band\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_intro_band_locales_locale_parent_id_unique\` ON \`services_blocks_intro_band_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_category_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'top',
  	\`columns\` text DEFAULT '4',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_category_grid_order_idx\` ON \`services_blocks_category_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_category_grid_parent_id_idx\` ON \`services_blocks_category_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_category_grid_path_idx\` ON \`services_blocks_category_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_category_grid_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_category_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_category_grid_locales_locale_parent_id_uniqu\` ON \`services_blocks_category_grid_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_product_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'featured',
  	\`category_id\` integer,
  	\`limit\` numeric DEFAULT 6,
  	\`columns\` text DEFAULT '3',
  	\`tone\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_product_tiles_order_idx\` ON \`services_blocks_product_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_product_tiles_parent_id_idx\` ON \`services_blocks_product_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_product_tiles_path_idx\` ON \`services_blocks_product_tiles\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_product_tiles_category_idx\` ON \`services_blocks_product_tiles\` (\`category_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_product_tiles_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_product_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_product_tiles_locales_locale_parent_id_uniqu\` ON \`services_blocks_product_tiles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_image_tiles_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_image_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_image_tiles_tiles_order_idx\` ON \`services_blocks_image_tiles_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_image_tiles_tiles_parent_id_idx\` ON \`services_blocks_image_tiles_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_image_tiles_tiles_image_idx\` ON \`services_blocks_image_tiles_tiles\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_image_tiles_tiles_locales\` (
  	\`title\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_image_tiles_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_image_tiles_tiles_locales_locale_parent_id_u\` ON \`services_blocks_image_tiles_tiles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_image_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '3',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_image_tiles_order_idx\` ON \`services_blocks_image_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_image_tiles_parent_id_idx\` ON \`services_blocks_image_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_image_tiles_path_idx\` ON \`services_blocks_image_tiles\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_image_tiles_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_image_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_image_tiles_locales_locale_parent_id_unique\` ON \`services_blocks_image_tiles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_banner_order_idx\` ON \`services_blocks_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_banner_parent_id_idx\` ON \`services_blocks_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_banner_path_idx\` ON \`services_blocks_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_banner_image_idx\` ON \`services_blocks_banner\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_banner_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_banner_locales_locale_parent_id_unique\` ON \`services_blocks_banner_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_cta_band\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`tone\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_cta_band_order_idx\` ON \`services_blocks_cta_band\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_cta_band_parent_id_idx\` ON \`services_blocks_cta_band\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_cta_band_path_idx\` ON \`services_blocks_cta_band\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_cta_band_locales\` (
  	\`text\` text NOT NULL,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_cta_band\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_cta_band_locales_locale_parent_id_unique\` ON \`services_blocks_cta_band_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_services_order_idx\` ON \`services_blocks_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_services_parent_id_idx\` ON \`services_blocks_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_services_path_idx\` ON \`services_blocks_services\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_services_locales\` (
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_services_locales_locale_parent_id_unique\` ON \`services_blocks_services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_projects\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`limit\` numeric DEFAULT 6,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_projects_order_idx\` ON \`services_blocks_projects\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_projects_parent_id_idx\` ON \`services_blocks_projects\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_projects_path_idx\` ON \`services_blocks_projects\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_projects_locales\` (
  	\`heading\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_projects_locales_locale_parent_id_unique\` ON \`services_blocks_projects_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_text_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`image_position\` text DEFAULT 'right',
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`tone\` text DEFAULT 'white',
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_text_image_order_idx\` ON \`services_blocks_text_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_text_image_parent_id_idx\` ON \`services_blocks_text_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_text_image_path_idx\` ON \`services_blocks_text_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_text_image_image_idx\` ON \`services_blocks_text_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_text_image_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_text_image\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_text_image_locales_locale_parent_id_unique\` ON \`services_blocks_text_image_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`align\` text DEFAULT 'left',
  	\`tone\` text DEFAULT 'white',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_rich_text_order_idx\` ON \`services_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_rich_text_parent_id_idx\` ON \`services_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_rich_text_path_idx\` ON \`services_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_rich_text_locales\` (
  	\`heading\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_rich_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_rich_text_locales_locale_parent_id_unique\` ON \`services_blocks_rich_text_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'home',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_faq_order_idx\` ON \`services_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_faq_parent_id_idx\` ON \`services_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_faq_path_idx\` ON \`services_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_faq_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_faq_locales_locale_parent_id_unique\` ON \`services_blocks_faq_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_clients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_clients_order_idx\` ON \`services_blocks_clients\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_clients_parent_id_idx\` ON \`services_blocks_clients\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_clients_path_idx\` ON \`services_blocks_clients\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_clients_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_clients_locales_locale_parent_id_unique\` ON \`services_blocks_clients_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_contact\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_contact_order_idx\` ON \`services_blocks_contact\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_contact_parent_id_idx\` ON \`services_blocks_contact\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_contact_path_idx\` ON \`services_blocks_contact\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_contact_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_contact_locales_locale_parent_id_unique\` ON \`services_blocks_contact_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`embed_url\` text,
  	\`height\` numeric DEFAULT 440,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_map_order_idx\` ON \`services_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_map_parent_id_idx\` ON \`services_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_map_path_idx\` ON \`services_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_map_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_map\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_map_locales_locale_parent_id_unique\` ON \`services_blocks_map_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` numeric DEFAULT 0,
  	\`hero_image_id\` integer NOT NULL,
  	\`why_image_id\` integer,
  	\`product_category_id\` integer,
  	\`brochure_id\` integer,
  	\`meta_no_index\` integer DEFAULT false,
  	\`meta_canonical\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`why_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`product_category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`brochure_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`services_hero_image_idx\` ON \`services\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_why_image_idx\` ON \`services\` (\`why_image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_product_category_idx\` ON \`services\` (\`product_category_id\`);`)
  await db.run(sql`CREATE INDEX \`services_brochure_idx\` ON \`services\` (\`brochure_id\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`services_locales\` (
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`badge\` text,
  	\`tagline\` text NOT NULL,
  	\`intro_heading\` text,
  	\`intro\` text,
  	\`why_heading\` text,
  	\`why\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_slug_idx\` ON \`services_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`services_meta_meta_image_idx\` ON \`services_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_locales_locale_parent_id_unique\` ON \`services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`faqs_id\` integer,
  	\`pages_id\` integer,
  	\`services_id\` integer,
  	\`product_categories_id\` integer,
  	\`products_id\` integer,
  	\`projects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_rels_order_idx\` ON \`services_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_parent_idx\` ON \`services_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_path_idx\` ON \`services_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_media_id_idx\` ON \`services_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_faqs_id_idx\` ON \`services_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_pages_id_idx\` ON \`services_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_services_id_idx\` ON \`services_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_product_categories_id_idx\` ON \`services_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_products_id_idx\` ON \`services_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_projects_id_idx\` ON \`services_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE TABLE \`product_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` numeric DEFAULT 0,
  	\`parent_id\` integer,
  	\`show_in_menu\` integer DEFAULT true,
  	\`image_id\` integer,
  	\`image_fit\` text DEFAULT 'cover',
  	\`meta_no_index\` integer DEFAULT false,
  	\`meta_canonical\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`product_categories_parent_idx\` ON \`product_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_image_idx\` ON \`product_categories\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_updated_at_idx\` ON \`product_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_created_at_idx\` ON \`product_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`product_categories_locales\` (
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`description\` text,
  	\`content\` text,
  	\`search_text\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`product_categories_slug_idx\` ON \`product_categories_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_search_text_idx\` ON \`product_categories_locales\` (\`search_text\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`product_categories_meta_meta_image_idx\` ON \`product_categories_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`product_categories_locales_locale_parent_id_unique\` ON \`product_categories_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_highlights_order_idx\` ON \`products_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_highlights_parent_id_idx\` ON \`products_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_highlights_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_highlights\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_highlights_locales_locale_parent_id_unique\` ON \`products_highlights_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_specs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_specs_order_idx\` ON \`products_specs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_specs_parent_id_idx\` ON \`products_specs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_specs_locales\` (
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_specs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_specs_locales_locale_parent_id_unique\` ON \`products_specs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_downloads\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_downloads_order_idx\` ON \`products_downloads\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_downloads_parent_id_idx\` ON \`products_downloads\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_downloads_file_idx\` ON \`products_downloads\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`products_downloads_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_downloads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_downloads_locales_locale_parent_id_unique\` ON \`products_downloads_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`video_url\` text,
  	\`datasheet_id\` integer,
  	\`price\` numeric,
  	\`availability\` text DEFAULT 'request',
  	\`meta_no_index\` integer DEFAULT false,
  	\`meta_canonical\` text,
  	\`category_id\` integer NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`code\` text,
  	\`brand\` text DEFAULT 'Key Automation',
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`datasheet_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`products_datasheet_idx\` ON \`products\` (\`datasheet_id\`);`)
  await db.run(sql`CREATE INDEX \`products_category_idx\` ON \`products\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`products_locales\` (
  	\`title\` text NOT NULL,
  	\`excerpt\` text,
  	\`description\` text,
  	\`price_note\` text,
  	\`warranty\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`slug\` text,
  	\`search_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_meta_meta_image_idx\` ON \`products_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`products_slug_idx\` ON \`products_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`products_search_text_idx\` ON \`products_locales\` (\`search_text\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_locales_locale_parent_id_unique\` ON \`products_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_rels_order_idx\` ON \`products_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_parent_idx\` ON \`products_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_path_idx\` ON \`products_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_media_id_idx\` ON \`products_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_products_id_idx\` ON \`products_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` numeric DEFAULT 0,
  	\`service_id\` integer,
  	\`year\` numeric,
  	\`cover_id\` integer NOT NULL,
  	\`meta_no_index\` integer DEFAULT false,
  	\`meta_canonical\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_service_idx\` ON \`projects\` (\`service_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_cover_idx\` ON \`projects\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`projects_locales\` (
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`location\` text,
  	\`summary\` text,
  	\`body\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_slug_idx\` ON \`projects_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`projects_meta_meta_image_idx\` ON \`projects_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_locales_locale_parent_id_unique\` ON \`projects_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_rels_order_idx\` ON \`projects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_parent_idx\` ON \`projects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_path_idx\` ON \`projects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_media_id_idx\` ON \`projects_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`faqs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_on_home\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`faqs_locales\` (
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`faqs_locales_locale_parent_id_unique\` ON \`faqs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`clients\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`logo_id\` integer NOT NULL,
  	\`url\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`clients_logo_idx\` ON \`clients\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`clients_updated_at_idx\` ON \`clients\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`clients_created_at_idx\` ON \`clients\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumb_url\` text,
  	\`sizes_thumb_width\` numeric,
  	\`sizes_thumb_height\` numeric,
  	\`sizes_thumb_mime_type\` text,
  	\`sizes_thumb_filesize\` numeric,
  	\`sizes_thumb_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_hero_url\` text,
  	\`sizes_hero_width\` numeric,
  	\`sizes_hero_height\` numeric,
  	\`sizes_hero_mime_type\` text,
  	\`sizes_hero_filesize\` numeric,
  	\`sizes_hero_filename\` text,
  	\`sizes_og_url\` text,
  	\`sizes_og_width\` numeric,
  	\`sizes_og_height\` numeric,
  	\`sizes_og_mime_type\` text,
  	\`sizes_og_filesize\` numeric,
  	\`sizes_og_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumb_sizes_thumb_filename_idx\` ON \`media\` (\`sizes_thumb_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`)
  await db.run(sql`CREATE TABLE \`media_locales\` (
  	\`alt\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chats\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`visitor_name\` text NOT NULL,
  	\`contact\` text,
  	\`status\` text DEFAULT 'open',
  	\`unread\` integer DEFAULT true,
  	\`last_message\` text,
  	\`last_message_at\` text,
  	\`locale\` text,
  	\`page\` text,
  	\`notes\` text,
  	\`token\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`chats_unread_idx\` ON \`chats\` (\`unread\`);`)
  await db.run(sql`CREATE INDEX \`chats_last_message_at_idx\` ON \`chats\` (\`last_message_at\`);`)
  await db.run(sql`CREATE INDEX \`chats_updated_at_idx\` ON \`chats\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chats_created_at_idx\` ON \`chats\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`chat_messages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`chat_id\` integer NOT NULL,
  	\`from\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`author_name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`chat_id\`) REFERENCES \`chats\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`chat_messages_chat_idx\` ON \`chat_messages\` (\`chat_id\`);`)
  await db.run(sql`CREATE INDEX \`chat_messages_updated_at_idx\` ON \`chat_messages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chat_messages_created_at_idx\` ON \`chat_messages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`inquiries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`status\` text DEFAULT 'new',
  	\`name\` text NOT NULL,
  	\`phone\` text,
  	\`email\` text,
  	\`service\` text,
  	\`message\` text NOT NULL,
  	\`locale\` text,
  	\`page_url\` text,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`inquiries_updated_at_idx\` ON \`inquiries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_created_at_idx\` ON \`inquiries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
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
  	\`clients_id\` integer,
  	\`media_id\` integer,
  	\`chats_id\` integer,
  	\`chat_messages_id\` integer,
  	\`inquiries_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clients_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`chats_id\`) REFERENCES \`chats\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`chat_messages_id\`) REFERENCES \`chat_messages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`inquiries_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chats_id_idx\` ON \`payload_locked_documents_rels\` (\`chats_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chat_messages_id_idx\` ON \`payload_locked_documents_rels\` (\`chat_messages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_hero_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_hero_slides_order_idx\` ON \`home_blocks_hero_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_hero_slides_parent_id_idx\` ON \`home_blocks_hero_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_hero_slides_image_idx\` ON \`home_blocks_hero_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_hero_slides_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_hero_slides\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_hero_slides_locales_locale_parent_id_unique\` ON \`home_blocks_hero_slides_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`height\` text DEFAULT 'large',
  	\`interval\` numeric DEFAULT 3.5,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_hero_order_idx\` ON \`home_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_hero_parent_id_idx\` ON \`home_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_hero_path_idx\` ON \`home_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_intro_band\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`tone\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_intro_band_order_idx\` ON \`home_blocks_intro_band\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_intro_band_parent_id_idx\` ON \`home_blocks_intro_band\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_intro_band_path_idx\` ON \`home_blocks_intro_band\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_intro_band_locales\` (
  	\`text\` text NOT NULL,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_intro_band\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_intro_band_locales_locale_parent_id_unique\` ON \`home_blocks_intro_band_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_category_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'top',
  	\`columns\` text DEFAULT '4',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_category_grid_order_idx\` ON \`home_blocks_category_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_category_grid_parent_id_idx\` ON \`home_blocks_category_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_category_grid_path_idx\` ON \`home_blocks_category_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_category_grid_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_category_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_category_grid_locales_locale_parent_id_unique\` ON \`home_blocks_category_grid_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_product_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'featured',
  	\`category_id\` integer,
  	\`limit\` numeric DEFAULT 6,
  	\`columns\` text DEFAULT '3',
  	\`tone\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_product_tiles_order_idx\` ON \`home_blocks_product_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_product_tiles_parent_id_idx\` ON \`home_blocks_product_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_product_tiles_path_idx\` ON \`home_blocks_product_tiles\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_product_tiles_category_idx\` ON \`home_blocks_product_tiles\` (\`category_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_product_tiles_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_product_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_product_tiles_locales_locale_parent_id_unique\` ON \`home_blocks_product_tiles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_image_tiles_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_image_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_image_tiles_tiles_order_idx\` ON \`home_blocks_image_tiles_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_image_tiles_tiles_parent_id_idx\` ON \`home_blocks_image_tiles_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_image_tiles_tiles_image_idx\` ON \`home_blocks_image_tiles_tiles\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_image_tiles_tiles_locales\` (
  	\`title\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_image_tiles_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_image_tiles_tiles_locales_locale_parent_id_uniqu\` ON \`home_blocks_image_tiles_tiles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_image_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`columns\` text DEFAULT '3',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_image_tiles_order_idx\` ON \`home_blocks_image_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_image_tiles_parent_id_idx\` ON \`home_blocks_image_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_image_tiles_path_idx\` ON \`home_blocks_image_tiles\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_image_tiles_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_image_tiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_image_tiles_locales_locale_parent_id_unique\` ON \`home_blocks_image_tiles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_banner_order_idx\` ON \`home_blocks_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_banner_parent_id_idx\` ON \`home_blocks_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_banner_path_idx\` ON \`home_blocks_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_banner_image_idx\` ON \`home_blocks_banner\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_banner_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_banner_locales_locale_parent_id_unique\` ON \`home_blocks_banner_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_cta_band\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`tone\` text DEFAULT 'grey',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_cta_band_order_idx\` ON \`home_blocks_cta_band\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_cta_band_parent_id_idx\` ON \`home_blocks_cta_band\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_cta_band_path_idx\` ON \`home_blocks_cta_band\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_cta_band_locales\` (
  	\`text\` text NOT NULL,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_cta_band\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_cta_band_locales_locale_parent_id_unique\` ON \`home_blocks_cta_band_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_services_order_idx\` ON \`home_blocks_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_services_parent_id_idx\` ON \`home_blocks_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_services_path_idx\` ON \`home_blocks_services\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_services_locales\` (
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_services_locales_locale_parent_id_unique\` ON \`home_blocks_services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_projects\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`limit\` numeric DEFAULT 6,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_projects_order_idx\` ON \`home_blocks_projects\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_projects_parent_id_idx\` ON \`home_blocks_projects\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_projects_path_idx\` ON \`home_blocks_projects\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_projects_locales\` (
  	\`heading\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_projects_locales_locale_parent_id_unique\` ON \`home_blocks_projects_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_text_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`image_position\` text DEFAULT 'right',
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	\`tone\` text DEFAULT 'white',
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_text_image_order_idx\` ON \`home_blocks_text_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_text_image_parent_id_idx\` ON \`home_blocks_text_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_text_image_path_idx\` ON \`home_blocks_text_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_text_image_image_idx\` ON \`home_blocks_text_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_text_image_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_text_image\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_text_image_locales_locale_parent_id_unique\` ON \`home_blocks_text_image_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`align\` text DEFAULT 'left',
  	\`tone\` text DEFAULT 'white',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_rich_text_order_idx\` ON \`home_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_rich_text_parent_id_idx\` ON \`home_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_rich_text_path_idx\` ON \`home_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_rich_text_locales\` (
  	\`heading\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_rich_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_rich_text_locales_locale_parent_id_unique\` ON \`home_blocks_rich_text_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source\` text DEFAULT 'home',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_faq_order_idx\` ON \`home_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_faq_parent_id_idx\` ON \`home_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_faq_path_idx\` ON \`home_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_faq_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_faq_locales_locale_parent_id_unique\` ON \`home_blocks_faq_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_clients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_clients_order_idx\` ON \`home_blocks_clients\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_clients_parent_id_idx\` ON \`home_blocks_clients\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_clients_path_idx\` ON \`home_blocks_clients\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_clients_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_clients_locales_locale_parent_id_unique\` ON \`home_blocks_clients_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_contact\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_contact_order_idx\` ON \`home_blocks_contact\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_contact_parent_id_idx\` ON \`home_blocks_contact\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_contact_path_idx\` ON \`home_blocks_contact\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_contact_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_contact_locales_locale_parent_id_unique\` ON \`home_blocks_contact_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`embed_url\` text,
  	\`height\` numeric DEFAULT 440,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_map_order_idx\` ON \`home_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_map_parent_id_idx\` ON \`home_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_map_path_idx\` ON \`home_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_map_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_map\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_map_locales_locale_parent_id_unique\` ON \`home_blocks_map_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`meta_no_index\` integer DEFAULT false,
  	\`meta_canonical\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`home_locales\` (
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_meta_meta_image_idx\` ON \`home_locales\` (\`meta_image_id\`,\`_locale\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`home_locales_locale_parent_id_unique\` ON \`home_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_rels\` (
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
  await db.run(sql`CREATE INDEX \`home_rels_order_idx\` ON \`home_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_parent_idx\` ON \`home_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_path_idx\` ON \`home_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_pages_id_idx\` ON \`home_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_services_id_idx\` ON \`home_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_product_categories_id_idx\` ON \`home_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_products_id_idx\` ON \`home_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_projects_id_idx\` ON \`home_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_faqs_id_idx\` ON \`home_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_items_children_order_idx\` ON \`navigation_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_items_children_parent_id_idx\` ON \`navigation_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_items_children_locales\` (
  	\`label\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_items_children\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_items_children_locales_locale_parent_id_unique\` ON \`navigation_items_children_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kind\` text DEFAULT 'link' NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_items_order_idx\` ON \`navigation_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_items_parent_id_idx\` ON \`navigation_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_items_locales\` (
  	\`label\` text NOT NULL,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_items_locales_locale_parent_id_unique\` ON \`navigation_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_links_order_idx\` ON \`navigation_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_links_parent_id_idx\` ON \`navigation_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns_links_locales\` (
  	\`label\` text NOT NULL,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_columns_links_locales_locale_parent_id_uni\` ON \`navigation_footer_columns_links_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_order_idx\` ON \`navigation_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_parent_id_idx\` ON \`navigation_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns_locales\` (
  	\`title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_columns_locales_locale_parent_id_unique\` ON \`navigation_footer_columns_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cta_type\` text DEFAULT 'internal',
  	\`cta_new_tab\` integer,
  	\`show_search\` integer DEFAULT true,
  	\`show_phone\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`navigation_locales\` (
  	\`cta_label\` text,
  	\`cta_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_locales_locale_parent_id_unique\` ON \`navigation_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`services_id\` integer,
  	\`product_categories_id\` integer,
  	\`products_id\` integer,
  	\`projects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_rels_order_idx\` ON \`navigation_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_rels_parent_idx\` ON \`navigation_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation_rels_path_idx\` ON \`navigation_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`navigation_rels_pages_id_idx\` ON \`navigation_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation_rels_services_id_idx\` ON \`navigation_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation_rels_product_categories_id_idx\` ON \`navigation_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation_rels_products_id_idx\` ON \`navigation_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation_rels_projects_id_idx\` ON \`navigation_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`handle\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_socials_order_idx\` ON \`settings_socials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_socials_parent_id_idx\` ON \`settings_socials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'KGB Automation' NOT NULL,
  	\`logo_id\` integer,
  	\`favicon_id\` integer,
  	\`phone\` text,
  	\`phone_display\` text,
  	\`email\` text,
  	\`maps_url\` text,
  	\`map_embed_url\` text,
  	\`accent_color\` text DEFAULT '#2bb04a',
  	\`dark_color\` text DEFAULT '#2f3336',
  	\`grey_color\` text DEFAULT '#ededed',
  	\`chat_enabled\` integer DEFAULT true,
  	\`chat_agent_name\` text DEFAULT 'KGB Automation',
  	\`chat_avatar_id\` integer,
  	\`chat_whatsapp\` text,
  	\`chat_viber\` text,
  	\`chat_notify_email\` text,
  	\`legal_name\` text,
  	\`pib\` text,
  	\`mb\` text,
  	\`activity_code\` text,
  	\`bank_account\` text,
  	\`title_template\` text DEFAULT '| KGB Automation',
  	\`default_og_image_id\` integer,
  	\`google_verification\` text,
  	\`bing_verification\` text,
  	\`yandex_verification\` text,
  	\`ga_measurement_id\` text,
  	\`no_index_site\` integer DEFAULT false,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`chat_avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`default_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_logo_idx\` ON \`settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_favicon_idx\` ON \`settings\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_chat_chat_avatar_idx\` ON \`settings\` (\`chat_avatar_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_default_og_image_idx\` ON \`settings\` (\`default_og_image_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_locales\` (
  	\`footer_text\` text,
  	\`address\` text,
  	\`working_hours\` text,
  	\`chat_agent_title\` text,
  	\`chat_greeting\` text,
  	\`default_description\` text,
  	\`keywords\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`settings_locales_locale_parent_id_unique\` ON \`settings_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_highlights\`;`)
  await db.run(sql`DROP TABLE \`pages_highlights_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_slides\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_slides_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_intro_band\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_intro_band_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_category_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_category_grid_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_product_tiles\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_product_tiles_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image_tiles_tiles\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image_tiles_tiles_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image_tiles\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image_tiles_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_banner\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_banner_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_band\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_band_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_services_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_projects\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_projects_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_text_image\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_text_image_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_clients\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_clients_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_map_locales\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_rels\`;`)
  await db.run(sql`DROP TABLE \`services_features\`;`)
  await db.run(sql`DROP TABLE \`services_features_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_hero_slides\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_hero_slides_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_intro_band\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_intro_band_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_category_grid\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_category_grid_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_product_tiles\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_product_tiles_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_image_tiles_tiles\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_image_tiles_tiles_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_image_tiles\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_image_tiles_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_banner\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_banner_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_cta_band\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_cta_band_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_services\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_services_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_projects\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_projects_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_text_image\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_text_image_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_rich_text_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_faq_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_clients\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_clients_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_contact\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_contact_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_map_locales\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`DROP TABLE \`services_locales\`;`)
  await db.run(sql`DROP TABLE \`services_rels\`;`)
  await db.run(sql`DROP TABLE \`product_categories\`;`)
  await db.run(sql`DROP TABLE \`product_categories_locales\`;`)
  await db.run(sql`DROP TABLE \`products_highlights\`;`)
  await db.run(sql`DROP TABLE \`products_highlights_locales\`;`)
  await db.run(sql`DROP TABLE \`products_specs\`;`)
  await db.run(sql`DROP TABLE \`products_specs_locales\`;`)
  await db.run(sql`DROP TABLE \`products_downloads\`;`)
  await db.run(sql`DROP TABLE \`products_downloads_locales\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_locales\`;`)
  await db.run(sql`DROP TABLE \`products_rels\`;`)
  await db.run(sql`DROP TABLE \`projects\`;`)
  await db.run(sql`DROP TABLE \`projects_locales\`;`)
  await db.run(sql`DROP TABLE \`projects_rels\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`faqs_locales\`;`)
  await db.run(sql`DROP TABLE \`clients\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`media_locales\`;`)
  await db.run(sql`DROP TABLE \`chats\`;`)
  await db.run(sql`DROP TABLE \`chat_messages\`;`)
  await db.run(sql`DROP TABLE \`inquiries\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_hero_slides\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_hero_slides_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_intro_band\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_intro_band_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_category_grid\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_category_grid_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_product_tiles\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_product_tiles_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_image_tiles_tiles\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_image_tiles_tiles_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_image_tiles\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_image_tiles_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_banner\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_banner_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_cta_band\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_cta_band_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_services\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_services_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_projects\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_projects_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_text_image\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_text_image_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_rich_text_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_faq_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_clients\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_clients_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_contact\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_contact_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_map_locales\`;`)
  await db.run(sql`DROP TABLE \`home\`;`)
  await db.run(sql`DROP TABLE \`home_locales\`;`)
  await db.run(sql`DROP TABLE \`home_rels\`;`)
  await db.run(sql`DROP TABLE \`navigation_items_children\`;`)
  await db.run(sql`DROP TABLE \`navigation_items_children_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation_items\`;`)
  await db.run(sql`DROP TABLE \`navigation_items_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns_links_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`DROP TABLE \`navigation_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation_rels\`;`)
  await db.run(sql`DROP TABLE \`settings_socials\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
  await db.run(sql`DROP TABLE \`settings_locales\`;`)
}
