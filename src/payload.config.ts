import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { rsLatin } from '@payloadcms/translations/languages/rsLatin'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { ChatMessages, Chats } from './collections/Chats'
import { Clients } from './collections/Clients'
import { Faqs } from './collections/Faqs'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { ProductCategories } from './collections/ProductCategories'
import { Products } from './collections/Products'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { withActionButtons } from './fields/listColumns'
import { t } from './fields/shared'
import { chatEndpoints } from './endpoints/chat'
import { importEndpoints } from './endpoints/import'
import { searchEndpoint } from './endpoints/search'
import { Home } from './globals/Home'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import type { Locale } from './lib/i18n'
import { absolute, docPath } from './lib/routes'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || 'office@kgb.co.rs',
      defaultFromName: 'KGB Automation',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_PORT === '465',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

/*
 * Payload's CSRF check accepts the session cookie only when the request carries Origin or
 * Sec-Fetch-Site. Browsers send Sec-Fetch-Site only over https, so on plain http (the site on
 * an IP address before the domain) the check would reject every admin request. Over http the
 * check is therefore off; the cookie is SameSite=Lax, so other sites still cannot use it.
 * With an https NEXT_PUBLIC_SITE_URL the check is on again.
 */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
const isHttps = siteUrl.startsWith('https://')

export default buildConfig({
  serverURL: isHttps ? siteUrl : '',
  // Own cookie name: another Payload site on the same server/IP (cookies ignore the port) must not clash.
  cookiePrefix: 'kgb',
  // Over https, admin sign-in is accepted only from these addresses (plus NEXT_PUBLIC_SITE_URL), e.g.
  // ALLOWED_ORIGINS=http://192.168.20.102:8081,https://parkingrampe.rs
  csrf: isHttps
    ? (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map((o) => o.trim().replace(/\/$/, ''))
        .filter(Boolean)
    : [],
  admin: {
    user: Users.slug,
    avatar: 'default',
    // Light and dark; dark is the default (set in HeaderActions until the user picks one).
    theme: 'all',
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '– KGB CMS' },
    components: {
      graphics: {
        Logo: '/components/admin/Brand#Logo',
        Icon: '/components/admin/Brand#Icon',
      },
      beforeLogin: ['/components/admin/LoginIntro#LoginIntro'],
      Nav: '/components/admin/AdminNav#AdminNav',
      actions: ['/components/admin/HeaderActions#HeaderActions'],
      views: {
        dashboard: { Component: '/components/admin/Dashboard#Dashboard' },
        importProducts: { Component: '/components/admin/ImportView#ImportView', path: '/uvoz-proizvoda' },
      },
    },
  },
  i18n: {
    supportedLanguages: { 'rs-latin': rsLatin, en },
    fallbackLanguage: 'rs-latin',
    translations: { 'rs-latin': { authentication: { login: 'Prijavi se' } } },
  },
  localization: {
    locales: [
      { code: 'sr', label: 'Srpski' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'sr',
    fallback: true,
  },
  collections: [
    Pages,
    Services,
    ProductCategories,
    Products,
    Projects,
    Faqs,
    Clients,
    Media,
    Chats,
    ChatMessages,
    Inquiries,
    Users,
  ].map(withActionButtons),
  globals: [Home, Navigation, SiteSettings],
  // Lists whose columns were saved before the "Akcije" column existed don't show it by themselves:
  // add it once to those saved column settings (a column turned off by hand stays off).
  onInit: async (payload) => {
    try {
      const slugs = payload.config.collections.filter((c) => c.fields.some((f) => 'name' in f && f.name === 'rowActions')).map((c) => c.slug)
      const prefs = await payload.find({ collection: 'payload-preferences', where: { key: { in: slugs.map((s) => `collection-${s}`) } }, depth: 0, limit: 1000, pagination: false })
      for (const pref of prefs.docs) {
        const value = pref.value as { columns?: { accessor: string; active: boolean }[] } | null
        if (!value?.columns?.length || value.columns.some((c) => c.accessor === 'rowActions')) continue
        // Straight to the database: only the saved value changes, the owner of the setting stays as it is.
        await payload.db.updateOne({ collection: 'payload-preferences', id: pref.id, data: { value: { ...value, columns: [...value.columns, { accessor: 'rowActions', active: true }] } } })
      }
    } catch (err) {
      payload.logger.error({ err, msg: 'Kolona Akcije nije dodata u sačuvana podešavanja lista' })
    }
  },
  endpoints: [...chatEndpoints, ...importEndpoints, searchEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./kgb.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
    // Schema changes go through migrations (npm run migrate:create), in development and production alike.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  email,
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages', 'services', 'product-categories', 'products', 'projects'],
      globals: ['home'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => doc?.title || '',
      generateDescription: ({ doc }) =>
        (doc?.tagline || doc?.excerpt || doc?.description || doc?.summary || doc?.lead || '').toString().slice(0, 160),
      generateImage: ({ doc }) => doc?.heroImage || doc?.cover || doc?.image || doc?.images?.[0],
      generateURL: ({ doc, collectionConfig, locale }) =>
        absolute(docPath(collectionConfig?.slug, (locale as Locale) || 'sr', doc?.slug)),
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'noIndex',
          label: t('Sakrij ovu stranicu od Google-a (noindex)', 'Hide this page from Google (noindex)'),
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'canonical',
          label: t('Kanonski URL (opciono)', 'Canonical URL (optional)'),
          type: 'text',
          admin: {
            description: t(
              'Popunite samo ako je isti sadržaj na drugoj adresi koja treba da se rangira.',
              'Only fill in if the same content lives at another address that should rank instead.',
            ),
          },
        },
      ],
    }),
  ],
})
