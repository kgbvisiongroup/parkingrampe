/* eslint-disable @next/next/no-img-element */
import { Phone, Send } from 'lucide-react'
import Link from 'next/link'
import type { Faq, Project, Setting } from '@/payload-types'
import { ContactPanel } from './ContactPanel'
import { RichText } from './RichText'
import { SectionHeading } from './ui'
import { type Locale } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'
import { paths } from '@/lib/routes'
import { formatPrice } from '@/lib/seoTitles'

/** Sections shared by category and service pages (SEO task 5). All server-rendered. */

export const INQUIRY_ANCHOR = 'upit'

const txt = {
  sr: { call: 'Pozovite', ask: 'Pošaljite upit', prices: 'Okvirne cene', item: 'Stavka', price: 'Cena', from: 'od', onRequest: 'Cena na upit', projects: 'Primeri ugradnje', allProjects: 'Ceo portfolio', inquiry: 'Zatražite ponudu', inquiryLead: 'Opišite prolaz ili kapiju – javljamo se sa predlogom opreme i cenom ugradnje.' },
  en: { call: 'Call', ask: 'Send an inquiry', prices: 'Indicative prices', item: 'Item', price: 'Price', from: 'from', onRequest: 'Price on request', projects: 'Installation examples', allProjects: 'Full portfolio', inquiry: 'Request a quote', inquiryLead: 'Describe the entrance or gate – we reply with suggested equipment and an installation price.' },
}

/** Call button + link to the inquiry form; shown near the top and before the form at the bottom. */
export function CallBand({ locale, settings, tone = 'band', children }: { locale: Locale; settings: Setting; tone?: 'band' | 'white'; children?: React.ReactNode }) {
  const t = txt[locale]
  const phone = settings.phone || '+381665101150'
  // International format on these pages: +381 66 510 11 50
  const d = phone.replace(/\D/g, '')
  const shown = d.startsWith('381') && d.length >= 11 ? `+381 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}` : settings.phoneDisplay || phone
  return (
    <section className={`${tone === 'band' ? 'bg-band' : 'bg-white'} py-5`}>
      <div className="wrap flex flex-wrap items-center justify-center gap-3">
        <a href={`tel:${phone}`} className="btn-accent btn-accent-lg">
          <Phone className="size-4" aria-hidden />
          {t.call} {shown}
        </a>
        <a href={`#${INQUIRY_ANCHOR}`} className="btn-dark px-5 py-3">
          <Send className="size-4" aria-hidden />
          {t.ask}
        </a>
        {children}
      </div>
    </section>
  )
}

type PriceRow = { id?: string | null; item: string; priceFrom?: number | null; priceTo?: number | null; note?: string | null }

export function PriceTable({ rows, locale }: { rows?: PriceRow[] | null; locale: Locale }) {
  const list = (rows ?? []).filter((r) => r.item)
  if (!list.length) return null
  const t = txt[locale]
  const price = (r: PriceRow) =>
    r.priceFrom && r.priceTo
      ? `${formatPrice(r.priceFrom, locale).replace(' RSD', '')} – ${formatPrice(r.priceTo, locale)}`
      : r.priceFrom
        ? `${t.from} ${formatPrice(r.priceFrom, locale)}`
        : t.onRequest
  return (
    <section className="py-12">
      <div className="wrap-narrow">
        <SectionHeading className="mb-6">{t.prices}</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[14.5px]">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="py-2 pr-4 font-extrabold">{t.item}</th>
                <th className="py-2 pr-4 text-right font-extrabold">{t.price}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r, i) => (
                <tr key={r.id ?? i} className="border-b border-line align-top">
                  <td className="py-3 pr-4 text-ink">
                    {r.item}
                    {r.note && <span className="block text-[12.5px] text-muted">{r.note}</span>}
                  </td>
                  <td className="whitespace-nowrap py-3 text-right font-extrabold text-ink tabular-nums">{price(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export function Guide({ data }: { data?: unknown }) {
  if (!data) return null
  return (
    <section className="py-12">
      <div className="wrap-narrow">
        <RichText data={data} className="text-[15px]" />
      </div>
    </section>
  )
}

/** Inline questions of the page plus questions picked from the shared FAQ list, without repeats. */
export function mergeFaqs(inline?: { question: string; answer: string }[] | null, linked?: (number | Faq)[] | null) {
  const out: { question: string; answer: string }[] = []
  const seen = new Set<string>()
  for (const f of [...(inline ?? []), ...(linked ?? []).filter((x): x is Faq => typeof x === 'object' && !!x)]) {
    const key = f.question.trim().toLowerCase()
    if (!f.question || !f.answer || seen.has(key)) continue
    seen.add(key)
    out.push({ question: f.question, answer: f.answer })
  }
  return out
}

export function RelatedProjects({ projects, locale, portfolioHref }: { projects: Project[]; locale: Locale; portfolioHref?: string | null }) {
  if (!projects.length) return null
  const t = txt[locale]
  return (
    <section className="bg-band py-12">
      <div className="wrap max-w-[1000px]">
        <SectionHeading className="mb-6">{t.projects}</SectionHeading>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {projects.map((p) => {
            const img = mediaUrl(p.cover, 'card')
            const place = [p.objectType, p.city || p.location].filter(Boolean).join(', ')
            return (
              <li key={p.id}>
                <Link href={paths.project(locale, p.slug || '')} className="group block bg-white">
                  {img && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={img} alt={[p.title, place].filter(Boolean).join(' – ')} loading="lazy" width={600} height={450} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-[14.5px] font-extrabold text-ink">{p.title}</h3>
                    {place && <p className="mt-1 text-[13px] text-muted">{place}{p.year ? ` · ${p.year}` : ''}</p>}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
        {portfolioHref && (
          <div className="mt-6 text-center">
            <Link href={portfolioHref} className="btn-dark">
              {t.allProjects}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

/** Inquiry form at the bottom of the page (target of the "Send an inquiry" buttons). */
export async function InquirySection({ locale, settings, defaultService }: { locale: Locale; settings: Setting; defaultService?: string }) {
  const t = txt[locale]
  return (
    <section id={INQUIRY_ANCHOR} className="scroll-mt-24 py-14">
      <div className="wrap">
        <SectionHeading className="mb-3">{t.inquiry}</SectionHeading>
        <p className="mx-auto mb-8 max-w-[560px] text-center text-[14.5px]">{t.inquiryLead}</p>
        <ContactPanel locale={locale} settings={settings} defaultService={defaultService} />
      </div>
    </section>
  )
}
