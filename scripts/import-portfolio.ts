/**
 * Copies the photos and videos from the old portfolio page (parkingrampe.rs/portfolio)
 * into the CMS and shows them in a "Gallery" section on the Portfolio page.
 *
 * Run once on the server, while the old WordPress site is still online:
 *   npm run import:portfolio
 * Running it again skips files that are already imported.
 */
import 'dotenv/config'
import path from 'node:path'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'
import config from '../src/payload.config'

const BASE = (process.env.PORTFOLIO_SOURCE || 'https://parkingrampe.rs/wp-content/uploads').replace(/\/$/, '')

const PHOTOS = [
  '2024/11/IMG_1598-scaled.webp', '2024/11/IMG_2301-scaled.webp', '2024/04/ALT-9.jpeg', '2024/04/ECLIPSE-RAY-2.jpeg',
  '2024/04/8logo-scaled.jpg', '2024/04/RAY-NLS.jpeg', '2024/04/14logo-scaled.jpg', '2024/11/IMG_2309-scaled.webp',
  '2024/04/RAY-WHITE-2-1.jpeg', '2024/04/1logo-scaled.jpg', '2024/04/4log-scaled-jpg.webp', '2024/04/9logo-scaled-jpg.webp',
  '2024/04/15logo-scaled.jpg', '2024/11/IMG_2202-scaled.webp', '2024/04/RAY-WHITE-2.jpeg', '2024/11/IMG_2297-scaled.webp',
  '2024/04/16logo-scaled.jpg', '2024/04/31ECF9BB-1D8E-4616-8E41-23FB33B7D677.jpg', '2024/04/ALT-16.jpg', '2024/04/ALT.jpg',
  '2024/04/C7F769B6-4C53-49A0-B571-FAF482FF0906.jpg', '2024/04/f2a95951-b0b5-46e3-b5e3-60d09af14c84.jpg',
  '2024/04/IMG_4613-scaled.jpg', '2024/04/IMG_4678-scaled.jpg', '2024/04/IMG_4679-scaled.jpg', '2024/04/IMG_4833-scaled.jpg',
  '2024/04/IMG_4834-scaled-jpg.webp', '2024/04/IMG_4838-scaled.jpg', '2024/04/IMG_5007-scaled.jpg', '2024/04/IMG_6793-scaled.jpg',
  '2024/04/IMG_6904-scaled.jpg', '2024/04/IMG_7475-scaled.jpg', '2024/04/IMG_7891-scaled-jpg.webp', '2024/04/IMG_7892-scaled.jpg',
  '2024/04/IMG_8253.jpg', '2024/04/IMG_8256.jpg', '2024/04/IMG_8294-scaled.jpg', '2024/04/IMG_8296-scaled.jpg',
  '2024/04/IMG_8408-scaled.jpg', '2024/04/IMG_8409-scaled.jpg', '2024/04/IMG_9218-scaled.jpg', '2024/04/IMG_9219-scaled.jpg',
  '2024/04/IMG_9220-scaled.jpg', '2024/04/IMG_4967.png', '2024/11/IMG_2324-scaled.webp',
]

const VIDEOS = [
  '2024/04/IMG_4835mp4.mp4',
  '2024/04/export_1712767790968.mov',
  '2024/04/IMG_7472mp4.mp4',
  '2024/04/IMG_2577mp4.mp4',
]

const ALT = { sr: 'Ugradnja KGB Automation', en: 'KGB Automation installation' }
const HEADING = { sr: 'Fotografije i video sa terena', en: 'Photos and videos from our sites' }

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, { signal: AbortSignal.timeout(180_000) })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return Buffer.from(await res.arrayBuffer())
}

async function findByName(payload: Payload, name: string) {
  const res = await payload.find({ collection: 'media', depth: 0, limit: 1, where: { filename: { equals: name } } })
  return res.docs[0]?.id as number | undefined
}

async function importPhoto(payload: Payload, file: string, i: number) {
  const name = `portfolio-${path.basename(file).replace(/\.[a-z0-9]+$/i, '')}.webp`
  const existing = await findByName(payload, name)
  if (existing) return existing
  const original = await download(`${BASE}/${file}`)
  // Phone photos are large: rotate by EXIF, cap at 2400 px and store as WebP.
  const data = await sharp(original).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84 }).toBuffer()
  const doc = await payload.create({
    collection: 'media',
    locale: 'sr',
    data: { alt: `${ALT.sr} ${i + 1}` },
    file: { data, mimetype: 'image/webp', name, size: data.length },
  })
  await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: `${ALT.en} ${i + 1}` } })
  return doc.id as number
}

async function importVideo(payload: Payload, file: string, i: number) {
  const ext = path.extname(file).toLowerCase()
  const name = `portfolio-${path.basename(file, ext)}${ext}`
  const existing = await findByName(payload, name)
  if (existing) return existing
  const data = await download(`${BASE}/${file}`)
  const mimetype = ext === '.mov' ? 'video/quicktime' : 'video/mp4'
  const doc = await payload.create({
    collection: 'media',
    locale: 'sr',
    data: { alt: `Video – ${ALT.sr} ${i + 1}` },
    file: { data, mimetype, name, size: data.length },
  })
  await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: `Video – ${ALT.en} ${i + 1}` } })
  return doc.id as number
}

async function collect(payload: Payload, files: string[], fn: typeof importPhoto, kind: string) {
  const ids: number[] = []
  for (const [i, file] of files.entries()) {
    try {
      ids.push(await fn(payload, file, i))
      console.log(`  ✓ ${kind} ${i + 1}/${files.length}  ${path.basename(file)}`)
    } catch (err) {
      console.log(`  ✗ ${kind} ${path.basename(file)}: ${(err as Error).message}`)
    }
  }
  return ids
}

type Block = { id?: string | null; blockType: string; [k: string]: unknown }

async function main() {
  const payload = await getPayload({ config })
  const pages = await payload.find({ collection: 'pages', depth: 0, limit: 1, where: { template: { equals: 'portfolio' } } })
  const page = pages.docs[0]
  if (!page) {
    console.log('Stranica Portfolio nije pronađena (šablon „Portfolio“).')
    process.exit(1)
  }

  console.log(`Preuzimam sa ${BASE} …`)
  const images = await collect(payload, PHOTOS, importPhoto, 'slika')
  const videos = await collect(payload, VIDEOS, importVideo, 'video')
  if (!images.length && !videos.length) {
    console.log('Ništa nije preuzeto. Proverite da li je stari sajt još dostupan.')
    process.exit(1)
  }

  // Add the gallery to the Portfolio page, or refresh it if it is already there.
  const layout = ((page.layout ?? []) as Block[]).filter((b) => b.blockType !== 'mediaGallery' || b.heading !== HEADING.sr)
  const saved = await payload.update({
    collection: 'pages',
    id: page.id,
    locale: 'sr',
    depth: 0,
    data: { layout: [...layout, { blockType: 'mediaGallery', heading: HEADING.sr, images, videos }] } as never,
  })
  const en = ((saved.layout ?? []) as Block[]).map((b) =>
    b.blockType === 'mediaGallery' && b.heading === HEADING.sr ? { ...b, heading: HEADING.en } : b,
  )
  await payload.update({ collection: 'pages', id: page.id, locale: 'en', depth: 0, data: { layout: en } as never })

  console.log(`Gotovo: ${images.length} fotografija i ${videos.length} video snimaka na stranici Portfolio.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
