import 'server-only'
import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'
import type { Locale } from './i18n'
import { searchCatalog } from './search'
import type {
  Client,
  Faq,
  Home,
  Navigation,
  Page,
  Product,
  ProductCategory,
  Project,
  Service,
  Setting,
} from '@/payload-types'

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getSettings = cache(async (locale: Locale): Promise<Setting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'settings', locale, depth: 1 })
})

export const getNavigationGlobal = cache(async (locale: Locale): Promise<Navigation> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation', locale, depth: 1 })
})

export const getHome = cache(async (locale: Locale): Promise<Home> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home', locale, depth: 2 })
})

/* ---------- services ---------- */

export const getServices = cache(async (locale: Locale): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'services', locale, depth: 1, limit: 50, sort: 'order' })
  return res.docs
})

export const getServiceBySlug = cache(async (locale: Locale, slug: string): Promise<Service | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'services', locale, depth: 2, limit: 1, where: { slug: { equals: slug } } })
  return res.docs[0] ?? null
})

/* ---------- catalog ---------- */

export const getCategories = cache(async (locale: Locale): Promise<ProductCategory[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'product-categories', locale, depth: 1, limit: 200, sort: 'order' })
  return res.docs
})

const parentId = (c: ProductCategory) => (typeof c.parent === 'object' ? c.parent?.id : c.parent) ?? null

export const getCategoryTree = cache(async (locale: Locale) => {
  const all = await getCategories(locale)
  const top = all.filter((c) => !parentId(c))
  return top.map((c) => ({ ...c, children: all.filter((s) => parentId(s) === c.id) }))
})

export const getChildCategories = cache(async (locale: Locale, id: number) => {
  const all = await getCategories(locale)
  return all.filter((c) => parentId(c) === id)
})

export const getCategoryBySlug = cache(async (locale: Locale, slug: string): Promise<ProductCategory | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'product-categories',
    locale,
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return res.docs[0] ?? null
})

export const getProducts = cache(
  async (locale: Locale, opts: { categoryIds?: number[]; featured?: boolean; ids?: number[]; limit?: number } = {}) => {
    const payload = await getPayloadClient()
    const and: Where[] = []
    if (opts.categoryIds?.length) and.push({ category: { in: opts.categoryIds } })
    if (opts.featured) and.push({ featured: { equals: true } })
    if (opts.ids?.length) and.push({ id: { in: opts.ids } })
    const res = await payload.find({
      collection: 'products',
      locale,
      depth: 1,
      limit: opts.limit ?? 200,
      sort: 'order',
      where: and.length ? { and } : undefined,
    })
    return res.docs
  },
)

export const getProductBySlug = cache(async (locale: Locale, slug: string): Promise<Product | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'products', locale, depth: 2, limit: 1, where: { slug: { equals: slug } } })
  return res.docs[0] ?? null
})

/* ---------- projects, pages, misc ---------- */

export const getProjects = cache(async (locale: Locale, limit = 100): Promise<Project[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'projects', locale, depth: 1, limit, sort: 'order' })
  return res.docs
})

export const getProjectBySlug = cache(async (locale: Locale, slug: string): Promise<Project | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'projects', locale, depth: 2, limit: 1, where: { slug: { equals: slug } } })
  return res.docs[0] ?? null
})

export const getPageBySlug = cache(async (locale: Locale, slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'pages', locale, depth: 2, limit: 1, where: { slug: { equals: slug } } })
  return res.docs[0] ?? null
})

export const getPageByTemplate = cache(async (locale: Locale, template: Page['template']): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'pages', locale, depth: 2, limit: 1, where: { template: { equals: template } } })
  return res.docs[0] ?? null
})

export const getHomeFaqs = cache(async (locale: Locale): Promise<Faq[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'faqs', locale, limit: 30, sort: 'order', where: { showOnHome: { equals: true } } })
  return res.docs
})

export const getClients = cache(async (): Promise<Client[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'clients', depth: 1, limit: 50, sort: 'order' })
  return res.docs
})

type Sluggable = 'pages' | 'services' | 'projects' | 'products' | 'product-categories'

/** Slugs of one document in every language, for hreflang and the language switch. */
export const getAllSlugs = cache(async (collection: Sluggable, id: number): Promise<Partial<Record<Locale, string>>> => {
  const payload = await getPayloadClient()
  const doc = await payload.findByID({ collection, id, locale: 'all', depth: 0 })
  return ((doc as { slug?: unknown })?.slug ?? {}) as Partial<Record<Locale, string>>
})

export const searchSite = cache(async (locale: Locale, q: string) => {
  const payload = await getPayloadClient()
  return searchCatalog(payload, locale, q)
})
