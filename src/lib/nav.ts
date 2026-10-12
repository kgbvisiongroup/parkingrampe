import 'server-only'
import { cache } from 'react'
import type { Locale } from './i18n'
import { linkHref } from './links'
import { mediaUrl } from './media'
import { getCategoryTree, getNavigationGlobal, getPageByTemplate, getProducts, getServices } from './payload'
import { paths } from './routes'

export type NavLink = { label: string; href: string; badge?: string | null }
export type MegaGroup = NavLink & { image?: string | null; children: NavLink[] }
export type NavItem =
  | ({ kind: 'link' } & NavLink)
  | { kind: 'dropdown'; label: string; href?: string | null; children: NavLink[] }
  | { kind: 'mega'; label: string; href?: string | null; groups: MegaGroup[] }

export const getNavigation = cache(async (locale: Locale) => {
  const [nav, tree, services, contactPage, products] = await Promise.all([
    getNavigationGlobal(locale),
    getCategoryTree(locale),
    getServices(locale),
    getPageByTemplate(locale, 'contact'),
    getProducts(locale),
  ])
  const productsOf = (catId: number) =>
    products
      .filter((p) => (typeof p.category === 'object' ? p.category?.id : p.category) === catId && p.slug)
      .slice(0, 10)
      .map((p) => ({ label: p.title, href: paths.catalogItem(locale, p.slug!) }))

  const items: NavItem[] = []
  for (const it of nav.items ?? []) {
    const href = linkHref(it.link, locale)
    if (it.kind === 'products') {
      items.push({
        kind: 'mega',
        label: it.label,
        href: href ?? paths.catalog(locale),
        groups: tree
          .filter((c) => c.showInMenu !== false && c.slug)
          .map((c) => ({
            label: c.title,
            href: paths.catalogItem(locale, c.slug!),
            image: mediaUrl(c.image, 'thumb'),
            // Subcategories, or the category's products when it has none.
            children: c.children.length
              ? c.children
                  .filter((s) => s.showInMenu !== false && s.slug)
                  .map((s) => ({ label: s.title, href: paths.catalogItem(locale, s.slug!) }))
              : productsOf(c.id),
          })),
      })
    } else if (it.kind === 'services') {
      items.push({
        kind: 'dropdown',
        label: it.label,
        href,
        children: services
          .filter((s) => s.slug)
          .map((s) => ({ label: s.title, href: paths.service(locale, s.slug!), badge: s.badge })),
      })
    } else if (it.kind === 'dropdown') {
      items.push({
        kind: 'dropdown',
        label: it.label,
        href: null,
        children: (it.children ?? [])
          .map((c) => ({ label: c.label, href: linkHref(c.link, locale) ?? '' }))
          .filter((c) => c.href),
      })
    } else if (href) {
      items.push({ kind: 'link', label: it.label, href })
    }
  }

  const ctaHref = linkHref(nav.cta, locale)
  const contactHref = contactPage?.slug ? paths.page(locale, contactPage.slug) : `/${locale}`

  const footerColumns = (nav.footerColumns ?? []).map((col) => ({
    title: col.title,
    links: (col.links ?? [])
      .map((l) => ({ label: l.label, href: linkHref(l.link, locale) ?? '' }))
      .filter((l) => l.href),
  }))

  return {
    items,
    cta: ctaHref && nav.cta?.label ? { label: nav.cta.label, href: ctaHref } : null,
    showSearch: nav.showSearch !== false,
    showPhone: nav.showPhone !== false,
    contactHref,
    footerColumns,
    services: services.filter((s) => s.slug).map((s) => ({ label: s.title, href: paths.service(locale, s.slug!) })),
  }
})
