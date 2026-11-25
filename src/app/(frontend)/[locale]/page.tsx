import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SetAlternates } from '@/components/Alternates'
import { RenderBlocks, type LayoutBlock } from '@/blocks/RenderBlocks'
import { isLocale } from '@/lib/i18n'
import { getHome, getSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

const HOME_TITLE = {
  sr: 'Parking rampe i motori za kapije – Key Automation | KGB Automation',
  en: 'Parking barriers and gate motors – Key Automation | KGB Automation',
}
const HOME_H1 = {
  sr: 'Parking rampe i motori za kapije – prodaja, ugradnja i servis u Beogradu i okolini',
  en: 'Parking barriers and gate motors – sales, installation and service in Belgrade and the surrounding area',
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const [settings, home] = await Promise.all([getSettings(locale), getHome(locale)])
  const hero = home.layout?.find((b) => b.blockType === 'hero')
  return buildMetadata({
    locale,
    settings,
    meta: { ...home.meta, title: home.meta?.title?.trim() || HOME_TITLE[locale] },
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
      {/* Not a copy of the <title>: the H1 says what we do, the title adds the brand. */}
      <h1 className="sr-only">{home.heading?.trim() || HOME_H1[locale]}</h1>
      <RenderBlocks blocks={blocks} locale={locale} settings={settings} />
    </>
  )
}
