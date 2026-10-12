import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SetAlternates } from '@/components/Alternates'
import { CategoryCard, PageBanner, ProductCard, SectionHeading } from '@/components/ui'
import { getDictionary, isLocale } from '@/lib/i18n'
import { searchSite } from '@/lib/payload'
import { paths } from '@/lib/routes'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: getDictionary(locale).searchResults, robots: { index: false, follow: true } }
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { q = '' } = await searchParams
  const dict = getDictionary(locale)
  const r = await searchSite(locale, q)
  const total = r.products.length + r.categories.length + r.services.length + r.pages.length

  return (
    <>
      <SetAlternates paths={{ sr: paths.search('sr'), en: paths.search('en') }} />
      <PageBanner compact title={dict.searchResults} crumbs={[{ label: dict.home, href: `/${locale}` }, { label: dict.search }]} />
      <section className="py-10">
        <div className="wrap">
          <form action={paths.search(locale)} className="mx-auto flex max-w-xl gap-2">
            <input
              name="q"
              type="search"
              defaultValue={q}
              placeholder={dict.searchPlaceholder}
              aria-label={dict.search}
              className="h-11 flex-1 border border-line px-3.5 text-[15px] text-ink outline-none focus:border-dark"
            />
            <button type="submit" className="btn-dark px-5">
              {dict.search}
            </button>
          </form>
          {q && (
            <p className="mt-5 text-center text-[14px] text-muted">
              {dict.searchFor} „{q}”: {total}
            </p>
          )}
          {q && total === 0 && <p className="mt-8 text-center">{dict.searchNone}</p>}

          {r.products.length > 0 && (
            <div className="mt-10">
              <SectionHeading className="mb-6">{dict.catalog}</SectionHeading>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {r.products.map((p) => (
                  <ProductCard key={p.id} product={p} locale={locale} />
                ))}
              </div>
            </div>
          )}
          {r.categories.length > 0 && (
            <div className="mt-12">
              <SectionHeading className="mb-6">{dict.categories}</SectionHeading>
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {r.categories.map((c) => (
                  <CategoryCard key={c.id} category={c} locale={locale} />
                ))}
              </div>
            </div>
          )}
          {(r.services.length > 0 || r.pages.length > 0) && (
            <div className="mx-auto mt-12 max-w-xl">
              <SectionHeading className="mb-4">{dict.pages}</SectionHeading>
              <ul className="divide-y divide-line border-y border-line">
                {r.services.map((s) => (
                  <li key={`s${s.id}`}>
                    <Link href={paths.service(locale, s.slug || '')} className="block px-2 py-3 hover:bg-band">
                      <span className="block font-bold text-ink">{s.title}</span>
                      <span className="block text-[13px] text-muted">{s.tagline}</span>
                    </Link>
                  </li>
                ))}
                {r.pages.map((p) => (
                  <li key={`p${p.id}`}>
                    <Link href={paths.page(locale, p.slug || '')} className="block px-2 py-3 font-bold text-ink hover:bg-band">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
