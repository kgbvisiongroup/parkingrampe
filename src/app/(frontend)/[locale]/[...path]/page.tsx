import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { SetAlternates } from '@/components/Alternates'
import { type Locale, getDictionary, isLocale, locales, routeBase } from '@/lib/i18n'
import { getNavigation } from '@/lib/nav'
import {
  getAllSlugs,
  getCategoryBySlug,
  getPageBySlug,
  getPageByTemplate,
  getProductBySlug,
  getProjectBySlug,
  getServiceBySlug,
  getSettings,
} from '@/lib/payload'
import { docPath, paths } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'
import { CatalogView, CategoryView, ProductView } from '@/views/CatalogViews'
import { PageView } from '@/views/PageView'
import { ProjectView } from '@/views/ProjectView'
import { ServiceView } from '@/views/ServiceView'

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
} as const

async function alternatePaths(found: NonNullable<Awaited<ReturnType<typeof resolve>>>) {
  if (found.kind === 'catalog') return { sr: paths.catalog('sr'), en: paths.catalog('en') }
  const collection = collectionOf[found.kind]
  const slugs = await getAllSlugs(collection, found.doc.id)
  const out: Partial<Record<Locale, string>> = {}
  for (const l of locales) if (slugs[l]) out[l] = docPath(collection, l, slugs[l])
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
      return buildMetadata({ ...base, meta: found.doc.meta, fallbackTitle: found.doc.title, fallbackDescription: found.doc.tagline, fallbackImage: found.doc.heroImage })
    case 'project':
      return buildMetadata({ ...base, meta: found.doc.meta, fallbackTitle: found.doc.title, fallbackDescription: found.doc.summary, fallbackImage: found.doc.cover, type: 'article' })
    case 'category':
      return buildMetadata({ ...base, meta: found.doc.meta, fallbackTitle: found.doc.title, fallbackDescription: found.doc.description, fallbackImage: found.doc.image })
    case 'product':
      return buildMetadata({ ...base, meta: found.doc.meta, fallbackTitle: found.doc.title, fallbackDescription: found.doc.excerpt, fallbackImage: found.doc.images?.[0] })
    case 'page':
      return buildMetadata({ ...base, meta: found.doc.meta, fallbackTitle: found.doc.title, fallbackDescription: found.doc.lead, fallbackImage: found.doc.heroImage })
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
  }

  return (
    <>
      <SetAlternates paths={alt} />
      {view}
    </>
  )
}
