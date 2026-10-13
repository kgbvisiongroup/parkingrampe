import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields/slug'
import { actionsColumn, thumbColumn } from '../fields/listColumns'
import { orderField, t } from '../fields/shared'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { normalizeSearch } from '../lib/searchText'

/** Search index and default SEO texts for categories. */
const categoryBeforeChange: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const title = (data.title ?? originalDoc?.title ?? '') as string
  const description = (data.description ?? originalDoc?.description ?? '') as string
  data.searchText = normalizeSearch(`${title} ${description}`)
  const meta = { ...(originalDoc?.meta ?? {}), ...(data.meta ?? {}) }
  if (!meta.title && title) meta.title = `${title} – Key Automation`
  if (!meta.description && title) {
    meta.description = (description ? `${description} ` : `${title}: Key Automation oprema. `) + 'Prodaja, ugradnja i servis u Beogradu i Srbiji.'
  }
  if (!meta.image && (data.image ?? originalDoc?.image)) {
    const img = data.image ?? originalDoc?.image
    meta.image = typeof img === 'object' ? img.id : img
  }
  data.meta = meta
  return data
}

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: t('Kategorija proizvoda', 'Product category'), plural: t('Kategorije proizvoda', 'Product categories') },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['thumb', 'title', 'parent', 'order', 'showInMenu', 'rowActions'],
    group: t('Proizvodi', 'Products'),
    description: t(
      'Glavne kategorije i potkategorije. Potkategoriji izaberite „Nadređenu kategoriju”. Prikazuju se u meniju „Proizvodi”.',
      'Main categories and subcategories. For a subcategory, choose a "Parent category". Shown in the Products menu.',
    ),
  },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { beforeChange: [categoryBeforeChange], afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', label: t('Naziv', 'Name'), type: 'text', required: true, localized: true },
    slugField(),
    orderField,
    {
      name: 'parent',
      label: t('Nadređena kategorija', 'Parent category'),
      type: 'relationship',
      relationTo: 'product-categories',
      admin: { position: 'sidebar', description: t('Prazno = glavna kategorija.', 'Empty = main category.') },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'showInMenu',
      label: t('Prikaži u meniju', 'Show in menu'),
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    { name: 'image', label: t('Slika (kartica i baner)', 'Image (card and banner)'), type: 'upload', relationTo: 'media' },
    {
      name: 'imageFit',
      label: t('Prikaz slike na kartici', 'Card image display'),
      type: 'radio',
      defaultValue: 'cover',
      admin: { layout: 'horizontal' },
      options: [
        { label: t('Fotografija preko cele kartice', 'Photo fills the card'), value: 'cover' },
        { label: t('Proizvod na beloj pozadini', 'Product on white background'), value: 'contain' },
      ],
    },
    { name: 'description', label: t('Kratak opis (kartica)', 'Short description (card)'), type: 'textarea', localized: true },
    { name: 'content', label: t('Tekst na strani kategorije', 'Category page text'), type: 'richText', localized: true },
    { name: 'searchText', type: 'text', localized: true, index: true, admin: { hidden: true } },
    thumbColumn,
    actionsColumn,
  ],
}
