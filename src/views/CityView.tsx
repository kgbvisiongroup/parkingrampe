import { MapPin, Timer } from 'lucide-react'
import Link from 'next/link'
import type { City, Setting } from '@/payload-types'
import { FaqList } from '@/components/FaqList'
import { JsonLd } from '@/components/JsonLd'
import { CallBand, InquirySection, mergeFaqs, RelatedProjects } from '@/components/ListingSections'
import { RichText } from '@/components/RichText'
import { PageBanner, SectionHeading } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { getPageByTemplate, getRelatedProjects, getServices } from '@/lib/payload'
import { paths } from '@/lib/routes'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'

export function cityHeading(c: Pick<City, 'city' | 'cityIn' | 'heading'>, locale: Locale) {
  if (c.heading?.trim()) return c.heading.trim()
  return locale === 'en' ? `Parking barriers and gate motors in ${c.city}` : `Rampe za parking i motori za kapije u ${c.cityIn?.trim() || c.city}`
}

export function cityTitle(c: Pick<City, 'city'>, locale: Locale) {
  return locale === 'en'
    ? `Parking barriers and gate motors ${c.city} – installation | KGB Automation`
    : `Rampe za parking i motori za kapije ${c.city} – ugradnja | KGB Automation`
}

/** City page (SEO task 7): own text, local projects, areas and questions; no copied text. */
export async function CityView({ city, locale, dict, settings }: { city: City; locale: Locale; dict: Dictionary; settings: Setting }) {
  const selfPath = paths.city(locale, city.slug || '')
  const chosen = (city.projects ?? []).filter((p): p is Exclude<typeof p, number> => typeof p === 'object' && !!p)
  const [services, portfolioPage, cityProjects] = await Promise.all([
    getServices(locale),
    getPageByTemplate(locale, 'portfolio'),
    chosen.length ? Promise.resolve(chosen) : getRelatedProjects(locale, { city: city.city, limit: 6 }).then((list) => list.filter((p) => (p.city ?? '').trim().toLowerCase() === city.city.trim().toLowerCase())),
  ])
  const faqs = mergeFaqs(city.faq)
  const faqLd = faqSchema(faqs)
  const areas = (city.areas ?? '').split('\n').map((a) => a.trim()).filter(Boolean)
  const t =
    locale === 'en'
      ? { areas: 'Areas we cover', travel: 'Travel and installation', services: 'What we install' }
      : { areas: 'Delovi grada i okolina', travel: 'Dolazak i ugradnja', services: 'Šta ugrađujemo' }

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: dict.home, path: `/${locale}` }, { name: city.city, path: selfPath }])} />
      {faqLd && <JsonLd data={faqLd} />}
      <PageBanner title={cityHeading(city, locale)} crumbs={[{ label: dict.home, href: `/${locale}` }, { label: city.city }]} />
      <CallBand locale={locale} settings={settings} />

      {city.intro && (
        <section className="py-12">
          <div className="wrap-narrow text-[15px]">
            <RichText data={city.intro} />
          </div>
        </section>
      )}

      {(areas.length > 0 || city.travelTime) && (
        <section className="bg-band py-12">
          <div className="wrap-narrow grid gap-8 md:grid-cols-2">
            {areas.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-[15px] font-extrabold uppercase tracking-[0.04em]">
                  <MapPin className="size-4 text-accent" aria-hidden />
                  {t.areas}
                </h2>
                <ul className="mt-4 columns-2 gap-6 text-[14.5px]">
                  {areas.map((a) => (
                    <li key={a} className="py-0.5">{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {city.travelTime && (
              <div>
                <h2 className="flex items-center gap-2 text-[15px] font-extrabold uppercase tracking-[0.04em]">
                  <Timer className="size-4 text-accent" aria-hidden />
                  {t.travel}
                </h2>
                <p className="mt-4 text-[14.5px]">{city.travelTime}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="wrap-narrow">
          <SectionHeading className="mb-6">{t.services}</SectionHeading>
          <ul className="grid gap-3 sm:grid-cols-3">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={paths.service(locale, s.slug || '')} className="block h-full border border-line p-4 text-[14.5px] font-extrabold text-ink hover:border-ink">
                  {locale === 'en' ? `${s.title} in ${city.city}` : `${s.title} – ${city.city}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RelatedProjects projects={cityProjects.slice(0, 3)} locale={locale} portfolioHref={portfolioPage?.slug ? paths.page(locale, portfolioPage.slug) : null} />

      {city.body && (
        <section className="py-12">
          <div className="wrap-narrow text-[15px]">
            <RichText data={city.body} />
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="py-12">
          <div className="wrap-narrow">
            <SectionHeading className="mb-6">{dict.faq}</SectionHeading>
            <FaqList items={faqs} />
          </div>
        </section>
      )}

      <CallBand locale={locale} settings={settings} tone="white" />
      <InquirySection locale={locale} settings={settings} />
    </>
  )
}
