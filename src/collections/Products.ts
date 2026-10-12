import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields/slug'
import { orderField, t } from '../fields/shared'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { normalizeSearch } from '../lib/searchText'

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s)

/** Keeps the search index current and fills empty SEO fields, so every product has a title and description for Google. */
const productBeforeChange: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const title = (data.title ?? originalDoc?.title ?? '') as string
  const code = (data.code ?? originalDoc?.code ?? '') as string
  const excerpt = (data.excerpt ?? originalDoc?.excerpt ?? '') as string
  // The category name is part of the index, so "fotocelije" also finds products in "Fotoćelije".
  let categoryTitle = ''
  const cat = data.category ?? originalDoc?.category
  const catId = typeof cat === 'object' && cat ? cat.id : cat
  if (catId) {
    const c = await req.payload.findByID({ collection: 'product-categories', id: catId, depth: 0, locale: req.locale as 'sr' | 'en' | undefined }).catch(() => null)
    categoryTitle = c?.title ?? ''
  }
  data.searchText = normalizeSearch(
    `${code} ${code.replace(/[^a-z0-9]/gi, '')} ${title} ${excerpt} ${data.brand ?? originalDoc?.brand ?? ''} ${categoryTitle}`,
  )

  const meta = { ...(originalDoc?.meta ?? {}), ...(data.meta ?? {}) }
  if (!meta.title && title) meta.title = clip(title, 60)
  if (!meta.description && (excerpt || title)) {
    const base = excerpt || title
    const sep = /[.!?]$/.test(base.trim()) ? ' ' : '. '
    const tail = sep + (req.locale === 'en' ? 'Sales, installation and service – KGB Automation.' : 'Prodaja, ugradnja i servis – KGB Automation.')
    meta.description = clip(base.length + tail.length <= 160 ? base + tail : base, 160)
  }
  const images = (data.images ?? originalDoc?.images) as (number | { id: number })[] | undefined
  if (!meta.image && images?.length) meta.image = typeof images[0] === 'object' ? images[0].id : images[0]
  data.meta = meta
  return data
}

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: t('Proizvod', 'Product'), plural: t('Proizvodi', 'Products') },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'code', 'availability', 'featured'],
    group: t('Proizvodi', 'Products'),
    listSearchableFields: ['title', 'code', 'excerpt'],
    components: { beforeList: ['/components/admin/ImportLink#ImportLink'] },
    description: t(
      'Dodajte proizvod: naziv, slike, opis, specifikaciju i dokumente. Polja su podeljena u tabove; SEO je u poslednjem tabu.',
      'Add a product: name, images, description, specifications and documents. Fields are split into tabs; SEO is the last tab.',
    ),
  },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { beforeChange: [productBeforeChange], afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: t('Osnovno', 'Basics'),
          fields: [
            { name: 'title', label: t('Naziv proizvoda', 'Product name'), type: 'text', required: true, localized: true },
            {
              name: 'excerpt',
              label: t('Kratak opis (ispod naziva i na karticama)', 'Short description (under the name and on cards)'),
              type: 'textarea',
              localized: true,
              maxLength: 300,
            },
            {
              name: 'images',
              label: t('Slike', 'Images'),
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              required: true,
              admin: { description: t('Prva slika je glavna. Prevucite slike da promenite redosled.', 'The first image is the main one. Drag to reorder.') },
            },
            {
              name: 'highlights',
              label: t('Glavne prednosti (lista sa tačkama)', 'Key features (bullet list)'),
              type: 'array',
              labels: { singular: t('Prednost', 'Feature'), plural: t('Prednosti', 'Features') },
              fields: [{ name: 'text', type: 'text', localized: true, required: true, label: t('Tekst', 'Text') }],
            },
          ],
        },
        {
          label: t('Opis', 'Description'),
          fields: [
            {
              name: 'description',
              label: t('Detaljan opis', 'Full description'),
              type: 'richText',
              localized: true,
              admin: { description: t('Možete koristiti naslove, liste, podebljan tekst i linkove.', 'You can use headings, lists, bold text and links.') },
            },
            {
              name: 'videoUrl',
              label: t('YouTube video (link, opciono)', 'YouTube video (link, optional)'),
              type: 'text',
              admin: { description: t('Npr. https://www.youtube.com/watch?v=…', 'E.g. https://www.youtube.com/watch?v=…') },
            },
          ],
        },
        {
          label: t('Specifikacija', 'Specifications'),
          fields: [
            {
              name: 'specs',
              label: t('Tehničke karakteristike', 'Technical specifications'),
              type: 'array',
              labels: { singular: t('Red', 'Row'), plural: t('Redovi', 'Rows') },
              admin: { description: t('Npr. „Napajanje” – „230 V AC”, „Maks. težina kapije” – „600 kg”.', 'E.g. "Power supply" – "230 V AC".') },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', localized: true, required: true, label: t('Karakteristika', 'Specification'), admin: { width: '50%' } },
                    { name: 'value', type: 'text', localized: true, required: true, label: t('Vrednost', 'Value'), admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'datasheet',
              label: t('Datasheet (PDF)', 'Datasheet (PDF)'),
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { equals: 'application/pdf' } },
              admin: {
                description: t(
                  'Tehnički list proizvoda. Ako ga ne dodate, dugme za preuzimanje se ne prikazuje.',
                  'Product data sheet. If none is added, no download button is shown.',
                ),
              },
            },
            {
              name: 'downloads',
              label: t('Ostali dokumenti (uputstva, katalozi)', 'Other documents (manuals, brochures)'),
              type: 'array',
              labels: { singular: t('Dokument', 'Document'), plural: t('Dokumenti', 'Documents') },
              fields: [
                { name: 'label', type: 'text', localized: true, required: true, label: t('Naziv', 'Name') },
                { name: 'file', type: 'upload', relationTo: 'media', required: true, label: t('Fajl', 'File') },
              ],
            },
          ],
        },
        {
          label: t('Cena i dostupnost', 'Price and availability'),
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  label: t('Cena (RSD, opciono)', 'Price (RSD, optional)'),
                  type: 'number',
                  min: 0,
                  admin: { width: '50%', description: t('Prazno = „Cena na upit”.', 'Empty = "Price on request".') },
                },
                {
                  name: 'priceNote',
                  label: t('Napomena uz cenu', 'Price note'),
                  type: 'text',
                  localized: true,
                  admin: { width: '50%', description: t('Npr. „sa PDV-om, bez ugradnje”.', 'E.g. "incl. VAT, installation extra".') },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'availability',
                  label: t('Dostupnost', 'Availability'),
                  type: 'select',
                  defaultValue: 'request',
                  admin: { width: '50%' },
                  options: [
                    { label: t('Na stanju', 'In stock'), value: 'inStock' },
                    { label: t('Po porudžbini', 'On order'), value: 'onOrder' },
                    { label: t('Na upit', 'On request'), value: 'request' },
                  ],
                },
                {
                  name: 'warranty',
                  label: t('Garancija', 'Warranty'),
                  type: 'text',
                  localized: true,
                  admin: { width: '50%', description: t('Npr. „2 godine”.', 'E.g. "2 years".') },
                },
              ],
            },
          ],
        },
      ],
    },
    // Sidebar
    slugField(),
    {
      name: 'category',
      label: t('Kategorija', 'Category'),
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: t('Izdvojen proizvod', 'Featured product'),
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: t('Prikazuje se u sekciji „Izdvojeni proizvodi”.', 'Shown in "Featured products".') },
    },
    { name: 'code', label: t('Šifra / model', 'Code / model'), type: 'text', admin: { position: 'sidebar' } },
    { name: 'brand', label: t('Proizvođač', 'Brand'), type: 'text', defaultValue: 'Key Automation', admin: { position: 'sidebar' } },
    orderField,
    { name: 'searchText', type: 'text', localized: true, index: true, admin: { hidden: true } },
    {
      name: 'related',
      label: t('Povezani proizvodi', 'Related products'),
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { position: 'sidebar' },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
  ],
}
