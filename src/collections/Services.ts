import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields/slug'
import { iconField, orderField, t } from '../fields/shared'
import { layoutField } from '../blocks/config'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: t('Usluga', 'Service'), plural: t('Usluge', 'Services') },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'updatedAt'],
    group: t('Sadržaj', 'Content'),
  },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', label: t('Naziv', 'Title'), type: 'text', required: true, localized: true },
    slugField(),
    orderField,
    {
      name: 'badge',
      label: t('Oznaka (npr. "Novo")', 'Badge (e.g. "New")'),
      type: 'text',
      localized: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tagline',
      label: t('Kratak opis (kartica i hero)', 'Short description (card and hero)'),
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'heroImage',
      label: t('Glavna slika', 'Main image'),
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'introHeading',
      label: t('Naslov uvoda', 'Intro heading'),
      type: 'text',
      localized: true,
    },
    { name: 'intro', label: t('Uvodni tekst', 'Intro text'), type: 'richText', localized: true },
    {
      name: 'features',
      label: t('Prednosti', 'Features'),
      type: 'array',
      labels: { singular: t('Prednost', 'Feature'), plural: t('Prednosti', 'Features') },
      fields: [
        iconField,
        { name: 'title', label: t('Naslov', 'Title'), type: 'text', required: true, localized: true },
        { name: 'text', label: t('Tekst', 'Text'), type: 'textarea', localized: true },
      ],
    },
    {
      name: 'whyHeading',
      label: t('Naslov drugog bloka', 'Second block heading'),
      type: 'text',
      localized: true,
    },
    { name: 'why', label: t('Tekst drugog bloka', 'Second block text'), type: 'richText', localized: true },
    {
      name: 'whyImage',
      label: t('Slika drugog bloka', 'Second block image'),
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'productCategory',
      label: t('Kategorija proizvoda za ovu uslugu', 'Product category for this service'),
      type: 'relationship',
      relationTo: 'product-categories',
      admin: { description: t('Proizvodi iz ove kategorije prikazuju se na strani usluge.', 'Products from this category are shown on the service page.') },
    },
    {
      name: 'gallery',
      label: t('Galerija', 'Gallery'),
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'brochure',
      label: t('PDF brošura', 'PDF brochure'),
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { equals: 'application/pdf' } },
    },
    {
      name: 'faqs',
      label: t('Pitanja za ovu uslugu', 'FAQ for this service'),
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
    layoutField(t('Dodatne sekcije na dnu strane usluge (opciono).', 'Extra sections at the bottom of the service page (optional).')),
  ],
}
