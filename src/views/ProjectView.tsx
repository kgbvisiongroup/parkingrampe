import Link from 'next/link'
import type { Page, Product, Project, Setting } from '@/payload-types'
import { Gallery } from '@/components/Gallery'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { PageBanner, ProductTile, SectionHeading } from '@/components/ui'
import { RelatedProjects } from '@/components/ListingSections'
import { getRelatedProjects } from '@/lib/payload'
import { projectAlt } from '@/lib/projectText'
import type { Dictionary, Locale } from '@/lib/i18n'
import { asMedia, mediaUrl } from '@/lib/media'
import { paths } from '@/lib/routes'
import { breadcrumbSchema } from '@/lib/schema'

type Props = { project: Project; locale: Locale; dict: Dictionary; settings: Setting; contactHref: string; portfolioPage: Page | null }

export async function ProjectView({ project, locale, dict, contactHref, portfolioPage }: Props) {
  const service = typeof project.service === 'object' ? project.service : null
  const portfolioPath = portfolioPage?.slug ? paths.page(locale, portfolioPage.slug) : undefined
  const images = [project.cover, ...(project.gallery ?? [])]
    .map((g) => asMedia(g))
    .filter((m, i, arr): m is NonNullable<typeof m> => !!m?.url && arr.findIndex((x) => x?.id === m.id) === i)
    .map((m) => ({
      src: mediaUrl(m, 'card')!,
      full: mediaUrl(m, 'hero')!,
      alt: projectAlt(project, m.alt),
      width: m.sizes?.card?.width ?? m.width,
      height: m.sizes?.card?.height ?? m.height,
    }))

  const t = locale === 'en'
    ? { city: 'City', type: 'Type of site', client: 'Client', equipment: 'Installed equipment', similar: 'Similar projects' }
    : { city: 'Grad', type: 'Tip objekta', client: 'Klijent', equipment: 'Ugrađena oprema', similar: 'Slični projekti' }
  const facts = [
    service && { label: dict.service, value: service.title, href: service.slug ? paths.service(locale, service.slug) : undefined },
    project.objectType && { label: t.type, value: project.objectType },
    project.city && { label: t.city, value: project.city },
    project.location && { label: dict.location, value: project.location },
    project.client && { label: t.client, value: project.client },
    project.year && { label: dict.year, value: String(project.year) },
  ].filter(Boolean) as { label: string; value: string; href?: string }[]
  const equipment = (project.equipment ?? []).filter((e): e is Product => typeof e === 'object' && !!e)
  const similar = (
    await getRelatedProjects(locale, {
      serviceIds: service ? [service.id] : [],
      productIds: equipment.map((e) => e.id),
      city: project.city ?? undefined,
      limit: 4,
    })
  )
    .filter((p) => p.id !== project.id)
    .slice(0, 3)

  const crumbs = [
    { label: dict.home, href: `/${locale}` },
    ...(portfolioPath ? [{ label: portfolioPage!.title, href: portfolioPath }] : []),
    { label: project.title },
  ]

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.label, path: c.href ?? paths.project(locale, project.slug || '') })))} />
      <PageBanner title={project.title} lead={project.summary} image={project.cover} crumbs={crumbs} />
      {facts.length > 0 && (
        <section className="bg-band">
          <dl className="wrap flex flex-wrap justify-center gap-x-12 gap-y-3 py-5 text-center">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="label-caps text-muted">{f.label}</dt>
                <dd className="mt-0.5 font-bold text-ink">
                  {f.href ? (
                    <Link href={f.href} className="hover:underline">
                      {f.value}
                    </Link>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {project.body && (
        <section className="py-12">
          <div className="wrap-narrow text-[15px]">
            <RichText data={project.body} />
          </div>
        </section>
      )}
      {equipment.length > 0 && (
        <section className="bg-band py-12">
          <div className="wrap max-w-[1000px]">
            <SectionHeading className="mb-6">{t.equipment}</SectionHeading>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-4">
              {equipment.map((p) => (
                <ProductTile key={p.id} product={p} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
      {images.length > 0 && (
        <section className="pb-14 pt-12">
          <div className="wrap max-w-[1000px]">
            <Gallery images={images} closeLabel={dict.close} />
          </div>
        </section>
      )}
      {similar.length > 0 && <RelatedProjects projects={similar} locale={locale} portfolioHref={portfolioPath} heading={t.similar} />}
      <section className="border-y-[8px] border-white bg-band py-8">
        <div className="wrap flex flex-col items-center gap-3 text-center">
          <p className="max-w-[520px] text-[13.5px]">{dict.faqAside}</p>
          <Link href={contactHref} className="btn-dark">
            {dict.requestQuote}
          </Link>
        </div>
      </section>
    </>
  )
}
