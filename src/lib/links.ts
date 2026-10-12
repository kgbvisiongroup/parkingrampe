import type { Locale } from './i18n'
import { docPath } from './routes'

type Ref = { relationTo: string; value: unknown } | null | undefined
export type CmsLink = {
  type?: 'internal' | 'custom' | null
  label?: string | null
  url?: string | null
  newTab?: boolean | null
  reference?: Ref
} | null | undefined

/** Turns a CMS link field into an href, or null when nothing is set. */
export function linkHref(link: CmsLink, locale: Locale): string | null {
  if (!link) return null
  if (link.type === 'custom') return link.url?.trim() || null
  const ref = link.reference
  if (!ref || !ref.value || typeof ref.value !== 'object') return null
  const slug = (ref.value as { slug?: string | null }).slug
  if (!slug) return null
  return docPath(ref.relationTo, locale, slug)
}

export function linkProps(link: CmsLink, locale: Locale) {
  const href = linkHref(link, locale)
  if (!href) return null
  const external = /^https?:\/\//.test(href) || link?.newTab
  return {
    href,
    label: link?.label || '',
    target: link?.newTab ? '_blank' : undefined,
    rel: external ? 'noopener noreferrer' : undefined,
  }
}
