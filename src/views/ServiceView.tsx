import { FileDown, MessageCircle, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Faq, Service, Setting } from '@/payload-types'
import { RenderBlocks, type LayoutBlock } from '@/blocks/RenderBlocks'
import { FaqList } from '@/components/FaqList'
import { Gallery } from '@/components/Gallery'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { OpenChatButton } from '@/components/OpenChatButton'
import { RichText } from '@/components/RichText'
import { PageBanner, PhotoTile, ProductTile, SectionHeading } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { asMedia, focal, mediaUrl } from '@/lib/media'
import { getChildCategories, getProducts, getProjects } from '@/lib/payload'
import { absolute, paths } from '@/lib/routes'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'

type Props = {
  service: Service
  locale: Locale
  dict: Dictionary
  settings: Setting
  contactHref: string
  servicesHref?: string | null
}

export async function ServiceView({ service, locale, dict, settings, contactHref, servicesHref }: Props) {
  const selfPath = paths.service(locale, service.slug || '')
  const faqs = (service.faqs ?? []).filter((f): f is Faq => typeof f === 'object' && !!f)
  const brochure = asMedia(service.brochure)
  const catId = typeof service.productCategory === 'object' ? service.productCategory?.id : service.productCategory
  const category = typeof service.productCategory === 'object' ? service.productCategory : null

  const [products, projects] = await Promise.all([
    catId
      ? getChildCategories(locale, catId).then((kids) => getProducts(locale, { categoryIds: [catId, ...kids.map((k) => k.id)], limit: 8 }))
      : Promise.resolve([]),
    getProjects(locale, 100).then((all) =>
      all.filter((p) => (typeof p.service === 'object' ? p.service?.id : p.service) === service.id).slice(0, 6),
    ),
  ])

  const gallery = (service.gallery ?? [])
    .map((g) => asMedia(g))
    .filter((m): m is NonNullable<typeof m> => !!m?.url)
    .map((m) => ({
      src: mediaUrl(m, 'card')!,
      full: mediaUrl(m, 'hero')!,
      alt: m.alt || service.title,
      width: m.sizes?.card?.width ?? m.width,
      height: m.sizes?.card?.height ?? m.height,
    }))

  const faqLd = faqSchema(faqs)
  const heroImg = mediaUrl(service.heroImage, 'og')

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: dict.home, path: `/${locale}` }, { name: service.title, path: selfPath }])} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.tagline,
          image: heroImg ? absolute(heroImg) : undefined,
          url: absolute(selfPath),
          areaServed: { '@type': 'Country', name: 'Serbia' },
          provider: { '@id': absolute('/#business') },
        }}
      />
      {faqLd && <JsonLd data={faqLd} />}

      <PageBanner
        title={service.title}
        lead={service.tagline}
        image={service.heroImage}
        crumbs={[{ label: dict.home, href: `/${locale}` }, { label: dict.services, href: servicesHref || undefined }, { label: service.title }]}
      />

      {/* Quick actions band */}
      <section className="bg-band py-5">
        <div className="wrap flex flex-wrap items-center justify-center gap-3">
          <Link href={contactHref} className="btn-accent btn-accent-lg">
            {dict.requestQuote}
          </Link>
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="btn-dark px-5 py-3">
              <Phone className="size-4" aria-hidden />
              {settings.phoneDisplay || settings.phone}
            </a>
          )}
          {settings.chat?.enabled !== false && (
            <OpenChatButton className="btn-dark px-5 py-3">
              <MessageCircle className="size-4" aria-hidden />
              {dict.askAboutProduct}
            </OpenChatButton>
          )}
        </div>
      </section>

      {(service.introHeading || service.intro) && (
        <section className="py-12 md:py-14">
          <div className="wrap-narrow text-center">
            {service.introHeading && <SectionHeading className="mb-5">{service.introHeading}</SectionHeading>}
            <RichText data={service.intro} className="text-[15px]" />
          </div>
        </section>
      )}

      {!!service.features?.length && (
        <section className="bg-dark py-12 text-white">
          <ul className="wrap grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {service.features.map((f) => (
              <li key={f.id} className="text-center">
                <Icon name={f.icon} className="mx-auto size-8 text-white" />
                <h3 className="mt-4 text-[13px] font-extrabold uppercase tracking-[0.05em] text-white">{f.title}</h3>
                {f.text && <p className="mx-auto mt-2 max-w-[240px] text-[13.5px] text-white/65">{f.text}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(service.whyHeading || service.why) && (
        <section className="py-12 md:py-16">
          <div className="wrap grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div>
              {service.whyHeading && <h2 className="text-[20px] font-extrabold uppercase tracking-[0.04em]">{service.whyHeading}</h2>}
              <RichText data={service.why} className="mt-4 text-[14.5px]" />
              {brochure?.url && (
                <a href={brochure.url} target="_blank" rel="noopener" className="btn-dark mt-6">
                  <FileDown className="size-4" aria-hidden />
                  {dict.downloadBrochure}
                </a>
              )}
            </div>
            {service.whyImage && (
              <div className="relative aspect-[4/3] overflow-hidden bg-band">
                <Image
                  src={mediaUrl(service.whyImage, 'card') || ''}
                  alt={asMedia(service.whyImage)?.alt || service.whyHeading || service.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: focal(service.whyImage) }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="bg-band py-12">
          <div className="wrap max-w-[1000px]">
            <SectionHeading className="mb-6">{dict.products}</SectionHeading>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
              {products.map((p) => (
                <ProductTile key={p.id} product={p} locale={locale} />
              ))}
            </div>
            {category?.slug && (
              <div className="mt-6 text-center">
                <Link href={paths.catalogItem(locale, category.slug)} className="btn-dark">
                  {category.title}
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="py-12">
          <div className="wrap max-w-[1000px]">
            <SectionHeading className="mb-6">{dict.relatedProjects}</SectionHeading>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-3">
              {projects.map((p) => (
                <PhotoTile key={p.id} image={p.cover} title={p.location || p.title} href={paths.project(locale, p.slug || '')} />
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="bg-band py-12">
          <div className="wrap max-w-[1000px]">
            <SectionHeading className="mb-6">{dict.gallery}</SectionHeading>
            <Gallery images={gallery} closeLabel={dict.close} />
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="py-12">
          <div className="wrap-narrow">
            <SectionHeading className="mb-6">{dict.faq}</SectionHeading>
            <FaqList items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </section>
      )}

      <RenderBlocks blocks={service.layout as LayoutBlock[] | undefined} locale={locale} settings={settings} />
    </>
  )
}
