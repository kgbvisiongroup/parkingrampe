/**
 * Title, H1 and meta description patterns (SEO task 2).
 *
 * A title or description typed by hand in the CMS always wins. The values the CMS fills in by
 * itself (product name, "Category – Key Automation", the "Generate" button) count as empty,
 * so the patterns below replace them without rewriting any data.
 * Prices are never invented: the price part is left out when no price is set in the CMS.
 */
import type { Locale } from './i18n'
import { seriesFromCode } from './series'

export const BRAND = 'KGB Automation'
const AREA = { sr: 'Beograd i okolina do 100 km', en: 'Belgrade and up to 100 km around' }
const PHONE = '066 510 11 50'

const norm = (s?: string | null) => (s ?? '').toLowerCase().replace(/[\s–—-]+/g, ' ').trim()
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).replace(/[\s,;:–-]+\S*$/, '') + '…' : s)
const lowerFirst = (s: string) => (/^[A-ZČĆŽŠĐ][a-zčćžšđ]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s)

export const formatPrice = (n: number, locale: Locale) =>
  `${new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'sr-RS').format(Math.round(n))} RSD`

/** True when the stored SEO title was filled in by the CMS itself, not by a person. */
export function isAutoTitle(metaTitle: string | null | undefined, title: string) {
  const m = norm(metaTitle)
  if (!m) return true
  const t = norm(title)
  if (m === t || m === norm(`${title} – Key Automation`)) return true
  // Product names clipped to 60 characters with "…".
  return m.endsWith('…') && t.startsWith(m.slice(0, -1).trim())
}

/** True when the stored description was written by the CMS hooks (old default texts). */
export function isAutoDescription(metaDescription: string | null | undefined, source?: string | null) {
  const d = (metaDescription ?? '').trim()
  if (!d) return true
  if (/Prodaja, ugradnja i servis( – KGB Automation| u Beogradu i Srbiji| u Beogradu i okolini do 100 km)\.?$|Sales, installation and service – KGB Automation\.?$/.test(d)) return true
  const s = (source ?? '').trim()
  if (!s) return false
  // Old defaults: the short text itself, possibly clipped to 160 characters with "…".
  return d === s || d === s.slice(0, 160) || (d.endsWith('…') && s.startsWith(d.slice(0, -1).trim()))
}

/** Lowest "price from" in a price table, if any row has a price. */
export function lowestPrice(rows?: { priceFrom?: number | null }[] | null) {
  const prices = (rows ?? []).map((r) => r.priceFrom).filter((p): p is number => typeof p === 'number' && p > 0)
  return prices.length ? Math.min(...prices) : undefined
}

// ---------- services and categories ----------

type Listing = { title: string; keyword?: string | null; heading?: string | null; priceFrom?: number }

/** "<Keyword> – ugradnja i servis | Cena od {PRICE} | KGB Automation" (price part only when set). */
export function listingTitle({ title, keyword, priceFrom }: Listing, locale: Locale) {
  const kw = keyword?.trim() || title
  const parts = [`${kw} – ${locale === 'en' ? 'installation and service' : 'ugradnja i servis'}`]
  if (priceFrom) parts.push(`${locale === 'en' ? 'From' : 'Cena od'} ${formatPrice(priceFrom, locale)}`)
  parts.push(BRAND)
  return parts.join(' | ')
}

/** Visible H1: contains the keyword but is not a copy of the title. */
export function listingHeading({ title, keyword, heading }: Listing, locale: Locale) {
  if (heading?.trim()) return heading.trim()
  const kw = keyword?.trim() || title
  return locale === 'en' ? `${kw} with installation in Belgrade and the surrounding area` : `${kw} sa ugradnjom u Beogradu i okolini`
}

export function listingDescription({ title, keyword, priceFrom }: Listing, locale: Locale) {
  const kw = keyword?.trim() || title
  const price = priceFrom
    ? `${locale === 'en' ? 'From' : 'Cena od'} ${formatPrice(priceFrom, locale)}`
    : locale === 'en' ? 'Price on request' : 'Cena na upit'
  const text =
    locale === 'en'
      ? `${kw}: Key Automation equipment with installation and service – ${AREA.en}. ${price}. Call ${PHONE}.`
      : `${kw}: Key Automation oprema sa ugradnjom i servisom – ${AREA.sr}. ${price}. Pozovite ${PHONE}.`
  return clip(text, 160)
}

// ---------- products ----------

type ProductLike = { title: string; code?: string | null; series?: string | null; brand?: string | null; price?: number | null }

/** Product name without the leading "CODE – ". */
export function productShortName(p: ProductLike) {
  const code = p.code?.trim()
  return code ? p.title.replace(new RegExp(`^${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[–-]\\s*`, 'i'), '') : p.title
}

/** "<CODE> Key <SERIES> – <short description> | KGB Automation"; the brand suffix is dropped when it would make the title too long. */
const seriesOf = (p: ProductLike) => p.series?.trim() || seriesFromCode(p.code)

export function productTitle(p: ProductLike) {
  const code = p.code?.trim()
  const head = [code, 'Key', seriesOf(p)].filter(Boolean).join(' ')
  const base = code ? `${head} – ${lowerFirst(productShortName(p))}` : p.title
  const full = `${base} | ${BRAND}`
  return full.length <= 70 ? full : clip(base, 70)
}

export function productDescription(p: ProductLike, locale: Locale) {
  const name = [p.code?.trim(), 'Key', seriesOf(p)].filter(Boolean).join(' ')
  const what = productShortName(p).replace(/[.…]+$/, '')
  const price = p.price
    ? `${locale === 'en' ? 'Price' : 'Cena'} ${formatPrice(p.price, locale)}`
    : locale === 'en' ? 'Price on request' : 'Cena na upit'
  const text =
    locale === 'en'
      ? `${name}: ${lowerFirst(what)}. Delivery and installation – ${AREA.en}. ${price}. Call ${PHONE}.`
      : `${name}: ${lowerFirst(what)}. Isporuka i ugradnja – ${AREA.sr}. ${price}. Pozovite ${PHONE}.`
  return clip(text, 160)
}
