import '@fontsource-variable/plus-jakarta-sans'
import '../globals.css'

import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import type { ReactNode } from 'react'
import { AlternatesProvider } from '@/components/Alternates'
import { ChatWidget } from '@/components/ChatWidget'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { getDictionary, htmlLang, isLocale, locales } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'
import { getNavigation } from '@/lib/nav'
import { getSettings } from '@/lib/payload'
import { paths, siteUrl } from '@/lib/routes'
import { localBusinessSchema } from '@/lib/schema'

export const revalidate = 3600

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = { themeColor: '#2f3336', width: 'device-width', initialScale: 1 }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const settings = await getSettings(locale)
  const favicon = mediaUrl(settings.favicon)
  return {
    metadataBase: new URL(siteUrl),
    applicationName: settings.siteName,
    icons: favicon
      ? { icon: favicon, apple: favicon }
      : { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon.png', type: 'image/png' }], apple: '/apple-touch-icon.png' },
    verification: {
      google: settings.googleVerification || undefined,
      yandex: settings.yandexVerification || undefined,
      other: settings.bingVerification ? { 'msvalidate.01': settings.bingVerification } : undefined,
    },
    formatDetection: { telephone: false },
  }
}

const hex = (v: string | null | undefined, fallback: string) => (v && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback)

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [settings, nav] = await Promise.all([getSettings(locale), getNavigation(locale)])
  const dict = getDictionary(locale)
  const logoUrl = mediaUrl(settings.logo)
  const ga = settings.gaMeasurementId?.trim()
  const theme = `:root{--accent:${hex(settings.accentColor, '#2bb04a')};--dark:${hex(settings.darkColor, '#2f3336')};--grey:${hex(settings.greyColor, '#ededed')}}`
  const chat = settings.chat

  return (
    <html lang={htmlLang[locale]}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body className="min-h-dvh">
        <AlternatesProvider>
          <Header
            locale={locale}
            siteName={settings.siteName}
            logoUrl={logoUrl}
            phone={settings.phone}
            phoneDisplay={settings.phoneDisplay}
            items={nav.items}
            cta={nav.cta}
            showSearch={nav.showSearch}
            showPhone={nav.showPhone}
            searchHref={paths.search(locale)}
            labels={{
              menu: dict.menu,
              close: dict.close,
              search: dict.search,
              searchPlaceholder: dict.searchPlaceholder,
              categories: dict.categories,
              viewAll: dict.viewAll,
              skip: dict.skipToContent,
            }}
          />
          <main id="content">{children}</main>
          <Footer locale={locale} settings={settings} logoUrl={logoUrl} dict={dict} columns={nav.footerColumns} />
        </AlternatesProvider>
        {chat?.enabled !== false && (
          <ChatWidget
            locale={locale}
            labels={dict.chat}
            agentName={chat?.agentName || settings.siteName}
            agentTitle={chat?.agentTitle}
            avatarUrl={mediaUrl(chat?.avatar, 'thumb')}
            greeting={chat?.greeting}
            phone={settings.phone}
            whatsapp={chat?.whatsapp}
            viber={chat?.viber}
          />
        )}
        <JsonLd data={localBusinessSchema(settings, locale)} />
        {ga && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga.replace(/[^A-Z0-9-]/gi, '')}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
