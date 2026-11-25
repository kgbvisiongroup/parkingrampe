import type { Faq, Setting } from '@/payload-types'
import { mediaUrl } from './media'
import { absolute } from './routes'
import type { Locale } from './i18n'

/** Defaults from kgb.co.rs; every value can be changed in Settings → Company details → Data for Google. */
const BUSINESS = {
  name: 'KGB Automation',
  legalName: 'KGB Vision Group d.o.o.',
  streetAddress: 'Vojvode Mišića 179',
  postalCode: '11500',
  addressLocality: 'Obrenovac',
  addressRegion: 'Beograd',
  hours: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '16:00' }],
  areaServed: ['Beograd', 'Obrenovac', 'Šabac', 'Novi Sad', 'Zrenjanin'],
  instagram: 'https://www.instagram.com/kgbvision',
}

/** Address as shown on the site: "Vojvode Mišića 179, 11500 Obrenovac" (same data as the schema). */
export function businessAddress(settings: Setting) {
  const b = settings.business ?? {}
  return `${b.streetAddress || BUSINESS.streetAddress}, ${b.postalCode || BUSINESS.postalCode} ${b.addressLocality || BUSINESS.addressLocality}`
}

export const BRAND_LINE = { sr: 'KGB Automation – deo KGB Vision Group d.o.o.', en: 'KGB Automation – part of KGB Vision Group d.o.o.' }

export function localBusinessSchema(settings: Setting, locale: Locale) {
  const logo = mediaUrl(settings.logo)
  const image = mediaUrl(settings.defaultOgImage, 'og')
  const b = settings.business ?? {}
  const hours = b.openingHours?.length ? b.openingHours : BUSINESS.hours
  const areas = (b.areaServed?.split('\n').map((a) => a.trim()).filter(Boolean) ?? []).length
    ? b.areaServed!.split('\n').map((a) => a.trim()).filter(Boolean)
    : BUSINESS.areaServed
  const sameAs = [...new Set([BUSINESS.instagram, ...(settings.socials?.map((s) => s.url) ?? []), b.googleBusinessUrl].filter((u): u is string => !!u).map((u) => u.replace(/\/+$/, '')))]
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': absolute('/#business'),
    // One brand everywhere: KGB Automation, part of KGB Vision Group d.o.o.
    name: BUSINESS.name,
    legalName: settings.legalName || BUSINESS.legalName,
    parentOrganization: { '@type': 'Organization', name: settings.legalName || BUSINESS.legalName },
    url: absolute(`/${locale}`),
    logo: logo ? absolute(logo) : undefined,
    image: image ? absolute(image) : undefined,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    taxID: settings.pib || undefined,
    priceRange: b.priceRange || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.streetAddress || BUSINESS.streetAddress,
      postalCode: b.postalCode || BUSINESS.postalCode,
      addressLocality: b.addressLocality || BUSINESS.addressLocality,
      addressRegion: b.addressRegion || BUSINESS.addressRegion,
      addressCountry: 'RS',
    },
    // Only real coordinates (typed in Settings); never guessed.
    geo: typeof b.latitude === 'number' && typeof b.longitude === 'number' ? { '@type': 'GeoCoordinates', latitude: b.latitude, longitude: b.longitude } : undefined,
    openingHoursSpecification: hours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    areaServed: areas.map((name) => ({ '@type': 'City', name })),
    sameAs,
  }
}

export function faqSchema(faqs: Pick<Faq, 'question' | 'answer'>[]) {
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
