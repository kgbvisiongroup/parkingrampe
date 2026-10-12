import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Product, ProductCategory } from '@/payload-types'
import type { Locale } from '@/lib/i18n'
import { type CmsLink, linkProps } from '@/lib/links'
import { asMedia, focal, type MediaRef, mediaUrl } from '@/lib/media'
import { paths } from '@/lib/routes'

export function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h2 className={`h-section ${className}`}>{children}</h2>
}

export function CmsButton({
  link,
  locale,
  variant = 'dark',
  fallbackLabel,
}: {
  link: CmsLink
  locale: Locale
  variant?: 'dark' | 'light' | 'accent' | 'outline-light'
  fallbackLabel?: string
}) {
  const p = linkProps(link, locale)
  if (!p || !(p.label || fallbackLabel)) return null
  const cls = variant === 'accent' ? 'btn-accent btn-accent-lg' : `btn-${variant}`
  return (
    <Link href={p.href} target={p.target} rel={p.rel} className={cls}>
      {p.label || fallbackLabel}
    </Link>
  )
}

/** Toned section wrapper used by blocks. */
export function Band({ tone = 'white', children, className = '' }: { tone?: string | null; children: ReactNode; className?: string }) {
  const bg = tone === 'grey' ? 'bg-band' : tone === 'dark' ? 'bg-dark text-white/80' : 'bg-white'
  return <section className={`${bg} ${className}`}>{children}</section>
}

export type Crumb = { label: string; href?: string }

/** Dark title band at the top of inner pages; an image is shown behind it when there is one. */
export function PageBanner({ title, lead, image, crumbs, compact }: { title: string; lead?: string | null; image?: MediaRef; crumbs: Crumb[]; compact?: boolean }) {
  const src = mediaUrl(image, 'hero')
  return (
    <section className={`relative isolate flex items-end overflow-hidden bg-dark text-white ${compact ? 'min-h-[220px]' : src ? 'min-h-[380px] md:min-h-[440px]' : 'min-h-[260px]'}`}>
      {src && (
        <>
          <Image
            src={src}
            alt={asMedia(image)?.alt || title}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
            style={{ objectPosition: focal(image) }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/35 to-black/45" />
        </>
      )}
      <div className="wrap pb-10 pt-28 text-center md:pb-12">
        <h1 className="h-page text-white text-shadow">{title}</h1>
        {lead && <p className="mx-auto mt-3 max-w-2xl text-[15px] text-white/85 md:text-base">{lead}</p>}
        <Breadcrumbs crumbs={crumbs} className="mt-5 justify-center text-white/70" />
      </div>
    </section>
  )
}

export function Breadcrumbs({ crumbs, className = '' }: { crumbs: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1 text-[12px] ${className}`}>
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3 opacity-70" aria-hidden />}
            {c.href ? (
              <Link href={c.href} className="hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Category card: image on top, uppercase title, short text (as in the reference "Prodotti" row). */
export function CategoryCard({ category, locale, sizes }: { category: ProductCategory; locale: Locale; sizes?: string }) {
  const src = mediaUrl(category.image, 'card')
  const contain = category.imageFit === 'contain'
  return (
    <Link href={paths.catalogItem(locale, category.slug || '')} className="tile-zoom group block">
      <div className={`relative aspect-[16/9] overflow-hidden ${contain ? 'border border-line bg-white' : 'bg-band'}`}>
        {src && (
          <Image
            src={src}
            alt={asMedia(category.image)?.alt || category.title}
            fill
            sizes={sizes || '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'}
            className={contain ? 'object-contain p-4' : 'object-cover'}
            style={contain ? undefined : { objectPosition: focal(category.image) }}
          />
        )}
      </div>
      <h3 className="mt-3 px-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink group-hover:underline group-hover:underline-offset-4">
        {category.title}
      </h3>
      {category.description && <p className="mt-1 px-2 text-[13px] leading-snug text-muted">{category.description}</p>}
    </Link>
  )
}

/** Splits "KSUN5024EK – Komplet za klizne kapije" into code and name for display. */
export function productName(p: Product) {
  const code = p.code || ''
  const name = code && p.title.startsWith(code) ? p.title.slice(code.length).replace(/^\s*[–-]\s*/, '') : p.title
  return { code, name: name || p.title }
}

/** Featured product tile: packshot on white, code and name below. */
export function ProductTile({ product, locale, sizes }: { product: Product; locale: Locale; sizes?: string }) {
  const img = product.images?.[0]
  const src = mediaUrl(img, 'card')
  const { code, name } = productName(product)
  return (
    <Link href={paths.catalogItem(locale, product.slug || '')} className="tile-zoom group block h-full bg-white">
      <div className="relative aspect-[5/4] overflow-hidden bg-white">
        {src && (
          <Image
            src={src}
            alt={asMedia(img)?.alt || product.title}
            fill
            sizes={sizes || '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className="object-contain p-6"
          />
        )}
      </div>
      <div className="border-t border-line px-4 py-3 text-center">
        {code && <p className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-accent">{code}</p>}
        <p className="mt-0.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-ink group-hover:underline group-hover:underline-offset-4">{name}</p>
      </div>
    </Link>
  )
}

/** Product card for catalog grids: packshot on white, code, name and short text below. */
export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const img = product.images?.[0]
  const src = mediaUrl(img, 'card')
  const { code, name } = productName(product)
  return (
    <Link href={paths.catalogItem(locale, product.slug || '')} className="tile-zoom group flex flex-col">
      <div className="relative aspect-square overflow-hidden border border-line bg-white transition-colors group-hover:border-dark/40">
        {src && (
          <Image
            src={src}
            alt={asMedia(img)?.alt || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-5"
          />
        )}
      </div>
      {code && <p className="mt-3 text-[12px] font-extrabold uppercase tracking-[0.06em] text-accent">{code}</p>}
      <h3 className="mt-0.5 line-clamp-2 text-[14px] font-bold leading-snug text-ink group-hover:underline group-hover:underline-offset-4">{name}</h3>
    </Link>
  )
}

/** Square photo with a big uppercase title in the top-left corner ("Key Automation Live"). */
export function PhotoTile({ image, title, href, target, sizes }: { image: MediaRef; title?: string | null; href?: string | null; target?: string; sizes?: string }) {
  const src = mediaUrl(image, 'card')
  const inner = (
    <>
      {src && (
        <Image
          src={src}
          alt={asMedia(image)?.alt || title || ''}
          fill
          sizes={sizes || '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
          className="object-cover"
          style={{ objectPosition: focal(image) }}
        />
      )}
      {title && (
        <>
          <span className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/45 to-transparent" />
          <span className="absolute left-5 right-5 top-3 text-[clamp(18px,2.1vw,26px)] font-extrabold uppercase leading-tight text-white text-shadow">{title}</span>
        </>
      )}
    </>
  )
  const cls = 'tile-zoom relative block aspect-square overflow-hidden bg-[#d9d9d9]'
  return href ? (
    <Link href={href} target={target} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

export const gridCols: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}
