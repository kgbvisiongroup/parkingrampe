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

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  // Own cookie name: another Payload site on the same server/IP (cookies ignore the port) must not clash.
  cookiePrefix: 'kgb',
  admin: {
    user: Users.slug,
    avatar: 'default',
    theme: 'dark',
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '– KGB CMS' },
    components: {
      graphics: {
        Logo: '/components/admin/Brand#Logo',
        Icon: '/components/admin/Brand#Icon',
      },
      beforeLogin: ['/components/admin/LoginIntro#LoginIntro'],
      afterNavLinks: ['/components/admin/Inbox#InboxNav'],
      beforeDashboard: ['/components/admin/Inbox#InboxDashboard'],
      views: {
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
  ],
  globals: [Home, Navigation, SiteSettings],
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
