import type { Page, Setting } from '@/payload-types'
import { RenderBlocks, type LayoutBlock } from '@/blocks/RenderBlocks'
import { ContactPanel } from '@/components/ContactPanel'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { PageBanner, SectionHeading } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
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
    return (
      <>
        {head}
        {intro}
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
