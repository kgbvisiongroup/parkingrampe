import type { Faq, Setting } from '@/payload-types'
import { mediaUrl } from './media'
import { absolute } from './routes'
import type { Locale } from './i18n'

export function localBusinessSchema(settings: Setting, locale: Locale) {
  const logo = mediaUrl(settings.logo)
  const image = mediaUrl(settings.defaultOgImage, 'og')
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': absolute('/#business'),
    name: settings.siteName,
    legalName: settings.legalName || undefined,
    url: absolute(`/${locale}`),
    logo: logo ? absolute(logo) : undefined,
    image: image ? absolute(image) : undefined,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    taxID: settings.pib || undefined,
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address.split(',')[0]?.trim(),
          addressLocality: settings.address.split(',').slice(1).join(',').trim() || undefined,
          addressCountry: 'RS',
        }
      : undefined,
    areaServed: { '@type': 'Country', name: 'Serbia' },
    sameAs: settings.socials?.map((s) => s.url) ?? [],
  }
}

export function faqSchema(faqs: Faq[]) {
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  }
}
