import type { MetadataRoute } from 'next'
import { absolute } from '@/lib/routes'

export default function robots(): MetadataRoute.Robots {
  return {
    // Images are served from /api/media/, so that path stays crawlable for Google Images.
    rules: [{ userAgent: '*', allow: ['/', '/api/media/'], disallow: ['/admin', '/api/'] }],
    sitemap: absolute('/sitemap.xml'),
    host: absolute(''),
  }
}
