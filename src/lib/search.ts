import type { Payload, Where } from 'payload'
import type { Locale } from './i18n'
import { searchTerms } from './searchText'

/** Every word must appear (in any order); diacritics and case are ignored. */
const allWords = (field: string, words: string[]): Where => ({ and: words.map((w) => ({ [field]: { like: w } })) })

export async function searchCatalog(payload: Payload, locale: Locale, q: string, limits = { products: 48, other: 12 }) {
  const words = searchTerms(q)
  const raw = q.trim().slice(0, 80)
  if (!words.length) return { products: [], categories: [], services: [], pages: [] }
  const [products, categories, services, pages] = await Promise.all([
    payload.find({
      collection: 'products',
      locale,
      depth: 1,
      limit: limits.products,
      sort: 'order',
      where: { or: [allWords('searchText', words), { code: { like: raw } }] },
    }),
    payload.find({ collection: 'product-categories', locale, depth: 1, limit: limits.other, where: allWords('searchText', words) }),
    payload.find({
      collection: 'services',
      locale,
      depth: 1,
      limit: limits.other,
      where: { or: [{ title: { like: raw } }, { tagline: { like: raw } }] },
    }),
    payload.find({ collection: 'pages', locale, depth: 0, limit: limits.other, where: { title: { like: raw } } }),
  ])
  return { products: products.docs, categories: categories.docs, services: services.docs, pages: pages.docs }
}
