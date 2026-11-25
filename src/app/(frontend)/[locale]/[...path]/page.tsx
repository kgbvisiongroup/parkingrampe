import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { SetAlternates } from '@/components/Alternates'
import { type Locale, getDictionary, isLocale, locales, routeBase } from '@/lib/i18n'
import { getNavigation } from '@/lib/nav'
import {
  getAllSlugs,
  getCategoryBySlug,
  getCityBySlug,
  isCityIndexable,
  getPageBySlug,
  getPageByTemplate,
  getProductBySlug,
  getProjectBySlug,
  getServiceBySlug,
  getSettings,
} from '@/lib/payload'
import { docPath, paths } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'
import { isAutoDescription, isAutoTitle, listingDescription, listingTitle, lowestPrice, productDescription, productTitle } from '@/lib/seoTitles'
import { CatalogView, CategoryView, ProductView } from '@/views/CatalogViews'
import { PageView } from '@/views/PageView'
import { ProjectView } from '@/views/ProjectView'
import { ServiceView } from '@/views/ServiceView'
import { CityView, cityHeading, cityTitle } from '@/views/CityView'

type Props = { params: Promise<{ locale: string; path: string[] }> }

export const revalidate = 3600
export const dynamicParams = true

// Pages are rendered on first visit and then cached; CMS edits clear the cache.
export function generateStaticParams() {
  return []
}

const resolve = cache(async (locale: Locale, path: string[]) => {
  const segs = path.map((s) => decodeURIComponent(s))
  if (segs.length === 1) {
    const page = await getPageBySlug(locale, segs[0])
    if (page) return { kind: 'page', doc: page } as const
    if (segs[0] === routeBase.products[locale]) return { kind: 'catalog', doc: null } as const
    const prefix = routeBase.cityPrefix[locale]
    if (segs[0].startsWith(prefix)) {
      const city = await getCityBySlug(locale, segs[0].slice(prefix.length))
      if (city) return { kind: 'city', doc: city } as const
    }
    return null
  }
  if (segs.length === 2) {
    if (segs[0] === routeBase.products[locale]) {
      const category = await getCategoryBySlug(locale, segs[1])
      if (category) return { kind: 'category', doc: category } as const
      const product = await getProductBySlug(locale, segs[1])
      return product ? ({ kind: 'product', doc: product } as const) : null
    }
    if (segs[0] === routeBase.services[locale]) {
      const service = await getServiceBySlug(locale, segs[1])
      return service ? ({ kind: 'service', doc: service } as const) : null
    }
    if (segs[0] === routeBase.projects[locale]) {
      const project = await getProjectBySlug(locale, segs[1])
      return project ? ({ kind: 'project', doc: project } as const) : null
    }
  }
  return null
})

const collectionOf = {
  page: 'pages',
  service: 'services',
  project: 'projects',
  category: 'product-categories',
  product: 'products',
  city: 'cities',
} as const

async function alternatePaths(found: NonNullable<Awaited<ReturnType<typeof resolve>>>) {
  if (found.kind === 'catalog') return { sr: paths.catalog('sr'), en: paths.catalog('en') }
  const collection = collectionOf[found.kind]
  const slugs = await getAllSlugs(collection, found.doc.id)
  const out: Partial<Record<Locale, string>> = {}
  for (const l of locales) if (slugs[l]) out[l] = docPath(collection, l, slugs[l])
  // City pages: no hreflang to a language version that is still hidden from Google.
  if (found.kind === 'city') for (const l of locales) if (out[l] && !(await isCityIndexable(l, found.doc.id))) delete out[l]
  return out
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, path } = await params
  if (!isLocale(locale)) return {}
  const found = await resolve(locale, path)
  if (!found) return {}
  const [settings, alt] = await Promise.all([getSettings(locale), alternatePaths(found)])
  const dict = getDictionary(locale)
  const base = { locale, settings, paths: alt }

  switch (found.kind) {
    case 'catalog':
      return buildMetadata({ ...base, fallbackTitle: dict.catalog })
    case 'service':
    case 'category': {
      // Pattern title/description unless one was typed by hand in the CMS (see lib/seoTitles).
      const d = found.doc
      const listing = { title: d.title, keyword: d.keyword, heading: d.heading, priceFrom: lowestPrice(d.priceTable) }
      const autoTitle = isAutoTitle(d.meta?.title, d.title)
      const source = found.kind === 'service' ? found.doc.tagline : found.doc.description
      const meta = {
        ...d.meta,
        title: autoTitle ? listingTitle(listing, locale) : d.meta?.title,
        description: isAutoDescription(d.meta?.description, source) ? listingDescription(listing, locale) : d.meta?.description,
      }
      const image = found.kind === 'service' ? found.doc.heroImage : found.doc.image
      return buildMetadata({ ...base, meta, fallbackTitle: d.title, fallbackImage: image, absoluteTitle: autoTitle })
    }
    case 'project':
      return buildMetadata({ ...base, meta: found.doc.meta, fallbackTitle: found.doc.title, fallbackDescription: found.doc.summary, fallbackImage: found.doc.cover, type: 'article' })
    case 'product': {
      const p = found.doc
      const autoTitle = isAutoTitle(p.meta?.title, p.title)
      const meta = {
        ...p.meta,
        title: autoTitle ? productTitle(p) : p.meta?.title,
        description: isAutoDescription(p.meta?.description, p.excerpt) ? productDescription(p, locale) : p.meta?.description,
      }
      return buildMetadata({ ...base, meta, fallbackTitle: p.title, fallbackImage: p.images?.[0], absoluteTitle: autoTitle })
    }
    case 'page':
      return buildMetadata({ ...base, meta: found.doc.meta, fallbackTitle: found.doc.title, fallbackDescription: found.doc.lead, fallbackImage: found.doc.heroImage })
    case 'city': {
      const c = found.doc
      const autoTitle = isAutoTitle(c.meta?.title, c.city)
      const meta = {
        ...c.meta,
        title: autoTitle ? cityTitle(c, locale) : c.meta?.title,
        description: c.meta?.description || listingDescription({ title: cityHeading(c, locale) }, locale),
        // Hidden from Google until it is marked ready and has its own text (no city-name copies).
        noIndex: c.meta?.noIndex || !(await isCityIndexable(locale, c.id)),
      }
      return buildMetadata({ ...base, meta, fallbackTitle: c.city, absoluteTitle: autoTitle })
    }
  }
}

export default async function CatchAllPage({ params }: Props) {
  const { locale, path } = await params
  if (!isLocale(locale)) notFound()
  const found = await resolve(locale, path)
  if (!found) notFound()

  const [settings, nav, alt] = await Promise.all([getSettings(locale), getNavigation(locale), alternatePaths(found)])
  const dict = getDictionary(locale)
  const base = { locale, dict, settings }

  let view: React.ReactNode
  switch (found.kind) {
    case 'catalog':
      view = <CatalogView {...base} page={await getPageByTemplate(locale, 'products')} />
      break
    case 'category':
      view = <CategoryView {...base} category={found.doc} />
      break
    case 'product':
      view = <ProductView {...base} product={found.doc} contactHref={nav.contactHref} />
      break
    case 'service': {
      const servicesPage = await getPageByTemplate(locale, 'services')
      view = (
        <ServiceView
          {...base}
          service={found.doc}
          contactHref={nav.contactHref}
          servicesHref={servicesPage?.slug ? paths.page(locale, servicesPage.slug) : null}
        />
      )
      break
    }
    case 'project':
      view = <ProjectView {...base} project={found.doc} contactHref={nav.contactHref} portfolioPage={await getPageByTemplate(locale, 'portfolio')} />
      break
    case 'page':
      view = <PageView {...base} page={found.doc} contactHref={nav.contactHref} />
      break
    case 'city':
      view = <CityView {...base} city={found.doc} />
      break
  }

  return (
    <>
      <SetAlternates paths={alt} />
      {view}
    </>
  )
}
