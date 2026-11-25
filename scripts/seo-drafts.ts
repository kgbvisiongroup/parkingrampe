/**
 * Puts an approved text draft from /content-drafts into the CMS.
 *
 *   npm run seo:drafts -- content-drafts/<file>.md            – shows what would be written, changes nothing
 *   npm run seo:drafts -- content-drafts/<file>.md --apply    – writes fields that are still empty
 *   npm run seo:drafts -- content-drafts/<file>.md --apply --force   – also replaces fields that already have text
 *
 * Sections are "## Name {field}": intro/content/guide (rich text), priceTable (Markdown table), faq (**question** + answer).
 * "{PRICE}" leaves the price empty (shown as "Cena na upit"); [PROVERITI: …] notes must be removed before --apply.
 */
import 'dotenv/config'
import fs from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { markdownToLexical } from '../src/lib/markdownToLexical'

const args = process.argv.slice(2)
const file = args.find((a) => a.endsWith('.md'))
const apply = args.includes('--apply')
const force = args.includes('--force')
if (!file || !fs.existsSync(file)) {
  console.error('Navedite fajl, npr.: npm run seo:drafts -- content-drafts/usluge-automatske-rampe.md')
  process.exit(1)
}

const src = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '')
const front = Object.fromEntries(
  (src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '').split('\n').map((l) => l.split(/:\s*/, 2)).filter((p) => p.length === 2),
) as Record<string, string>
const collection = front.collection as 'services' | 'product-categories'
const locale = (front.locale || 'sr') as 'sr' | 'en'

const sections: Record<string, string> = {}
for (const m of src.matchAll(/^## .*?\{(\w+)\}\s*$([\s\S]*?)(?=^## |(?![\s\S]))/gm)) sections[m[1]] = m[2].trim()

const num = (s: string) => {
  const d = s.replace(/[^\d]/g, '')
  return d && !/\{PRICE\}/.test(s) ? Number(d) : null
}

function priceTable(md: string) {
  return md
    .split('\n')
    .filter((l) => l.trim().startsWith('|') && !/^\|\s*-/.test(l.trim()))
    .slice(1) // header row
    .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
    .map(([item, from = '', to = '', note = '']) => ({ item, priceFrom: num(from), priceTo: num(to), note: note || null }))
}

function faq(md: string) {
  return [...md.matchAll(/\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*|$)/g)].map((m) => ({ question: m[1].trim(), answer: m[2].trim().replace(/\s*\n\s*/g, ' ') }))
}

async function run() {
  const unchecked = src.match(/\[PROVERITI[^\]]*\]/g) ?? []
  const payload = await getPayload({ config })
  const res = await payload.find({ collection, locale, where: { slug: { equals: front.slug } }, depth: 0, limit: 1 })
  const doc = res.docs[0] as Record<string, unknown> & { id: number; title: string }
  if (!doc) throw new Error(`Strana ${collection}/${front.slug} ne postoji.`)

  const data: Record<string, unknown> = {}
  const isEmpty = (v: unknown) => v == null || (Array.isArray(v) && !v.length) || (typeof v === 'object' && !((v as { root?: { children?: unknown[] } }).root?.children?.length))
  const put = (field: string, value: unknown, label: string) => {
    if (!isEmpty(doc[field]) && !force) return console.log(`= ${label}: već popunjeno – preskačem (--force za zamenu)`)
    data[field] = value
    console.log(`+ ${label}`)
  }

  console.log(`${doc.title} (${collection}/${front.slug}, ${locale})`)
  for (const [field, md] of Object.entries(sections)) {
    if (field === 'priceTable') {
      const rows = priceTable(md)
      put('priceTable', rows, `Cenovnik: ${rows.length} redova, sa cenom ${rows.filter((r) => r.priceFrom).length}`)
    } else if (field === 'faq') {
      const items = faq(md)
      put('faq', items, `Česta pitanja: ${items.length}`)
    } else {
      put(field, markdownToLexical(md.replace(/\{PRICE\}/g, 'na upit')), `${field}: ${md.split(/\s+/).length} reči`)
    }
  }
  if (front.keyword && !doc.keyword) put('keyword', front.keyword, `Ključna reč: ${front.keyword}`)

  if (!apply) {
    console.log('\nProbni prolaz – ništa nije upisano. Za upis dodajte --apply.')
  } else if (unchecked.length) {
    console.log(`\nNije upisano: u tekstu još ima ${unchecked.length} oznaka [PROVERITI …]. Proverite tvrdnje i obrišite oznake.`)
  } else {
    await payload.update({ collection, id: doc.id, locale, data: data as never })
    console.log('\nUpisano.')
  }
  if (unchecked.length) console.log(`Za proveru: ${unchecked.join(' · ')}`)
  process.exit(0)
}

void run()
