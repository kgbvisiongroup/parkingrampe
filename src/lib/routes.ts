import { type Locale, routeBase } from './i18n'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const paths = {
  home: (locale: Locale) => `/${locale}`,
  service: (locale: Locale, slug: string) => `/${locale}/${routeBase.services[locale]}/${slug}`,
  project: (locale: Locale, slug: string) => `/${locale}/${routeBase.projects[locale]}/${slug}`,
  page: (locale: Locale, slug: string) => `/${locale}/${slug}`,
  catalog: (locale: Locale) => `/${locale}/${routeBase.products[locale]}`,
  /** Categories and products share one URL space: /sr/proizvodi/<slug>. */
  catalogItem: (locale: Locale, slug: string) => `/${locale}/${routeBase.products[locale]}/${slug}`,
  search: (locale: Locale) => `/${locale}/${routeBase.search[locale]}`,
}

export const absolute = (path: string) => (/^https?:\/\//.test(path) ? path : `${siteUrl}${path}`)

/** Path for any CMS document, used by links, the SEO preview and the sitemap. */
export function docPath(collection: string | undefined, locale: Locale, slug?: string | null): string {
  if (!slug) return paths.home(locale)
  switch (collection) {
    case 'services':
      return paths.service(locale, slug)
    case 'projects':
      return paths.project(locale, slug)
    case 'pages':
      return paths.page(locale, slug)
    case 'product-categories':
    case 'products':
      return paths.catalogItem(locale, slug)
    default:
      return paths.home(locale)
  }
}
