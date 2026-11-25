import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields/slug'
import { orderField, t } from '../fields/shared'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: t('Projekat', 'Project'), plural: t('Portfolio', 'Portfolio') },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'service', 'city', 'year'],
    group: t('Sadržaj', 'Content'),
  },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', label: t('Naziv projekta', 'Project title'), type: 'text', required: true, localized: true },
    slugField(),
    orderField,
    {
      name: 'service',
      label: t('Usluga', 'Service'),
      type: 'relationship',
      relationTo: 'services',
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'city', label: t('Grad', 'City'), type: 'text', localized: true, admin: { width: '33%', description: t('Npr. Šabac', 'E.g. Šabac') } },
        { name: 'location', label: t('Lokacija (deo grada, adresa)', 'Location (area, address)'), type: 'text', localized: true, admin: { width: '34%' } },
        { name: 'year', label: t('Godina', 'Year'), type: 'number', admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'objectType', label: t('Tip objekta', 'Type of site'), type: 'text', localized: true, admin: { width: '50%', description: t('Npr. hotel, stambena zgrada, poslovni parking', 'E.g. hotel, residential building, business car park') } },
        { name: 'client', label: t('Klijent (opciono)', 'Client (optional)'), type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'equipment',
      label: t('Ugrađena oprema', 'Installed equipment'),
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { description: t('Proizvodi iz kataloga; na strani projekta vode na stranu proizvoda.', 'Catalogue products; on the project page they link to the product page.') },
    },
    { name: 'cover', label: t('Naslovna slika', 'Cover image'), type: 'upload', relationTo: 'media', required: true },
    { name: 'summary', label: t('Kratak opis', 'Summary'), type: 'textarea', localized: true },
    { name: 'body', label: t('Opis projekta (150–300 reči)', 'Project description (150–300 words)'), type: 'richText', localized: true },
    { name: 'gallery', label: t('Galerija', 'Gallery'), type: 'upload', relationTo: 'media', hasMany: true },
  ],
}
