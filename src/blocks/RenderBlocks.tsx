import Image from 'next/image'
import Link from 'next/link'
import type {
  BannerBlock,
  CategoryGridBlock,
  ClientsBlock,
  ContactBlock,
  CtaBandBlock,
  Faq,
  FaqBlock,
  HeroBlock,
  ImageTilesBlock,
  IntroBandBlock,
  LinkBoxesBlock,
  MapBlock,
  Product,
  ProductCategory,
  ProductTilesBlock,
  ProjectsBlock,
  RichTextBlock,
  ServicesBlock,
  Setting,
  TextImageBlock,
} from '@/payload-types'
import { ClientLogos } from '@/components/ClientLogos'
import { ContactPanel } from '@/components/ContactPanel'
import { FaqList } from '@/components/FaqList'
import { HeroSlider } from '@/components/HeroSlider'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { Band, CategoryCard, CmsButton, gridCols, PhotoTile, ProductTile, SectionHeading } from '@/components/ui'
import { getDictionary, type Locale } from '@/lib/i18n'
import { linkProps } from '@/lib/links'
import { asMedia, focal, mediaUrl } from '@/lib/media'
import { getCategoryTree, getClients, getHomeFaqs, getProducts, getProjects, getServices } from '@/lib/payload'
import { paths } from '@/lib/routes'
import { faqSchema } from '@/lib/schema'

const cardWidth: Record<string, string> = {
  '2': 'sm:w-[calc(50%-8px)]',
  '3': 'sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]',
  '4': 'sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]',
  '5': 'sm:w-[calc(50%-8px)] lg:w-[calc(20%-13px)]',
}

export type LayoutBlock =
  | HeroBlock
  | IntroBandBlock
  | CategoryGridBlock
  | ProductTilesBlock
  | ImageTilesBlock
  | BannerBlock
  | CtaBandBlock
  | ServicesBlock
  | ProjectsBlock
  | TextImageBlock
  | RichTextBlock
  | FaqBlock
  | ClientsBlock
  | ContactBlock
  | MapBlock
  | LinkBoxesBlock

type Ctx = { locale: Locale; settings: Setting; first: boolean }

const isObj = <T,>(v: number | T | null | undefined): v is T => !!v && typeof v === 'object'

export async function RenderBlocks({ blocks, locale, settings }: { blocks?: LayoutBlock[] | null; locale: Locale; settings: Setting }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((b, i) => (
        <BlockSwitch key={b.id ?? i} block={b} ctx={{ locale, settings, first: i === 0 }} />
      ))}
    </>
  )
}

async function BlockSwitch({ block, ctx }: { block: LayoutBlock; ctx: Ctx }) {
  switch (block.blockType) {
    case 'hero':
      return <Hero block={block} ctx={ctx} />
    case 'introBand':
      return <IntroBand block={block} ctx={ctx} />
    case 'categoryGrid':
      return <CategoryGrid block={block} ctx={ctx} />
    case 'productTiles':
      return <ProductTiles block={block} ctx={ctx} />
    case 'imageTiles':
      return <ImageTiles block={block} ctx={ctx} />
    case 'banner':
      return <Banner block={block} ctx={ctx} />
    case 'ctaBand':
      return <CtaBand block={block} ctx={ctx} />
    case 'services':
      return <Services block={block} ctx={ctx} />
    case 'projects':
      return <Projects block={block} ctx={ctx} />
    case 'textImage':
      return <TextImage block={block} ctx={ctx} />
    case 'richText':
      return <RichTextSection block={block} />
    case 'faq':
      return <FaqSection block={block} ctx={ctx} />
    case 'clients':
      return <ClientsSection block={block} ctx={ctx} />
    case 'contact':
      return <ContactSection block={block} ctx={ctx} />
    case 'linkBoxes':
      return <LinkBoxes block={block} ctx={ctx} />
    case 'map':
      return <MapSection block={block} ctx={ctx} />
    default:
      return null
  }
}

/* ---------- blocks ---------- */

function Hero({ block, ctx }: { block: HeroBlock; ctx: Ctx }) {
  const slides = (block.slides ?? []).map((s) => {
    const p = linkProps(s.link, ctx.locale)
    return {
      image: mediaUrl(s.image, 'hero'),
      alt: asMedia(s.image)?.alt || s.title || '',
      focal: focal(s.image),
      title: s.title,
      subtitle: s.subtitle,
      button: p && p.label ? { href: p.href, label: p.label, target: p.target } : null,
    }
  })
  return <HeroSlider slides={slides} height={block.height ?? 'large'} interval={block.interval ?? 3.5} />
}

function IntroBand({ block, ctx }: { block: IntroBandBlock; ctx: Ctx }) {
  return (
    <Band tone={block.tone ?? 'grey'} className="py-7">
      <div className="wrap flex flex-col items-center gap-3 text-center">
        <p className="max-w-[560px] text-[13.5px] leading-relaxed">{block.text}</p>
        <CmsButton link={block.link} locale={ctx.locale} variant={block.tone === 'dark' ? 'light' : 'dark'} />
      </div>
    </Band>
  )
}

async function CategoryGrid({ block, ctx }: { block: CategoryGridBlock; ctx: Ctx }) {
  let cats: ProductCategory[]
  if (block.source === 'selected') {
    cats = (block.categories ?? []).filter(isObj<ProductCategory>)
  } else {
    cats = await getCategoryTree(ctx.locale)
  }
  if (!cats.length) return null
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="wrap">
        {block.heading && <SectionHeading className="mb-7">{block.heading}</SectionHeading>}
        {/* Flex rows so a last, shorter row stays centred. */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-8">
          {cats.map((c) => (
            <div key={c.id} className={`w-full ${cardWidth[block.columns ?? '4']}`}>
              <CategoryCard category={c} locale={ctx.locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

async function ProductTiles({ block, ctx }: { block: ProductTilesBlock; ctx: Ctx }) {
  let products: Product[]
  const limit = block.limit || 6
  if (block.source === 'selected') {
    products = (block.products ?? []).filter(isObj<Product>).slice(0, limit)
  } else if (block.source === 'category' && block.category) {
    const id = typeof block.category === 'object' ? block.category.id : block.category
    products = await getProducts(ctx.locale, { categoryIds: [id], limit })
  } else {
    products = await getProducts(ctx.locale, { featured: true, limit })
  }
  if (!products.length) return null
  return (
    <Band tone={block.tone ?? 'grey'} className="py-10 md:py-12">
      <div className="wrap max-w-[1000px]">
        {block.heading && <SectionHeading className="mb-6">{block.heading}</SectionHeading>}
        <div className={`grid grid-cols-1 gap-3 ${gridCols[block.columns ?? '3']}`}>
          {products.map((p) => (
            <ProductTile key={p.id} product={p} locale={ctx.locale} />
          ))}
        </div>
      </div>
    </Band>
  )
}

function ImageTiles({ block, ctx }: { block: ImageTilesBlock; ctx: Ctx }) {
  if (!block.tiles?.length) return null
  return (
    <section className="bg-band py-10 md:py-12">
      <div className="wrap max-w-[1000px]">
        {block.heading && <SectionHeading className="mb-6">{block.heading}</SectionHeading>}
        <div className={`grid grid-cols-1 gap-2.5 ${gridCols[block.columns ?? '3']}`}>
          {block.tiles.map((t, i) => {
            const p = linkProps(t.link, ctx.locale)
            return <PhotoTile key={t.id ?? i} image={t.image} title={t.title} href={p?.href} target={p?.target} />
          })}
        </div>
      </div>
    </section>
  )
}

function Banner({ block, ctx }: { block: BannerBlock; ctx: Ctx }) {
  const src = mediaUrl(block.image, 'hero')
  const button = linkProps(block.link, ctx.locale)
  return (
    <section>
      <div className="relative isolate flex h-[46vh] min-h-[300px] items-center justify-center overflow-hidden bg-dark">
        {src && (
          <Image
            src={src}
            alt={asMedia(block.image)?.alt || block.title || ''}
            fill
            sizes="100vw"
            className="-z-10 object-cover"
            style={{ objectPosition: focal(block.image) }}
          />
        )}
        <div className="absolute inset-0 -z-10 bg-black/20" />
        {(block.title || block.subtitle) && (
          <div className="px-5 text-center text-white">
            {block.title && (
              <p className="text-[clamp(40px,8vw,96px)] font-extrabold uppercase leading-none tracking-[0.02em] text-white/90 text-shadow">{block.title}</p>
            )}
            {block.subtitle && (
              <p className="mt-2 text-[clamp(16px,2.6vw,30px)] font-bold uppercase tracking-[0.5em] text-white/85 text-shadow">{block.subtitle}</p>
            )}
          </div>
        )}
      </div>
      {button?.label && (
        <div className="bg-band py-4 text-center">
          <Link href={button.href} target={button.target} className="btn-dark px-10">
            {button.label}
          </Link>
        </div>
      )}
    </section>
  )
}

function CtaBand({ block, ctx }: { block: CtaBandBlock; ctx: Ctx }) {
  return (
    <Band tone={block.tone ?? 'grey'} className="border-y-[8px] border-white py-8">
      <div className="wrap flex flex-col items-center gap-3 text-center">
        <p className="max-w-[520px] text-[13.5px] leading-relaxed">{block.text}</p>
        <CmsButton link={block.link} locale={ctx.locale} variant={block.tone === 'dark' ? 'light' : 'dark'} />
      </div>
    </Band>
  )
}

async function Services({ block, ctx }: { block: ServicesBlock; ctx: Ctx }) {
  const services = await getServices(ctx.locale)
  if (!services.length) return null
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="wrap">
        {block.heading && <SectionHeading>{block.heading}</SectionHeading>}
        {block.intro && <p className="mx-auto mt-3 max-w-[560px] text-center text-[13.5px]">{block.intro}</p>}
        <div className="mt-7 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const src = mediaUrl(s.heroImage, 'card')
            return (
              <Link key={s.id} href={paths.service(ctx.locale, s.slug || '')} className="tile-zoom group block">
                <div className="relative aspect-[16/10] overflow-hidden bg-band">
                  {src && (
                    <Image
                      src={src}
                      alt={asMedia(s.heroImage)?.alt || s.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: focal(s.heroImage) }}
                    />
                  )}
                  {s.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-white">{s.badge}</span>
                  )}
                </div>
                <h3 className="mt-3 px-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink group-hover:underline group-hover:underline-offset-4">
                  {s.title}
                </h3>
                <p className="mt-1 px-2 text-[13px] leading-snug text-muted">{s.tagline}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

async function Projects({ block, ctx }: { block: ProjectsBlock; ctx: Ctx }) {
  const projects = await getProjects(ctx.locale, block.limit || 6)
  if (!projects.length) return null
  return (
    <section className="bg-band py-10 md:py-12">
      <div className="wrap max-w-[1000px]">
        {block.heading && <SectionHeading className="mb-6">{block.heading}</SectionHeading>}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <PhotoTile key={p.id} image={p.cover} title={p.location || p.title} href={paths.project(ctx.locale, p.slug || '')} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <CmsButton link={block.link} locale={ctx.locale} />
        </div>
      </div>
    </section>
  )
}

function TextImage({ block, ctx }: { block: TextImageBlock; ctx: Ctx }) {
  const src = mediaUrl(block.image, 'card')
  const left = block.imagePosition === 'left'
  return (
    <Band tone={block.tone} className="py-12 md:py-16">
      <div className="wrap grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className={`relative aspect-[4/3] overflow-hidden bg-band ${left ? '' : 'md:order-2'}`}>
          {src && (
            <Image
              src={src}
              alt={asMedia(block.image)?.alt || block.heading || ''}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: focal(block.image) }}
            />
          )}
        </div>
        <div>
          {block.heading && <h2 className="text-[20px] font-extrabold uppercase tracking-[0.04em]">{block.heading}</h2>}
          <RichText data={block.text} className="mt-4 text-[14.5px]" invert={block.tone === 'dark'} />
          <div className="mt-6">
            <CmsButton link={block.link} locale={ctx.locale} variant={block.tone === 'dark' ? 'light' : 'dark'} />
          </div>
        </div>
      </div>
    </Band>
  )
}

function RichTextSection({ block }: { block: RichTextBlock }) {
  return (
    <Band tone={block.tone} className="py-12 md:py-14">
      <div className={`wrap-narrow ${block.align === 'center' ? 'text-center' : ''}`}>
        {block.heading && <SectionHeading className={`mb-5 ${block.align === 'center' ? '' : '!text-left'}`}>{block.heading}</SectionHeading>}
        <RichText data={block.content} invert={block.tone === 'dark'} />
      </div>
    </Band>
  )
}

async function FaqSection({ block, ctx }: { block: FaqBlock; ctx: Ctx }) {
  const faqs = block.source === 'selected' ? (block.faqs ?? []).filter(isObj<Faq>) : await getHomeFaqs(ctx.locale)
  if (!faqs.length) return null
  const ld = faqSchema(faqs)
  return (
    <section className="bg-white py-12 md:py-14">
      {ld && <JsonLd data={ld} />}
      <div className="wrap-narrow">
        {block.heading && <SectionHeading className="mb-6">{block.heading}</SectionHeading>}
        <FaqList items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      </div>
    </section>
  )
}

async function ClientsSection({ block, ctx }: { block: ClientsBlock; ctx: Ctx }) {
  const clients = await getClients()
  return <ClientLogos heading={block.heading || getDictionary(ctx.locale).clients} clients={clients} />
}

function ContactSection({ block, ctx }: { block: ContactBlock; ctx: Ctx }) {
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="wrap">
        {block.heading && <SectionHeading className="mb-3">{block.heading}</SectionHeading>}
        {block.text && <p className="mx-auto mb-8 max-w-[560px] text-center text-[14px]">{block.text}</p>}
        <ContactPanel locale={ctx.locale} settings={ctx.settings} />
      </div>
    </section>
  )
}

function MapSection({ block, ctx }: { block: MapBlock; ctx: Ctx }) {
  const url = block.embedUrl || ctx.settings.mapEmbedUrl
  if (!url) return null
  return (
    <section>
      {block.heading && (
        <div className="bg-dark py-3.5">
          <h2 className="h-section !text-white">{block.heading}</h2>
        </div>
      )}
      <iframe
        title={block.heading || ctx.settings.address || 'Mapa'}
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full border-0"
        style={{ height: block.height || 440 }}
      />
    </section>
  )
}

function LinkBoxes({ block, ctx }: { block: LinkBoxesBlock; ctx: Ctx }) {
  if (!block.items?.length) return null
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="wrap max-w-[1000px]">
        {block.heading && <SectionHeading className="mb-6">{block.heading}</SectionHeading>}
        <ul className="flex flex-wrap justify-center border-l border-t border-line">
          {block.items.map((it, i) => {
            const p = linkProps(it.link, ctx.locale)
            const body = (
              <>
                <span className="block text-[13px] font-extrabold text-ink">{it.title}</span>
                {it.text && <span className="mt-1 block text-[12.5px] leading-snug text-muted">{it.text}</span>}
              </>
            )
            return (
              <li key={it.id ?? i} className="w-1/2 border-b border-r border-line text-center sm:w-1/3 lg:flex-1">
                {p?.href ? (
                  <Link href={p.href} target={p.target} className="block h-full px-4 py-5 transition-colors hover:bg-band">
                    {body}
                  </Link>
                ) : (
                  <div className="px-4 py-5">{body}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
