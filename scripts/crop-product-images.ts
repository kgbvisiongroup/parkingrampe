/**
 * Makes the product photos look bigger and sharper.
 * The imported Key Automation photos are small (about 324×241) and the product fills only a
 * fraction of them; some also carry a red "NEW" badge in the corner. For every product image this:
 *   1. removes the red "NEW" badge in the top-right corner,
 *   2. crops the white border around the product,
 *   3. centres the product on a white 5:4 canvas (up to 1000×800) with a small margin,
 *      enlarged with a high-quality filter and lightly sharpened,
 *   4. saves it as WebP and replaces the file in the CMS (all sizes are regenerated).
 *
 * Run on the server:   npm run images:products
 * Running it again skips images that were already processed (file name ends with "-hd").
 *
 * Better photos (e.g. downloaded from keyautomation.com) can be imported from a folder; each file
 * must be named after the product code, e.g. KRAY2524EK.jpg:
 *   npm run images:products -- /putanja/do/foldera
 */
import 'dotenv/config'
import path from 'node:path'
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '../src/payload.config'

const MAX_W = 1000
const MAX_H = 800
const MARGIN = 0.07 // empty space around the product, as a share of the canvas
const MAX_UPSCALE = 3

/** Paints the red "NEW" badge (a red circle in the top-right corner) white. */
function removeBadge(px: Buffer, w: number, h: number, ch: number) {
  const x0 = Math.floor(w * 0.72)
  const y1 = Math.ceil(h * 0.3)
  let minX = w, minY = h, maxX = -1, maxY = -1, n = 0
  for (let y = 0; y < y1; y++)
    for (let x = x0; x < w; x++) {
      const i = (y * w + x) * ch
      const [r, g, b] = [px[i], px[i + 1], px[i + 2]]
      if (r > 170 && g < 90 && b < 90) {
        n++
        minX = Math.min(minX, x); maxX = Math.max(maxX, x)
        minY = Math.min(minY, y); maxY = Math.max(maxY, y)
      }
    }
  if (n < 30) return false
  const bw = maxX - minX + 1
  const bh = maxY - minY + 1
  // Only a small, round-ish red spot is a badge; a red product would be larger or not round.
  if (bw > w * 0.2 || bh > h * 0.25 || Math.abs(bw - bh) > Math.max(bw, bh) * 0.35 || n < bw * bh * 0.5) return false
  const pad = 3
  for (let y = Math.max(0, minY - pad); y <= Math.min(h - 1, maxY + pad); y++)
    for (let x = Math.max(0, minX - pad); x <= Math.min(w - 1, maxX + pad); x++) {
      const i = (y * w + x) * ch
      px[i] = px[i + 1] = px[i + 2] = 255
      if (ch === 4) px[i + 3] = 255
    }
  return true
}

/** True when the picture is a studio shot on white: almost all pixels along the edges are white. */
function hasWhiteBackground(px: Buffer, w: number, h: number, ch: number) {
  let white = 0, total = 0
  const check = (x: number, y: number) => {
    const i = (y * w + x) * ch
    total++
    if (px[i] > 235 && px[i + 1] > 235 && px[i + 2] > 235) white++
  }
  for (let x = 0; x < w; x++) { check(x, 0); check(x, h - 1) }
  for (let y = 0; y < h; y++) { check(0, y); check(w - 1, y) }
  return white / total > 0.9
}

export async function enhanceProductPhoto(input: Buffer) {
  const { data, info } = await sharp(input).flatten({ background: '#ffffff' }).raw().toBuffer({ resolveWithObject: true })
  // Real photos (a gate on site, people…) are left as they are.
  if (!hasWhiteBackground(data, info.width, info.height, info.channels)) return null
  const badge = removeBadge(data, info.width, info.height, info.channels)
  const cleaned = sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  const trimmed = await cleaned
    .trim({ background: '#ffffff', threshold: 25 })
    .png()
    .toBuffer({ resolveWithObject: true })
    .catch(() => null) // a completely white image cannot be trimmed
  if (!trimmed) return null

  const cw = trimmed.info.width
  const chh = trimmed.info.height
  const boxW = MAX_W * (1 - 2 * MARGIN)
  const boxH = MAX_H * (1 - 2 * MARGIN)
  const scale = Math.min(boxW / cw, boxH / chh, MAX_UPSCALE)
  const w = Math.round(cw * scale)
  const h = Math.round(chh * scale)
  // Canvas keeps the 5:4 shape of the product cards, sized to the product (never bigger than 1000×800).
  const canvasW = Math.min(MAX_W, Math.round(Math.max(w / (1 - 2 * MARGIN), (h / (1 - 2 * MARGIN)) * 1.25)))
  const canvasH = Math.round(canvasW / 1.25)

  const product = await sharp(trimmed.data).resize(w, h, { kernel: 'lanczos3' }).sharpen({ sigma: 0.8 }).toBuffer()
  const out = await sharp({ create: { width: canvasW, height: canvasH, channels: 3, background: '#ffffff' } })
    .composite([{ input: product, left: Math.round((canvasW - w) / 2), top: Math.round((canvasH - h) / 2) }])
    .webp({ quality: 90 })
    .toBuffer()
  return { out, badge, width: canvasW, height: canvasH }
}

/** Folder mode: replaces each product's main photo with a better one named after its code (e.g. KRAY2524EK.jpg). */
async function importFolder(dir: string) {
  const fs = await import('node:fs')
  const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const files = new Map<string, string>()
  for (const f of fs.readdirSync(dir)) if (/\.(jpe?g|png|webp|avif|tiff?)$/i.test(f)) files.set(norm(f.replace(/\.[^.]+$/, '')), path.join(dir, f))
  console.log(`U folderu ${dir}: ${files.size} slika.`)

  const payload = await getPayload({ config })
  const products = await payload.find({ collection: 'products', depth: 0, limit: 1000, pagination: false })
  let done = 0, missing = 0
  for (const p of products.docs) {
    const file = p.code ? files.get(norm(p.code)) : undefined
    if (!file) { missing++; continue }
    const input = await sharp(file).toBuffer()
    const res = await enhanceProductPhoto(input)
    // Photos without a white background are only resized and converted.
    const out = res?.out ?? (await sharp(input).resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toBuffer())
    const name = `${norm(p.code!)}-hd.webp`
    const first = (p.images ?? [])[0] as number | { id: number } | undefined
    const firstId = typeof first === 'object' ? first?.id : first
    const upload = { data: out, mimetype: 'image/webp', name, size: out.length }
    if (firstId) await payload.update({ collection: 'media', id: firstId, data: {}, file: upload })
    else {
      const m = await payload.create({ collection: 'media', data: { alt: p.title }, file: upload })
      await payload.update({ collection: 'products', id: p.id, data: { images: [m.id] } })
    }
    done++
    console.log(`✓ ${p.code} ← ${path.basename(file)}`)
  }
  console.log(`\nGotovo: zamenjeno ${done} slika, ${missing} proizvoda nema sliku u folderu.`)
  process.exit(0)
}

async function run() {
  const folder = process.argv[2]
  if (folder) return importFolder(path.resolve(folder))
  const payload = await getPayload({ config })
  const products = await payload.find({ collection: 'products', depth: 0, limit: 1000, pagination: false })
  const ids = new Set<number>()
  for (const p of products.docs) for (const img of (p.images ?? []) as (number | { id: number })[]) ids.add(typeof img === 'object' ? img.id : img)

  const staticDir = path.resolve(process.cwd(), 'media')
  let done = 0, skipped = 0, failed = 0, badges = 0
  for (const id of ids) {
    const media = await payload.findByID({ collection: 'media', id, depth: 0 }).catch(() => null)
    if (!media?.filename || !media.mimeType?.startsWith('image/')) continue
    const base = media.filename.replace(/\.[^.]+$/, '')
    if (base.endsWith('-hd')) { skipped++; continue }
    try {
      const res = await enhanceProductPhoto(await sharp(path.join(staticDir, media.filename)).toBuffer())
      if (!res) { skipped++; continue }
      const name = `${base}-hd.webp`
      await payload.update({
        collection: 'media',
        id,
        data: {},
        file: { data: res.out, mimetype: 'image/webp', name, size: res.out.length },
      })
      if (res.badge) badges++
      done++
      console.log(`✓ ${media.filename} → ${name} (${res.width}×${res.height})${res.badge ? ', uklonjen NEW' : ''}`)
    } catch (e) {
      failed++
      console.warn(`✗ ${media.filename}: ${(e as Error).message}`)
    }
  }
  console.log(`\nGotovo: obrađeno ${done}, preskočeno ${skipped}, greške ${failed}, uklonjenih oznaka NEW ${badges}.`)
  process.exit(0)
}

if (process.argv[1]?.includes('crop-product-images')) void run()
