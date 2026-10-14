/**
 * Product import from Excel (+ optional ZIP with images).
 * Used by the "Uvoz proizvoda" admin page and by the seed script.
 *
 * Expected columns (header names are matched loosely, order does not matter):
 *   Šifra | Naziv | Kategorija | Podkategorija | Slika
 * Optional: Opis, Cena, Proizvođač. Other columns (e.g. EAN) are ignored.
 */
import { unzipSync } from 'fflate'
import type { Payload } from 'payload'
import sharp from 'sharp'
import { slugify } from '../fields/slug'
import { readXlsx } from './xlsxRead'

export type ImportRow = {
  code: string
  name: string
  category?: string
  subcategory?: string
  image?: string
  description?: string
  price?: number
  brand?: string
}

export type CategoryMode = 'file' | 'fixed' | 'none'

export type ImportOptions = {
  categoryMode: CategoryMode
  /** Used when categoryMode = 'fixed'. */
  categoryId?: number
  /** Update products that already exist (matched by code). Otherwise they are skipped. */
  updateExisting: boolean
  /** When updating, keep the category the product already has. */
  keepCategory?: boolean
}

export type ImportResult = {
  created: number
  updated: number
  skipped: number
  imagesAdded: number
  categoriesCreated: string[]
  missingImages: string[]
  errors: string[]
}

/* ---------- Key Automation category names → Serbian / English ---------- */

type Names = { sr: string; en: string; order?: number }

const MAIN: Record<string, Names> = {
  'gates and road barriers': { sr: 'Kapije i rampe', en: 'Gates and road barriers', order: 1 },
  'sectional and overhead doors': { sr: 'Garažna vrata', en: 'Sectional and overhead doors', order: 2 },
  accessories: { sr: 'Dodatna oprema', en: 'Accessories', order: 3 },
  'outdoor led lighting': { sr: 'Spoljna LED rasveta', en: 'Outdoor LED lighting', order: 4 },
  'pedestrian doors': { sr: 'Pešačka vrata', en: 'Pedestrian doors', order: 5 },
  outdoor: { sr: 'Spoljno uređenje', en: 'Outdoor', order: 6 },
  'spare parts': { sr: 'Rezervni delovi', en: 'Spare parts', order: 7 },
}

const SUB: Record<string, Names> = {
  'sliding gates': { sr: 'Motori za klizne kapije', en: 'Sliding gate motors', order: 1 },
  'linear motors': { sr: 'Linearni motori za krilne kapije', en: 'Linear motors for swing gates', order: 2 },
  'articulated arms': { sr: 'Zglobni motori za krilne kapije', en: 'Articulated arm motors', order: 3 },
  'underground motors': { sr: 'Podzemni motori za krilne kapije', en: 'Underground motors', order: 4 },
  'road barriers': { sr: 'Parking rampe', en: 'Road barriers', order: 5 },
  'sectional doors': { sr: 'Motori za sekcijska vrata', en: 'Sectional door motors', order: 1 },
  'overhead doors': { sr: 'Motori za podizna vrata', en: 'Overhead door motors', order: 2 },
  'control units': { sr: 'Upravljačke jedinice', en: 'Control units', order: 1 },
  transmitters: { sr: 'Daljinski upravljači', en: 'Remote controls', order: 2 },
  receivers: { sr: 'Prijemnici', en: 'Receivers', order: 3 },
  photocells: { sr: 'Fotoćelije', en: 'Photocells', order: 4 },
  'flashing lights': { sr: 'Trepćuća svetla', en: 'Flashing lights', order: 5 },
  'keypads and selectors': { sr: 'Šifratori i selektori', en: 'Keypads and selectors', order: 6 },
  batteries: { sr: 'Baterije', en: 'Batteries', order: 7 },
  iot: { sr: 'Pametno upravljanje (IoT)', en: 'Smart control (IoT)', order: 8 },
  'garden lights': { sr: 'Baštenska svetla', en: 'Garden lights', order: 1 },
}

/** Subcategory names that repeat a main category get a clearer Serbian name. */
const SUB_IN_MAIN: Record<string, Names> = {
  'accessories|sliding gates': { sr: 'Oprema za klizne kapije', en: 'Sliding gate accessories', order: 9 },
  'accessories|accessories': { sr: 'Ostala oprema', en: 'Other accessories', order: 10 },
}

const key = (s?: string) => (s ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

export function categoryNames(main?: string, sub?: string): { main: Names | null; sub: Names | null } {
  const m = key(main)
  const s = key(sub)
  const mainNames = m ? MAIN[m] ?? { sr: title(m), en: title(m) } : null
  let subNames: Names | null = null
  if (s && s !== m) subNames = SUB_IN_MAIN[`${m}|${s}`] ?? SUB[s] ?? { sr: title(s), en: title(s) }
  else if (s && s === m) subNames = SUB_IN_MAIN[`${m}|${s}`] ?? null
  return { main: mainNames, sub: subNames }
}

/* ---------- Excel parsing ---------- */

const norm = (s: unknown) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'dj')
    .replace(/[^a-z0-9]/g, '')

const HEADERS: Record<keyof ImportRow, string[]> = {
  code: ['sifra', 'code', 'sku', 'model', 'artikal', 'kod'],
  name: ['naziv', 'name', 'title', 'nazivartikla'],
  category: ['kategorija', 'category'],
  subcategory: ['podkategorija', 'potkategorija', 'subcategory'],
  image: ['slika', 'image', 'foto', 'fotografija', 'picture'],
  description: ['opis', 'description', 'detaljanopis'],
  price: ['cena', 'price', 'mpc', 'cenarsd'],
  brand: ['proizvodjac', 'brand', 'marka'],
}

export async function parseWorkbook(buffer: Buffer | ArrayBuffer): Promise<ImportRow[]> {
  let sheets: ReturnType<typeof readXlsx>
  try {
    sheets = readXlsx(buffer)
  } catch {
    throw new Error('Fajl nije ispravan Excel (.xlsx). Sačuvajte ga ponovo kao .xlsx i pokušajte opet.')
  }
  // Use the first sheet that has a code and a name column.
  for (const sheet of sheets) {
    let headerIndex = -1
    const cols: Partial<Record<keyof ImportRow, number>> = {}
    for (let r = 0; r < Math.min(sheet.rows.length, 10) && headerIndex < 0; r++) {
      const found: Partial<Record<keyof ImportRow, number>> = {}
      sheet.rows[r].forEach((cell, col) => {
        const h = norm(cell)
        for (const [field, names] of Object.entries(HEADERS) as [keyof ImportRow, string[]][]) {
          if (found[field] == null && names.includes(h)) found[field] = col
        }
      })
      if (found.code != null && found.name != null) {
        headerIndex = r
        Object.assign(cols, found)
      }
    }
    if (headerIndex < 0) continue

    const rows: ImportRow[] = []
    for (const row of sheet.rows.slice(headerIndex + 1)) {
      const get = (f: keyof ImportRow) => (cols[f] != null ? String(row[cols[f]!] ?? '').trim() : '')
      const code = get('code')
      const name = get('name')
      if (!code || !name) continue
      const priceRaw = get('price').replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.')
      rows.push({
        code,
        name,
        category: get('category') || undefined,
        subcategory: get('subcategory') || undefined,
        image: get('image') || undefined,
        description: get('description') || undefined,
        price: priceRaw ? Number(priceRaw) || undefined : undefined,
        brand: get('brand') || undefined,
      })
    }
    return rows
  }
  throw new Error('U fajlu nije pronađena tabela sa kolonama „Šifra” i „Naziv”.')
}

export function readZipImages(buffer: Buffer | ArrayBuffer): Map<string, Buffer> {
  const files = unzipSync(new Uint8Array(buffer as ArrayBuffer))
  const out = new Map<string, Buffer>()
  for (const [path, data] of Object.entries(files)) {
    if (!data.length || path.startsWith('__MACOSX')) continue
    const name = path.split('/').pop()!
    if (/\.(jpe?g|png|webp|gif|avif)$/i.test(name)) out.set(name.toLowerCase(), Buffer.from(data))
  }
  return out
}

/* ---------- text helpers ---------- */

/** "Komplet za krilne kapije do 3 m, 24 Vdc, … Sadrži: …" → "Komplet za krilne kapije do 3 m" */
export function shortName(name: string): string {
  const first = name.split(/(?<!\d),(?!\d)|\.\s|\.$|;/)[0].trim()
  return first.length > 70 ? first.slice(0, 67).replace(/\s+\S*$/, '') + '…' : first
}

/** Feature clauses and kit contents from the long Key Automation description. */
export function splitDescription(name: string): { features: string[]; contents: string[] } {
  const [main, kit] = name.split(/Sadrži:|Sadrzi:|Contains:|Includes:/i)
  // Split on ", " and ". " – decimal commas ("2,3 m") have no space after them.
  const clauses = main
    .split(/,\s+|\.\s/)
    .map((s) => s.replace(/\.$/, '').trim())
    .filter(Boolean)
  const features = clauses.slice(1).map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  const contents = kit
    ? kit
        .split(',')
        .map((s) => s.replace(/\.$/, '').trim())
        .filter(Boolean)
    : []
  return { features, contents }
}

export function lexical(paragraphs: string[], list: string[] = [], listTitle?: string) {
  const text = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
  const p = (t: string) => ({ type: 'paragraph', children: [text(t)], direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1 })
  const children: unknown[] = paragraphs.map(p)
  if (list.length) {
    if (listTitle) children.push({ type: 'heading', tag: 'h3', children: [text(listTitle)], direction: 'ltr', format: '', indent: 0, version: 1 })
    children.push({
      type: 'list',
      listType: 'bullet',
      tag: 'ul',
      start: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: list.map((t, i) => ({ type: 'listitem', value: i + 1, children: [text(t)], direction: 'ltr', format: '', indent: 0, version: 1 })),
    })
  }
  return { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } }
}

/* ---------- import ---------- */

async function ensureCategory(
  payload: Payload,
  names: Names,
  parentId: number | null,
  cache: Map<string, number>,
  created: string[],
  extra: Record<string, unknown> = {},
): Promise<number> {
  const cacheKey = `${parentId ?? 0}|${names.sr}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)!
  const found = await payload.find({
    collection: 'product-categories',
    locale: 'sr',
    depth: 0,
    limit: 1,
    where: { and: [{ title: { equals: names.sr } }, parentId ? { parent: { equals: parentId } } : { parent: { exists: false } }] },
  })
  let id = found.docs[0]?.id as number | undefined
  if (!id) {
    const slugBase = slugify(names.sr)
    const doc = await payload.create({
      collection: 'product-categories',
      locale: 'sr',
      data: { title: names.sr, slug: slugBase, parent: parentId ?? undefined, order: names.order ?? 50, showInMenu: true, ...extra },
    })
    await payload.update({
      collection: 'product-categories',
      id: doc.id,
      locale: 'en',
      data: { title: names.en, slug: slugify(names.en) },
    })
    id = doc.id as number
    created.push(parentId ? `↳ ${names.sr}` : names.sr)
  }
  cache.set(cacheKey, id)
  return id
}

async function uploadImage(payload: Payload, file: Buffer, filename: string, alt: string): Promise<number> {
  const name = filename.split(/[\\/]/).pop()!.replace(/\.[a-z0-9]+$/i, '') + '.webp'
  // A picture with the same file name is reused instead of stored twice
  // (to replace a product photo, change it on the product in the CMS).
  const existing = await payload.find({ collection: 'media', depth: 0, limit: 1, where: { filename: { equals: name } } })
  if (existing.docs[0]) return existing.docs[0].id as number
  // Product photos are small packshots: store as high quality WebP, never upscaled.
  const data = await sharp(file).rotate().webp({ quality: 90 }).toBuffer()
  const doc = await payload.create({
    collection: 'media',
    locale: 'sr',
    data: { alt },
    file: { data, mimetype: 'image/webp', name, size: data.length },
  })
  return doc.id as number
}

export async function importProducts(
  payload: Payload,
  rows: ImportRow[],
  images: Map<string, Buffer>,
  opts: ImportOptions,
): Promise<ImportResult> {
  const result: ImportResult = { created: 0, updated: 0, skipped: 0, imagesAdded: 0, categoriesCreated: [], missingImages: [], errors: [] }
  const catCache = new Map<string, number>()
  const firstImageOfCategory = new Map<number, number>()
  const parentOf = new Map<number, number>()

  for (const [i, row] of rows.entries()) {
    try {
      const existing = await payload.find({
        collection: 'products',
        locale: 'sr',
        depth: 0,
        limit: 1,
        where: { code: { equals: row.code } },
      })
      const current = existing.docs[0]
      if (current && !opts.updateExisting) {
        result.skipped++
        continue
      }

      // Category
      let categoryId: number | undefined
      if (current && opts.keepCategory && current.category) {
        categoryId = typeof current.category === 'object' ? current.category.id : current.category
      } else if (opts.categoryMode === 'fixed' && opts.categoryId) {
        categoryId = opts.categoryId
      } else if (opts.categoryMode === 'file' && (row.category || row.subcategory)) {
        const names = categoryNames(row.category, row.subcategory)
        const mainId = names.main ? await ensureCategory(payload, names.main, null, catCache, result.categoriesCreated) : null
        categoryId = names.sub
          ? await ensureCategory(payload, names.sub, mainId, catCache, result.categoriesCreated, { imageFit: 'contain' })
          : (mainId ?? undefined)
        if (mainId) parentOf.set(categoryId!, mainId)
      }
      if (!categoryId) {
        categoryId = await ensureCategory(
          payload,
          { sr: 'Nerazvrstano', en: 'Unsorted', order: 99 },
          null,
          catCache,
          result.categoriesCreated,
          { showInMenu: false },
        )
      }

      // Image
      let imageId: number | undefined
      if (row.image) {
        const file = images.get(row.image.toLowerCase()) ?? images.get(row.image.split(/[\\/]/).pop()!.toLowerCase())
        if (file) {
          imageId = await uploadImage(payload, file, row.image, `${row.code} – ${shortName(row.name)}`)
          result.imagesAdded++
        } else if (images.size) {
          result.missingImages.push(row.image)
        }
      } else if (images.size) {
        const guess = [...images.keys()].find((k) => k.replace(/\.[a-z0-9]+$/, '') === row.code.toLowerCase())
        if (guess) {
          imageId = await uploadImage(payload, images.get(guess)!, guess, `${row.code} – ${shortName(row.name)}`)
          result.imagesAdded++
        }
      }
      if (imageId && !firstImageOfCategory.has(categoryId)) firstImageOfCategory.set(categoryId, imageId)
      const parentId = parentOf.get(categoryId)
      if (imageId && parentId && !firstImageOfCategory.has(parentId)) firstImageOfCategory.set(parentId, imageId)

      const short = shortName(row.name)
      const { features, contents } = splitDescription(row.name)
      const titleSr = `${row.code} – ${short}`
      const specs = [
        { label: 'Šifra', value: row.code },
        ...(contents.length ? [{ label: 'Sadržaj kompleta', value: contents.join(', ') }] : []),
      ]
      const data: Record<string, unknown> = {
        title: titleSr,
        code: row.code,
        excerpt: row.name.slice(0, 300),
        highlights: features.slice(0, 8).map((text) => ({ text })),
        description: lexical(row.description ? [row.description, row.name] : [row.name], contents, contents.length ? 'Sadržaj kompleta' : undefined),
        specs,
        category: categoryId,
        brand: row.brand || 'Key Automation',
        order: i,
      }
      if (row.price) data.price = row.price
      if (imageId) data.images = [imageId]

      if (current) {
        const currentImages = ((current.images ?? []) as (number | { id: number })[]).map((x) => (typeof x === 'object' ? x.id : x))
        if (!imageId || currentImages[0] === imageId) delete data.images
        else data.images = [imageId, ...currentImages.filter((x) => x !== imageId)]
        await payload.update({ collection: 'products', id: current.id, locale: 'sr', data })
        result.updated++
      } else {
        if (!imageId) {
          result.errors.push(`${row.code}: nema slike – proizvod je preskočen (slika je obavezna).`)
          result.skipped++
          continue
        }
        const doc = await payload.create({ collection: 'products', locale: 'sr', data: { ...data, slug: slugify(row.code) } as never })
        // English: same address and code; texts fall back to Serbian until translated in the CMS.
        await payload.update({
          collection: 'products',
          id: doc.id,
          locale: 'en',
          data: {
            title: titleSr,
            slug: slugify(row.code),
            specs: specs.map((s, n) => ({ ...s, id: (doc.specs as { id?: string }[] | undefined)?.[n]?.id, label: s.label === 'Šifra' ? 'Code' : 'Kit contents' })),
            // Required per language; Serbian text until it is translated in the CMS.
            highlights: ((doc.highlights as { id?: string; text?: string }[] | undefined) ?? []).map((h) => ({ id: h.id, text: h.text })),
          } as never,
        })
        result.created++
      }
    } catch (err) {
      result.errors.push(`${row.code}: ${(err as Error).message}`)
    }
  }

  // Give new categories without a picture the first product photo.
  for (const [catId, imageId] of firstImageOfCategory) {
    const cat = await payload.findByID({ collection: 'product-categories', id: catId, depth: 0 }).catch(() => null)
    if (cat && !cat.image) await payload.update({ collection: 'product-categories', id: catId, data: { image: imageId, imageFit: 'contain' } })
  }
  return result
}
