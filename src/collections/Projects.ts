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
    defaultColumns: ['title', 'service', 'location', 'year'],
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
    { name: 'location', label: t('Lokacija', 'Location'), type: 'text', localized: true },
    { name: 'year', label: t('Godina', 'Year'), type: 'number' },
    { name: 'cover', label: t('Naslovna slika', 'Cover image'), type: 'upload', relationTo: 'media', required: true },
    { name: 'summary', label: t('Kratak opis', 'Summary'), type: 'textarea', localized: true },
    { name: 'body', label: t('Opis projekta', 'Project description'), type: 'richText', localized: true },
    { name: 'gallery', label: t('Galerija', 'Gallery'), type: 'upload', relationTo: 'media', hasMany: true },
  ],
}
