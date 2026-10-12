import type { Metadata } from 'next'
import type { Setting } from '@/payload-types'
import { type Locale, locales, ogLocale } from './i18n'
import { asMedia, type MediaRef, mediaUrl } from './media'
import { absolute } from './routes'

type MetaFields = {
  title?: string | null
  description?: string | null
  image?: MediaRef
  noIndex?: boolean | null
  canonical?: string | null
} | null | undefined

type Args = {
  locale: Locale
  settings: Setting
  meta?: MetaFields
  fallbackTitle: string
  fallbackDescription?: string | null
  fallbackImage?: MediaRef
  /** Path of this page in each language, e.g. { sr: '/sr/kontakt', en: '/en/contact' }. */
  paths: Partial<Record<Locale, string>>
  /** Do not append the site suffix (home page). */
  absoluteTitle?: boolean
  type?: 'website' | 'article'
}

export function buildMetadata({
  locale,
  settings,
  meta,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  paths,
  absoluteTitle,
  type = 'website',
}: Args): Metadata {
  const baseTitle = meta?.title?.trim() || fallbackTitle
  const suffix = settings.titleTemplate?.trim()
  const fullTitle = absoluteTitle || !suffix || baseTitle.includes(suffix) ? baseTitle : `${baseTitle} ${suffix}`
  const description = (meta?.description || fallbackDescription || settings.defaultDescription || '').trim()

  const imageRef = meta?.image || fallbackImage || settings.defaultOgImage
  const image = mediaUrl(imageRef, 'og')
  const imageAlt = asMedia(imageRef)?.alt || baseTitle

  const selfPath = paths[locale] ?? `/${locale}`
  const canonical = meta?.canonical?.trim() || absolute(selfPath)

  const languages: Record<string, string> = {}
  for (const l of locales) {
    const p = paths[l]
    if (p) languages[l === 'sr' ? 'sr-Latn-RS' : 'en'] = absolute(p)
  }
  if (paths.sr) languages['x-default'] = absolute(paths.sr)

  const noIndex = Boolean(meta?.noIndex || settings.noIndexSite)

  return {
    title: { absolute: fullTitle },
    description: description || undefined,
    keywords: settings.keywords || undefined,
    alternates: { canonical, languages },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      type,
      url: absolute(selfPath),
      siteName: settings.siteName,
      title: baseTitle,
      description: description || undefined,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale && paths[l]).map((l) => ogLocale[l]),
      images: image ? [{ url: absolute(image), width: 1200, height: 630, alt: imageAlt }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description: description || undefined,
      images: image ? [absolute(image)] : undefined,
    },
  }
}
