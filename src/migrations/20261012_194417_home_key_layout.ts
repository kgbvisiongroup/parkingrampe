import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_link_boxes_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_link_boxes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_boxes_items_order_idx\` ON \`pages_blocks_link_boxes_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_boxes_items_parent_id_idx\` ON \`pages_blocks_link_boxes_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_link_boxes_items_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_link_boxes_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_link_boxes_items_locales_locale_parent_id_uniqu\` ON \`pages_blocks_link_boxes_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_link_boxes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_boxes_order_idx\` ON \`pages_blocks_link_boxes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_boxes_parent_id_idx\` ON \`pages_blocks_link_boxes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_link_boxes_path_idx\` ON \`pages_blocks_link_boxes\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_link_boxes_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_link_boxes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_link_boxes_locales_locale_parent_id_unique\` ON \`pages_blocks_link_boxes_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_link_boxes_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_link_boxes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_link_boxes_items_order_idx\` ON \`services_blocks_link_boxes_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_link_boxes_items_parent_id_idx\` ON \`services_blocks_link_boxes_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_link_boxes_items_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_link_boxes_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_link_boxes_items_locales_locale_parent_id_un\` ON \`services_blocks_link_boxes_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_link_boxes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_blocks_link_boxes_order_idx\` ON \`services_blocks_link_boxes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_link_boxes_parent_id_idx\` ON \`services_blocks_link_boxes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_blocks_link_boxes_path_idx\` ON \`services_blocks_link_boxes\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`services_blocks_link_boxes_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_blocks_link_boxes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_blocks_link_boxes_locales_locale_parent_id_unique\` ON \`services_blocks_link_boxes_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_link_boxes_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'internal',
  	\`link_new_tab\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_link_boxes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_link_boxes_items_order_idx\` ON \`home_blocks_link_boxes_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_link_boxes_items_parent_id_idx\` ON \`home_blocks_link_boxes_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_link_boxes_items_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_link_boxes_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_link_boxes_items_locales_locale_parent_id_unique\` ON \`home_blocks_link_boxes_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_link_boxes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_blocks_link_boxes_order_idx\` ON \`home_blocks_link_boxes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_link_boxes_parent_id_idx\` ON \`home_blocks_link_boxes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_blocks_link_boxes_path_idx\` ON \`home_blocks_link_boxes\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`home_blocks_link_boxes_locales\` (
  	\`heading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_blocks_link_boxes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_blocks_link_boxes_locales_locale_parent_id_unique\` ON \`home_blocks_link_boxes_locales\` (\`_locale\`,\`_parent_id\`);`)
  await applyKeyHomeLayout(payload, req)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_link_boxes_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_link_boxes_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_link_boxes\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_link_boxes_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_link_boxes_items\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_link_boxes_items_locales\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_link_boxes\`;`)
  await db.run(sql`DROP TABLE \`services_blocks_link_boxes_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_link_boxes_items\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_link_boxes_items_locales\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_link_boxes\`;`)
  await db.run(sql`DROP TABLE \`home_blocks_link_boxes_locales\`;`)
}

/* ---------- data: home page in the Key Automation order ---------- */

type Block = { id?: string | null; blockType: string; [k: string]: unknown }

const BOXES = [
  { template: 'products', sr: ['Katalog proizvoda', 'Motori, rampe, oprema i datasheet-ovi'], en: ['Product catalogue', 'Motors, barriers, accessories and datasheets'] },
  { template: 'services', sr: ['Usluge', 'Ugradnja, servis i održavanje'], en: ['Services', 'Installation, service and maintenance'] },
  { template: 'portfolio', sr: ['Portfolio', 'Objekti na kojima smo radili'], en: ['Portfolio', 'Sites we have worked on'] },
  { template: 'about', sr: ['O nama', 'Licencirani partner Key Automation'], en: ['About us', 'Licensed Key Automation partner'] },
  { template: 'contact', sr: ['Kontakt', 'Zatražite besplatnu ponudu'], en: ['Contact', 'Request a free quote'] },
] as const

/**
 * Reorders the existing home page like keyautomation.com: hero, intro, categories in one row,
 * 3 featured products, projects, banner, call to action, map, useful links.
 * Images and texts stay as they are. Skipped on an empty database (the seed builds the page).
 */
async function applyKeyHomeLayout(payload: MigrateUpArgs['payload'], req: MigrateUpArgs['req']) {
  const home = await payload.findGlobal({ slug: 'home', locale: 'sr', depth: 0, req })
  const layout = (home?.layout ?? []) as Block[]
  if (!layout.length || layout.some((b) => b.blockType === 'linkBoxes')) return

  const drop = new Set(['richText', 'services', 'faq', 'clients'])
  const order = ['hero', 'introBand', 'categoryGrid', 'productTiles', 'projects', 'banner', 'ctaBand']
  const kept = layout.filter((b) => !drop.has(b.blockType))
  const main = order.flatMap((t) => kept.filter((b) => b.blockType === t))
  const other = kept.filter((b) => !order.includes(b.blockType) && b.blockType !== 'map')
  const map = kept.filter((b) => b.blockType === 'map')

  const pages = await payload.find({ collection: 'pages', depth: 0, limit: 50, req })
  const pageId = (template: string) => pages.docs.find((p) => p.template === template)?.id
  const boxes = BOXES.filter((b) => pageId(b.template))
  const linkBoxes: Block = {
    blockType: 'linkBoxes',
    heading: 'Korisni linkovi',
    items: boxes.map((b) => ({
      title: b.sr[0],
      text: b.sr[1],
      link: { type: 'internal', reference: { relationTo: 'pages', value: pageId(b.template) } },
    })),
  }

  const next = [...main, ...other, ...map, linkBoxes].map((b) => {
    if (b.blockType === 'categoryGrid') return { ...b, columns: '5' }
    if (b.blockType === 'productTiles') return { ...b, limit: 3 }
    return b
  })
  const saved = await payload.updateGlobal({ slug: 'home', locale: 'sr', data: { layout: next } as never, depth: 0, req })

  // English texts of the new block (same row ids, so the Serbian texts stay).
  const en = await payload.findGlobal({ slug: 'home', locale: 'en', depth: 0, req })
  const enLayout = ((en?.layout ?? saved.layout ?? []) as Block[]).map((b) => {
    if (b.blockType !== 'linkBoxes') return b
    const items = (b.items as Block[] | undefined) ?? []
    return {
      ...b,
      heading: 'Useful links',
      items: items.map((it, i) => ({ ...it, title: boxes[i]?.en[0] ?? it.title, text: boxes[i]?.en[1] ?? it.text })),
    }
  })
  await payload.updateGlobal({ slug: 'home', locale: 'en', data: { layout: enLayout } as never, depth: 0, req })
  payload.logger.info('Početna strana je preuređena po uzoru na Key Automation.')
}
