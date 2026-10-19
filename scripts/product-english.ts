/**
 * English texts for the Key Automation products: name, short text, key features,
 * full description and SEO title/description, from scripts/catalog/prevodi-en.json
 * (one English description per product code, Key Automation wording).
 * Serbian texts are not touched.
 *
 * Run on the server:   npm run products:english
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { lexical, shortName, splitDescription } from '../src/lib/catalogImport'

async function run() {
  const en: Record<string, string> = JSON.parse(fs.readFileSync(path.resolve('scripts/catalog/prevodi-en.json'), 'utf8'))
  const byCode = new Map(Object.entries(en).map(([k, v]) => [k.toUpperCase(), v]))
  const payload = await getPayload({ config })
  const products = await payload.find({ collection: 'products', locale: 'en', fallbackLocale: false, depth: 0, limit: 1000, pagination: false })
  let done = 0, missing = 0
  for (const p of products.docs) {
    const text = p.code ? byCode.get(p.code.trim().toUpperCase()) : undefined
    if (!text) { missing++; continue }
    const { features, contents } = splitDescription(text)
    // Feature rows are shared by both languages. Rebuild them from the Serbian text with the same
    // split, so that row N is the same feature in both languages.
    const sr = await payload.findByID({ collection: 'products', id: p.id, locale: 'sr', depth: 0 })
    const srFeatures = splitDescription(sr.excerpt || '').features
    let highlights: { id?: string; text: string }[]
    if (srFeatures.length === features.length && features.length) {
      const saved = await payload.update({ collection: 'products', id: p.id, locale: 'sr', data: { highlights: srFeatures.slice(0, 8).map((t) => ({ text: t })) } })
      highlights = ((saved.highlights ?? []) as { id?: string }[]).map((h, i) => ({ id: h.id, text: features[i] }))
    } else {
      highlights = ((p.highlights ?? []) as { id?: string; text?: string }[]).map((h, i) => ({ id: h.id, text: features[i] ?? h.text ?? '' }))
    }
    const titleEn = `${p.code} – ${shortName(text)}`
    // English alt text for the product photos (the Serbian one stays for the Serbian pages).
    for (const img of (p.images ?? []) as (number | { id: number })[]) {
      const id = typeof img === 'object' ? img.id : img
      await payload.update({ collection: 'media', id, locale: 'en', data: { alt: titleEn } }).catch(() => {})
    }
    await payload.update({
      collection: 'products',
      id: p.id,
      locale: 'en',
      data: {
        title: titleEn,
        excerpt: text.slice(0, 300),
        highlights,
        description: lexical([text], contents, contents.length ? 'Kit contents' : undefined) as never,
        // Empty values are filled again from the English name and text (see the Products hook).
        meta: { ...(p.meta ?? {}), title: '', description: '' },
      },
    })
    done++
  }
  console.log(`Gotovo: engleski tekstovi upisani za ${done} proizvoda, bez prevoda ${missing}.`)
  process.exit(0)
}

void run()
