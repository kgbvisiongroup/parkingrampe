import type { Page, Setting } from '@/payload-types'
import { RenderBlocks, type LayoutBlock } from '@/blocks/RenderBlocks'
import { ContactPanel } from '@/components/ContactPanel'
import { JsonLd } from '@/components/JsonLd'
import { PortfolioGrid } from '@/components/PortfolioGrid'
import { PortfolioSlider } from '@/components/PortfolioSlider'
import { RichText } from '@/components/RichText'
import { PageBanner, SectionHeading } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { asMedia, focal, mediaUrl } from '@/lib/media'
import { getProjects, getServices } from '@/lib/payload'
import { paths } from '@/lib/routes'
import { breadcrumbSchema } from '@/lib/schema'
import { CatalogView } from './CatalogViews'

type Props = { page: Page; locale: Locale; dict: Dictionary; settings: Setting; contactHref: string }

export async function PageView({ page, locale, dict, settings }: Props) {
  if (page.template === 'products') return <CatalogView locale={locale} dict={dict} settings={settings} page={page} />

  const crumbs = [{ label: dict.home, href: `/${locale}` }, { label: page.title }]
  const blocks = <RenderBlocks blocks={page.layout as LayoutBlock[] | undefined} locale={locale} settings={settings} />
  const head = (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.home, path: `/${locale}` },
          { name: page.title, path: paths.page(locale, page.slug || '') },
        ])}
      />
      <PageBanner title={page.title} lead={page.lead} image={page.heroImage} crumbs={crumbs} />
    </>
  )
  const intro = page.content ? (
    <section className="py-10 md:py-12">
      <div className="wrap-narrow text-center text-[15px]">
        <RichText data={page.content} />
      </div>
    </section>
  ) : null

  if (page.template === 'contact') {
    return (
      <>
        {head}
        {intro}
        <section className={`pb-14 ${intro ? '' : 'pt-12'}`}>
          <div className="wrap">
            <ContactPanel locale={locale} settings={settings} />
          </div>
        </section>
        {blocks}
      </>
    )
  }

  if (page.template === 'portfolio') {
    const [projects, services] = await Promise.all([getProjects(locale), getServices(locale)])
    const used = new Set(projects.map((p) => (typeof p.service === 'object' ? p.service?.id : p.service)))
    // Slider photos: the page's photo galleries, otherwise the project covers.
    const galleryPhotos = (page.layout ?? []).flatMap((b) => (b.blockType === 'mediaGallery' ? (b.images ?? []) : []))
    const slides = (galleryPhotos.length ? galleryPhotos : projects.map((p) => p.cover))
      .map((m) => asMedia(m))
      .filter((m): m is NonNullable<typeof m> => !!m?.url && !!m.mimeType?.startsWith('image'))
      .slice(0, 24)
      .map((m) => ({ src: mediaUrl(m, 'hero')!, alt: m.alt || page.title }))
    return (
      <>
        {head}
        <PortfolioSlider images={slides} prevLabel={locale === 'en' ? 'Previous' : 'Prethodna'} nextLabel={locale === 'en' ? 'Next' : 'Sledeća'} />
        {intro}
        <section className={`bg-band py-12 ${intro ? '' : ''}`}>
          <div className="wrap max-w-[1000px]">
            <PortfolioGrid
              allLabel={dict.all}
              filters={services.filter((s) => used.has(s.id)).map((s) => ({ id: s.id, title: s.title }))}
              items={projects.map((p) => {
                const svc = typeof p.service === 'object' ? p.service : null
                return {
                  id: p.id,
                  title: p.title,
                  href: paths.project(locale, p.slug || String(p.id)),
                  image: mediaUrl(p.cover, 'card'),
                  alt: asMedia(p.cover)?.alt || p.title,
                  focal: focal(p.cover),
                  serviceId: svc?.id ?? (typeof p.service === 'number' ? p.service : null),
                  serviceTitle: svc?.title,
                  location: p.location,
                }
              })}
            />
          </div>
        </section>
        {blocks}
      </>
    )
  }

  if (page.template === 'services') {
    return (
      <>
        {head}
        {intro}
        <RenderBlocks
          blocks={[{ blockType: 'services', heading: null, intro: null } as LayoutBlock]}
          locale={locale}
          settings={settings}
        />
        {blocks}
      </>
    )
  }

  if (page.template === 'about') {
    const company = [
      settings.legalName && { label: locale === 'sr' ? 'Naziv firme' : 'Company', value: settings.legalName },
      settings.address && { label: dict.address, value: settings.address },
      settings.pib && { label: 'PIB', value: settings.pib },
      settings.mb && { label: locale === 'sr' ? 'Matični broj' : 'Reg. number', value: settings.mb },
      settings.activityCode && { label: locale === 'sr' ? 'Šifra delatnosti' : 'Activity code', value: settings.activityCode },
      settings.bankAccount && { label: locale === 'sr' ? 'Tekući račun' : 'Bank account', value: settings.bankAccount },
    ].filter(Boolean) as { label: string; value: string }[]

    return (
      <>
        {head}
        {!!page.highlights?.length && (
          <section className="bg-dark text-white">
            <ul className="wrap grid grid-cols-2 gap-y-6 py-9 text-center md:grid-cols-4">
              {page.highlights.map((h) => (
                <li key={h.id}>
                  <span className="block text-[32px] font-extrabold">{h.value}</span>
                  <span className="label-caps mt-1 block text-white/60">{h.label}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="py-12 md:py-14">
          <div className="wrap grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-14">
            <RichText data={page.content} className="text-[15px]" />
            {company.length > 0 && (
              <div>
                <SectionHeading className="mb-4 !text-left">{settings.siteName}</SectionHeading>
                <dl className="divide-y divide-line border-y border-line text-[14px]">
                  {company.map((c) => (
                    <div key={c.label} className="py-3">
                      <dt className="label-caps text-muted">{c.label}</dt>
                      <dd className="mt-0.5 font-bold text-ink">{c.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
        {blocks}
      </>
    )
  }

  return (
    <>
      {head}
      {intro}
      {blocks}
    </>
  )
}
