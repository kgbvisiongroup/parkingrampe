import { FileDown, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Service, Setting } from '@/payload-types'
import { RenderBlocks, type LayoutBlock } from '@/blocks/RenderBlocks'
import { FaqList } from '@/components/FaqList'
import { CallBand, Guide, InquirySection, mergeFaqs, PriceTable, RelatedProjects } from '@/components/ListingSections'
import { Gallery } from '@/components/Gallery'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { OpenChatButton } from '@/components/OpenChatButton'
import { PhonePromo } from '@/components/PhonePromo'
import { RichText } from '@/components/RichText'
import { PageBanner, ProductTile, SectionHeading } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { asMedia, focal, mediaUrl } from '@/lib/media'
import { getAllSlugs, getChildCategories, getPageByTemplate, getProductBySlug, getProducts, getReadyCities, getRelatedProjects } from '@/lib/payload'
import { absolute, paths } from '@/lib/routes'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'
import { listingHeading } from '@/lib/seoTitles'

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
  const faqs = mergeFaqs(service.faq, service.faqs)
  const brochure = asMedia(service.brochure)
  const catId = typeof service.productCategory === 'object' ? service.productCategory?.id : service.productCategory
  const category = typeof service.productCategory === 'object' ? service.productCategory : null

  const [products, slugs, portfolioPage] = await Promise.all([
    catId
      ? getChildCategories(locale, catId).then((kids) => getProducts(locale, { categoryIds: [catId, ...kids.map((k) => k.id)], limit: 8 }))
      : Promise.resolve([]),
    getAllSlugs('services', service.id),
    getPageByTemplate(locale, 'portfolio'),
  ])
  const [projects, cities] = await Promise.all([
    getRelatedProjects(locale, { serviceIds: [service.id], productIds: products.map((p) => p.id), fill: true }),
    getReadyCities(locale),
  ])
  // Access control: the gallery ends with a tile promoting opening from the phone (KUBEW module).
  const kubew = slugs.sr === 'kontrola-pristupa' ? await getProductBySlug(locale, 'kubew') : null
  // …and KUBEW completes the last row of the product tiles when it is not full.
  const tiles = kubew && products.length % 3 !== 0 && !products.some((p) => p.id === kubew.id) ? [...products, kubew] : products

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
        title={listingHeading({ title: service.title, keyword: service.keyword, heading: service.heading }, locale)}
        lead={service.tagline}
        image={service.heroImage}
        crumbs={[{ label: dict.home, href: `/${locale}` }, { label: dict.services, href: servicesHref || undefined }, { label: service.title }]}
      />

      {/* Call and inquiry near the top */}
      <CallBand locale={locale} settings={settings}>
        {settings.chat?.enabled !== false && (
          <OpenChatButton className="btn-dark px-5 py-3">
            <MessageCircle className="size-4" aria-hidden />
            {dict.askAboutProduct}
          </OpenChatButton>
        )}
      </CallBand>

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
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {tiles.map((p) => (
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

      <PriceTable rows={service.priceTable} locale={locale} />
      <Guide data={service.guide} />

      {gallery.length > 0 && (
        <section className="bg-band py-12">
          <div className="wrap max-w-[1000px]">
            <SectionHeading className="mb-6">{dict.gallery}</SectionHeading>
            <Gallery
              images={gallery}
              closeLabel={dict.close}
              layout="grid"
              extra={kubew ? <PhonePromo locale={locale} href={paths.catalogItem(locale, kubew.slug || 'kubew')} image={mediaUrl(kubew.images?.[0], 'thumb')} /> : undefined}
            />
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

      <RelatedProjects projects={projects} locale={locale} portfolioHref={portfolioPage?.slug ? paths.page(locale, portfolioPage.slug) : null} />

      <RenderBlocks blocks={service.layout as LayoutBlock[] | undefined} locale={locale} settings={settings} />

      {cities.length > 0 && (
        <section className="py-10">
          <div className="wrap-narrow text-center">
            <h2 className="label-caps text-muted">{locale === 'en' ? 'Where we install' : 'Gde ugrađujemo'}</h2>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {cities.map((c) => (
                <li key={c.id}>
                  <Link href={paths.city(locale, c.slug || '')} className="inline-block border border-line px-4 py-2 text-[13.5px] font-bold text-ink hover:border-ink">
                    {locale === 'en' ? `${service.title} – ${c.city}` : `${service.title} ${c.city}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CallBand locale={locale} settings={settings} tone="white" />
      <InquirySection locale={locale} settings={settings} defaultService={service.title} />
    </>
  )
}
