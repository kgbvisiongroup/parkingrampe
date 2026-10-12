import type { Endpoint } from 'payload'
import { isLocale } from '../lib/i18n'
import { mediaUrl } from '../lib/media'
import { paths } from '../lib/routes'
import { searchCatalog } from '../lib/search'

/** Live search for the header: /api/search?q=…&locale=sr */
export const searchEndpoint: Endpoint = {
  path: '/search',
  method: 'get',
  handler: async (req) => {
    const url = new URL(req.url || '', 'http://local')
    const q = url.searchParams.get('q') ?? ''
    const l = url.searchParams.get('locale') ?? 'sr'
    const locale = isLocale(l) ? l : 'sr'
    const r = await searchCatalog(req.payload, locale, q, { products: 8, other: 4 })
    return Response.json(
      {
        products: r.products.map((p) => ({
          title: p.title,
          code: p.code,
          href: paths.catalogItem(locale, p.slug || ''),
          image: mediaUrl(p.images?.[0], 'thumb'),
        })),
        categories: r.categories.map((c) => ({ title: c.title, href: paths.catalogItem(locale, c.slug || '') })),
        services: r.services.map((s) => ({ title: s.title, href: paths.service(locale, s.slug || '') })),
      },
      { headers: { 'Cache-Control': 'public, max-age=60' } },
    )
  },
}
