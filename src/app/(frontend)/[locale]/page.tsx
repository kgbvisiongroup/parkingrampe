import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SetAlternates } from '@/components/Alternates'
import { RenderBlocks, type LayoutBlock } from '@/blocks/RenderBlocks'
import { isLocale } from '@/lib/i18n'
import { getHome, getSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const [settings, home] = await Promise.all([getSettings(locale), getHome(locale)])
  const hero = home.layout?.find((b) => b.blockType === 'hero')
  return buildMetadata({
    locale,
    settings,
    meta: home.meta,
    fallbackTitle: settings.siteName,
    fallbackImage: hero && 'slides' in hero ? hero.slides?.[0]?.image : undefined,
    paths: { sr: '/sr', en: '/en' },
    absoluteTitle: true,
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [settings, home] = await Promise.all([getSettings(locale), getHome(locale)])
  const blocks = home.layout as LayoutBlock[] | undefined

  return (
    <>
      <SetAlternates paths={{ sr: '/sr', en: '/en' }} />
      {/* Keeps the white header readable when the page does not start with a photo. */}
      {blocks?.[0]?.blockType !== 'hero' && blocks?.[0]?.blockType !== 'banner' && <div className="h-[64px] bg-dark md:h-[72px]" />}
      <h1 className="sr-only">{home.meta?.title || settings.siteName}</h1>
      <RenderBlocks blocks={blocks} locale={locale} settings={settings} />
    </>
  )
}
