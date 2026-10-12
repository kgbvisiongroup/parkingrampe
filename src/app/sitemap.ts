import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'
import { locales } from '@/lib/i18n'
import { absolute, docPath, paths } from '@/lib/routes'

export const revalidate = 3600

type Slugs = Record<string, string | undefined>

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const entries: MetadataRoute.Sitemap = []

  const home = await payload.findGlobal({ slug: 'home', depth: 0 })
  entries.push({
    url: absolute('/sr'),
    lastModified: home.updatedAt ? new Date(home.updatedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 1,
    alternates: { languages: { 'sr-Latn-RS': absolute('/sr'), en: absolute('/en') } },
  })
  entries.push({
    url: absolute('/en'),
    lastModified: home.updatedAt ? new Date(home.updatedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: { languages: { 'sr-Latn-RS': absolute('/sr'), en: absolute('/en') } },
  })

  const collections = [
    { slug: 'services', priority: 0.9 },
    { slug: 'product-categories', priority: 0.8 },
    { slug: 'products', priority: 0.8 },
    { slug: 'pages', priority: 0.7 },
    { slug: 'projects', priority: 0.5 },
  ] as const

  for (const c of collections) {
    const res = await payload.find({ collection: c.slug, locale: 'all', depth: 0, limit: 500, pagination: false })
    for (const doc of res.docs as { slug?: unknown; updatedAt: string; meta?: unknown }[]) {
      const slugs = (doc.slug ?? {}) as Slugs
      const meta = (doc.meta ?? {}) as Record<string, { noIndex?: boolean } | undefined> & { noIndex?: unknown }
      const languages: Record<string, string> = {}
      for (const l of locales) if (slugs[l]) languages[l === 'sr' ? 'sr-Latn-RS' : 'en'] = absolute(docPath(c.slug, l, slugs[l]))
      for (const l of locales) {
        if (!slugs[l]) continue
        // Skip pages marked noindex (noIndex is not localized, so it is a plain boolean).
        if (meta?.noIndex === true) continue
        entries.push({
          url: absolute(docPath(c.slug, l, slugs[l])),
          lastModified: new Date(doc.updatedAt),
          changeFrequency: c.slug === 'projects' ? 'monthly' : 'weekly',
          priority: l === 'sr' ? c.priority : c.priority - 0.1,
          alternates: { languages },
        })
      }
    }
  }
  for (const l of locales) {
    entries.push({ url: absolute(paths.catalog(l)), changeFrequency: 'weekly', priority: l === 'sr' ? 0.8 : 0.7 })
  }
  // A page can share its address with the catalog overview; keep each URL once.
  const seen = new Set<string>()
  return entries.filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)))
}
