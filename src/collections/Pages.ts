import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields/slug'
import { t } from '../fields/shared'
import { layoutField } from '../blocks/config'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: t('Stranica', 'Page'), plural: t('Stranice', 'Pages') },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'template', 'updatedAt'],
    group: t('Sadržaj', 'Content'),
    description: t(
      'O nama, Kontakt, Portfolio i sve dodatne stranice. Šablon određuje glavni deo strane, a ispod možete dodati sekcije.',
      'About, Contact, Portfolio and any extra pages. The template sets the page layout.',
    ),
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', label: t('Naslov', 'Title'), type: 'text', required: true, localized: true },
    slugField(),
    {
      name: 'template',
      label: t('Šablon', 'Template'),
      type: 'select',
      defaultValue: 'default',
      required: true,
      admin: { position: 'sidebar' },
      options: [
        { label: t('Običan tekst', 'Plain content'), value: 'default' },
        { label: t('O nama', 'About'), value: 'about' },
        { label: t('Kontakt (forma i mapa)', 'Contact (form and map)'), value: 'contact' },
        { label: t('Portfolio (lista projekata)', 'Portfolio (project list)'), value: 'portfolio' },
        { label: t('Usluge (lista usluga)', 'Services (service list)'), value: 'services' },
        { label: t('Katalog proizvoda (kategorije)', 'Product catalog (categories)'), value: 'products' },
      ],
    },
    { name: 'lead', label: t('Podnaslov', 'Subtitle'), type: 'textarea', localized: true },
    { name: 'heroImage', label: t('Slika u zaglavlju', 'Header image'), type: 'upload', relationTo: 'media' },
    { name: 'content', label: t('Sadržaj', 'Content'), type: 'richText', localized: true },
    {
      name: 'highlights',
      label: t('Istaknute brojke', 'Key figures'),
      type: 'array',
      admin: { condition: (data) => data?.template === 'about' },
      fields: [
        { name: 'value', label: t('Vrednost', 'Value'), type: 'text', required: true },
        { name: 'label', label: t('Opis', 'Label'), type: 'text', required: true, localized: true },
      ],
    },
    layoutField(),
  ],
}
