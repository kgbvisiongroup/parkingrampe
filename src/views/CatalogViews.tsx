import { Download, FileText } from 'lucide-react'
import Link from 'next/link'
import type { Page, Product, ProductCategory, Setting } from '@/payload-types'
import { RenderBlocks, type LayoutBlock } from '@/blocks/RenderBlocks'
import { JsonLd } from '@/components/JsonLd'
import { ProductGallery } from '@/components/ProductGallery'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, CategoryCard, type Crumb, PageBanner, ProductCard, productName, ProductTile, SectionHeading } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { asMedia, mediaUrl } from '@/lib/media'
import { getCategoryTree, getChildCategories, getProducts } from '@/lib/payload'
import { absolute, paths } from '@/lib/routes'
import { breadcrumbSchema } from '@/lib/schema'

type Base = { locale: Locale; dict: Dictionary; settings: Setting }

/** YouTube video id from a watch, share or embed link. */
function youtubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return m?.[1] ?? null
}

const catOf = (c: ProductCategory['parent'] | Product['category']) => (c && typeof c === 'object' ? c : null)

/* ---------- /proizvodi ---------- */

export async function CatalogView({ locale, dict, settings, page }: Base & { page: Page | null }) {
  const tree = await getCategoryTree(locale)
  const title = page?.title || dict.catalog
  return (
    <>
      <PageBanner title={title} lead={page?.lead} image={page?.heroImage} crumbs={[{ label: dict.home, href: `/${locale}` }, { label: title }]} />
      {page?.content && (
        <section className="py-10">
          <div className="wrap-narrow text-center">
            <RichText data={page.content} />
          </div>
        </section>
      )}
      {tree.map((cat, i) => (
        <section key={cat.id} className={`py-12 ${i % 2 ? 'bg-band' : 'bg-white'}`}>
          <div className="wrap">
            <SectionHeading className="mb-2">
              <Link href={paths.catalogItem(locale, cat.slug || '')} className="hover:underline hover:underline-offset-4">
                {cat.title}
              </Link>
            </SectionHeading>
            {cat.description && <p className="mx-auto mb-7 max-w-[560px] text-center text-[13.5px]">{cat.description}</p>}
            {cat.children.length > 0 ? (
              <div className="grid grid-cols-3 gap-x-2.5 gap-y-5 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4">
                {cat.children.map((c) => (
                  <CategoryCard key={c.id} category={c} locale={locale} />
                ))}
              </div>
            ) : (
              <CategoryProducts locale={locale} categoryIds={[cat.id]} />
            )}
          </div>
        </section>
      ))}
      <RenderBlocks blocks={page?.layout as LayoutBlock[] | undefined} locale={locale} settings={settings} />
    </>
  )
}

async function CategoryProducts({ locale, categoryIds, emptyText }: { locale: Locale; categoryIds: number[]; emptyText?: string }) {
  const products = await getProducts(locale, { categoryIds })
  if (!products.length) return emptyText ? <p className="py-6 text-center text-muted">{emptyText}</p> : null
  return (
    <div className="grid grid-cols-3 gap-x-2.5 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} />
      ))}
    </div>
  )
}

/* ---------- category ---------- */

export async function CategoryView({ locale, dict, category }: Base & { category: ProductCategory }) {
  const [children, tree] = await Promise.all([getChildCategories(locale, category.id), getCategoryTree(locale)])
  const parent = catOf(category.parent)
  const crumbs: Crumb[] = [
    { label: dict.home, href: `/${locale}` },
    { label: dict.catalog, href: paths.catalog(locale) },
    ...(parent ? [{ label: parent.title, href: paths.catalogItem(locale, parent.slug || '') }] : []),
    { label: category.title },
  ]
  // Sibling tabs: the parent's children, or the top-level categories.
  const siblings = parent ? tree.find((t) => t.id === parent.id)?.children ?? [] : tree
  const ids = [category.id, ...children.map((c) => c.id)]

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.label, path: c.href ?? paths.catalogItem(locale, category.slug || '') })))} />
      <PageBanner
        title={category.title}
        lead={category.description}
        // Product packshots are not used as a banner photo; the parent category photo is used instead.
        image={category.imageFit === 'contain' ? (parent && parent.imageFit !== 'contain' ? parent.image : null) : category.image}
        crumbs={crumbs}
      />
      {siblings.length > 1 && (
        <nav aria-label={dict.categories} className="border-b border-line bg-white">
          <ul className="wrap flex gap-1 overflow-x-auto py-2">
            {siblings.map((s) => (
              <li key={s.id} className="shrink-0">
                <Link
                  href={paths.catalogItem(locale, s.slug || '')}
                  className={`block px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.05em] ${s.id === category.id ? 'bg-dark text-white' : 'text-ink hover:bg-band'}`}
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {category.content && (
        <section className="pt-10">
          <div className="wrap-narrow text-center text-[14.5px]">
            <RichText data={category.content} />
          </div>
        </section>
      )}
      {children.length > 0 && (
        <section className="py-12">
          <div className="wrap">
            <SectionHeading className="mb-7">{dict.subcategories}</SectionHeading>
            <div className="grid grid-cols-3 gap-x-2.5 gap-y-5 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4">
              {children.map((c) => (
                <CategoryCard key={c.id} category={c} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
      <section className={`py-12 ${children.length ? 'bg-band' : ''}`}>
        <div className="wrap">
          <SectionHeading className="mb-7">{dict.productsInCategory}</SectionHeading>
          <CategoryProducts locale={locale} categoryIds={ids} emptyText={dict.noProducts} />
        </div>
      </section>
    </>
  )
}

/* ---------- product ---------- */

export async function ProductView({ locale, dict, settings, product, contactHref }: Base & { product: Product; contactHref: string }) {
  const category = catOf(product.category)
  const parent = category ? catOf(category.parent) : null
  const selfPath = paths.catalogItem(locale, product.slug || '')
  const crumbs: Crumb[] = [
    { label: dict.home, href: `/${locale}` },
    { label: dict.catalog, href: paths.catalog(locale) },
    ...(parent ? [{ label: parent.title, href: paths.catalogItem(locale, parent.slug || '') }] : []),
    ...(category ? [{ label: category.title, href: paths.catalogItem(locale, category.slug || '') }] : []),
    { label: product.title },
  ]
  const images = (product.images ?? [])
    .map((m) => asMedia(m))
    .filter((m): m is NonNullable<typeof m> => !!m?.url)
    .map((m) => ({ src: mediaUrl(m, 'hero')!, thumb: mediaUrl(m, 'thumb')!, alt: m.alt || product.title }))

  let related = (product.related ?? []).filter((r): r is Product => typeof r === 'object' && !!r)
  if (!related.length && category) {
    related = (await getProducts(locale, { categoryIds: [category.id], limit: 5 })).filter((p) => p.id !== product.id).slice(0, 4)
  }
  const downloads = (product.downloads ?? []).filter((d) => asMedia(d.file)?.url)
  const datasheet = asMedia(product.datasheet)

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.label, path: c.href ?? selfPath })))} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.excerpt || undefined,
          sku: product.code || undefined,
          image: images.map((i) => absolute(i.src)),
          brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
          offers: product.price
            ? { '@type': 'Offer', price: product.price, priceCurrency: 'RSD', availability: product.availability === 'inStock' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder', url: absolute(selfPath) }
            : undefined,
          category: category?.title,
          url: absolute(selfPath),
        }}
      />
      {/* Slim dark band so the transparent header stays readable */}
      <div className="h-[64px] bg-dark md:h-[72px]" />
      <section className="bg-white pb-14 pt-6 md:pb-20">
        <div className="wrap">
          <Breadcrumbs crumbs={crumbs} className="text-muted" />
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
            <ProductGallery images={images} />
            <div>
              {category && <p className="label-caps text-muted">{category.title}</p>}
              {product.code && <p className="mt-3 text-[13px] font-extrabold uppercase tracking-[0.08em] text-accent">{product.code}</p>}
              <h1 className="mt-1 text-[clamp(22px,2.8vw,30px)] font-extrabold leading-tight">{productName(product).name}</h1>
              {product.excerpt && <p className="mt-5 text-[15px] leading-relaxed">{product.excerpt}</p>}
              <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-3 border-t border-line pt-5">
                <div>
                  <p className="label-caps text-muted">{dict.price}</p>
                  <p className="mt-1 text-[22px] font-extrabold text-ink tabular-nums">
                    {product.price ? `${new Intl.NumberFormat(locale === 'sr' ? 'sr-RS' : 'en-GB').format(product.price)} RSD` : dict.priceOnRequest}
                  </p>
                  {product.price && product.priceNote && <p className="text-[12px] text-muted">{product.priceNote}</p>}
                </div>
                {product.availability && (
                  <span
                    className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${
                      product.availability === 'inStock' ? 'bg-accent/15 text-ink' : 'bg-band text-body'
                    }`}
                  >
                    <span className={`size-1.5 rounded-full ${product.availability === 'inStock' ? 'bg-accent' : 'bg-muted'}`} aria-hidden />
                    {dict.availability[product.availability]}
                  </span>
                )}
              </div>
              {(product.brand || product.warranty) && (
                <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
                  {product.brand && (
                    <div className="flex gap-1.5">
                      <dt className="text-muted">{dict.brand}:</dt>
                      <dd className="font-bold text-ink">{product.brand}</dd>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex gap-1.5">
                      <dt className="text-muted">{dict.warranty}:</dt>
                      <dd className="font-bold text-ink">{product.warranty}</dd>
                    </div>
                  )}
                </dl>
              )}
              {!!product.highlights?.length && (
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {product.highlights.map((h) => (
                    <li key={h.id} className="flex items-start gap-3 py-2.5 text-[14px] text-ink">
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      {h.text}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={contactHref} className="btn-accent btn-accent-lg">
                  {dict.requestQuote}
                </Link>
                {datasheet?.url && (
                  <a href={datasheet.url} target="_blank" rel="noopener" className="btn-dark px-5 py-3">
                    <FileText className="size-4" aria-hidden />
                    {dict.datasheet}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {product.description && (
        <section className="bg-band py-12">
          <div className="wrap-narrow">
            <SectionHeading className="mb-5">{dict.description}</SectionHeading>
            <RichText data={product.description} className="text-[14.5px]" />
          </div>
        </section>
      )}

      {youtubeId(product.videoUrl) && (
        <section className="py-12">
          <div className="wrap-narrow">
            <SectionHeading className="mb-5">{dict.video}</SectionHeading>
            <div className="relative aspect-video overflow-hidden bg-dark">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId(product.videoUrl)}`}
                title={product.title}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            </div>
          </div>
        </section>
      )}

      {!!product.specs?.length && (
        <section className="py-12">
          <div className="wrap-narrow">
            <SectionHeading className="mb-5">{dict.specs}</SectionHeading>
            <table className="w-full border-collapse text-[14px]">
              <tbody>
                {product.specs.map((s, i) => (
                  <tr key={s.id} className={i % 2 ? 'bg-white' : 'bg-band'}>
                    <th scope="row" className="w-1/2 px-4 py-2.5 text-left font-bold text-ink">
                      {s.label}
                    </th>
                    <td className="px-4 py-2.5 tabular-nums">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {downloads.length > 0 && (
        <section className="pb-12">
          <div className="wrap-narrow">
            <SectionHeading className="mb-5">{dict.downloads}</SectionHeading>
            <ul className="divide-y divide-line border-y border-line">
              {downloads.map((d) => (
                <li key={d.id}>
                  <a href={asMedia(d.file)!.url!} target="_blank" rel="noopener" className="flex items-center justify-between gap-4 px-2 py-3 text-[14px] font-bold text-ink hover:bg-band">
                    {d.label}
                    <Download className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-band py-12">
          <div className="wrap max-w-[1000px]">
            <SectionHeading className="mb-6">{dict.related}</SectionHeading>
            <div className="flex flex-wrap justify-center gap-3">
              {related.map((p) => (
                <div key={p.id} className="w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)]">
                  <ProductTile product={p} locale={locale} sizes="(min-width: 1024px) 25vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
