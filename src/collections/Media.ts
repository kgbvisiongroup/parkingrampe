import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { t } from '../fields/shared'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: t('Fajl', 'File'), plural: t('Slike i fajlovi', 'Media') },
  admin: { group: t('Sadržaj', 'Content') },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    {
      name: 'alt',
      label: t('Alternativni tekst (SEO)', 'Alt text (SEO)'),
      type: 'text',
      localized: true,
      admin: {
        description: t(
          'Kratak opis slike za Google i čitače ekrana, npr. "Parking rampa Key ALT na ulazu u garažu".',
          'Short description for Google and screen readers, e.g. "Key ALT barrier at a garage entrance".',
        ),
      },
    },
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 80 } } },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 82 } },
      },
    ],
  },
}
