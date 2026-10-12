import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/** Old WordPress addresses → new pages, so Google rankings and existing links carry over (301). */
const legacyRedirects = [
  ['/automatske-rampe', '/sr/usluge/automatske-rampe'],
  ['/motori-za-kapije-2', '/sr/usluge/motori-za-kapije'],
  ['/motori-za-kapije', '/sr/usluge/motori-za-kapije'],
  ['/kontrola-pristupa', '/sr/usluge/kontrola-pristupa'],
  ['/portfolio', '/sr/portfolio'],
  ['/o-nama', '/sr/o-nama'],
  ['/kontakt', '/sr/kontakt'],
  ['/login', '/admin'],
  ['/kgb1', '/admin'],
  ['/wp-admin', '/admin'],
  ['/wp-login.php', '/admin'],
]

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1080, 1440, 1920],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/', destination: '/sr', permanent: false },
      ...legacyRedirects.flatMap(([from, to]) => [
        { source: from, destination: to, permanent: true },
        { source: `${from}/`, destination: to, permanent: true },
      ]),
    ]
  },
  async headers() {
    return [
      {
        source: '/api/media/file/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: { root: path.resolve(dirname) },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
