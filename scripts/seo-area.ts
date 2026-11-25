/**
 * SEO task 6: the real service area instead of "širom Srbije" in texts typed in the CMS.
 *
 *   npm run seo:area            – lists every text that would change, changes nothing
 *   npm run seo:area -- --apply – replaces them
 *
 * Goes through all text fields (also inside rich text and sections) of pages, services, categories,
 * products, projects, FAQ, the home page, navigation and settings, in both languages.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const RULES: Record<'sr' | 'en', [RegExp, string][]> = {
  sr: [
    [/u Beogradu i (širom )?Srbij[ie]/g, 'u Beogradu i okolini do 100 km'],
    [/,? ?širom Srbije/g, ' u Beogradu i okolini do 100 km'],
    [/na teritoriji (cele )?Srbije/g, 'u Beogradu i okolini do 100 km'],
  ],
  en: [
    [/in Belgrade and (across|throughout) Serbia/g, 'in Belgrade and up to 100 km around'],
    [/,? ?(across|throughout) Serbia/g, ' in Belgrade and up to 100 km around'],
  ],
}

const apply = process.argv.includes('--apply')
let found = 0

/** Returns a copy with replaced strings, and reports each change. */
function walk(value: unknown, locale: 'sr' | 'en', where: string): unknown {
  if (typeof value === 'string') {
    let out = value
    for (const [re, to] of RULES[locale]) out = out.replace(re, to)
    if (out !== value) {
      found++
      console.log(`• ${where}\n    − ${value.slice(0, 160)}\n    + ${out.slice(0, 160)}`)
    }
    return out
  }
  if (Array.isArray(value)) return value.map((v, i) => walk(v, locale, where))
  if (value && typeof value === 'object') {
    const o: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) o[k] = ['id', 'slug', 'url', 'blockType', 'type', 'searchText'].includes(k) ? v : walk(v, locale, where)
    return o
  }
  return value
}

const changed = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b)

async function run() {
  const payload = await getPayload({ config })
  console.log(apply ? 'Menjam tekstove…\n' : 'Probni prolaz – ništa se ne menja. Za upis: npm run seo:area -- --apply\n')
  for (const locale of ['sr', 'en'] as const) {
    for (const collection of ['pages', 'services', 'product-categories', 'products', 'projects', 'faqs'] as const) {
      const res = await payload.find({ collection, locale, depth: 0, limit: 2000, pagination: false })
      for (const doc of res.docs as unknown as ({ id: number; title?: string; question?: string } & Record<string, unknown>)[]) {
        const { id, createdAt, updatedAt, ...rest } = doc
        const next = walk(rest, locale, `${collection} „${doc.title ?? doc.question}” (${locale})`) as Record<string, unknown>
        if (apply && changed(rest, next)) await payload.update({ collection, id, locale, depth: 0, data: next as never })
      }
    }
    for (const slug of ['home', 'navigation', 'settings'] as const) {
      const g = (await payload.findGlobal({ slug, locale, depth: 0 })) as unknown as Record<string, unknown>
      const { id, createdAt, updatedAt, globalType, ...rest } = g
      const next = walk(rest, locale, `${slug} (${locale})`) as Record<string, unknown>
      if (apply && changed(rest, next)) await payload.updateGlobal({ slug, locale, depth: 0, data: next as never })
    }
  }
  console.log(`\n${found} tekstova ${apply ? 'izmenjeno' : 'bi se izmenilo'}.`)
  process.exit(0)
}

void run()
