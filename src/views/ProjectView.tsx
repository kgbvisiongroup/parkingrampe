import Link from 'next/link'
import type { Page, Project, Setting } from '@/payload-types'
import { Gallery } from '@/components/Gallery'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { PageBanner } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { asMedia, mediaUrl } from '@/lib/media'
import { paths } from '@/lib/routes'
import { breadcrumbSchema } from '@/lib/schema'

type Props = { project: Project; locale: Locale; dict: Dictionary; settings: Setting; contactHref: string; portfolioPage: Page | null }

export function ProjectView({ project, locale, dict, contactHref, portfolioPage }: Props) {
  const service = typeof project.service === 'object' ? project.service : null
  const portfolioPath = portfolioPage?.slug ? paths.page(locale, portfolioPage.slug) : undefined
  const images = [project.cover, ...(project.gallery ?? [])]
    .map((g) => asMedia(g))
    .filter((m, i, arr): m is NonNullable<typeof m> => !!m?.url && arr.findIndex((x) => x?.id === m.id) === i)
    .map((m) => ({
      src: mediaUrl(m, 'card')!,
      full: mediaUrl(m, 'hero')!,
      alt: m.alt || project.title,
      width: m.sizes?.card?.width ?? m.width,
      height: m.sizes?.card?.height ?? m.height,
    }))

  const facts = [
    service && { label: dict.service, value: service.title, href: service.slug ? paths.service(locale, service.slug) : undefined },
    project.location && { label: dict.location, value: project.location },
    project.year && { label: dict.year, value: String(project.year) },
  ].filter(Boolean) as { label: string; value: string; href?: string }[]

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
      {images.length > 0 && (
        <section className="pb-14 pt-4">
          <div className="wrap max-w-[1000px]">
            <Gallery images={images} closeLabel={dict.close} />
          </div>
        </section>
      )}
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
