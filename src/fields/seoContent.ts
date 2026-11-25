import type { Field } from 'payload'
import { t } from './shared'

/**
 * Content fields for category and service pages (task: SEO content).
 * Filled by hand in the CMS; imports never write them.
 */

export const headingField: Field = {
  name: 'heading',
  label: t('Naslov na strani (H1, opciono)', 'Page heading (H1, optional)'),
  type: 'text',
  localized: true,
  admin: {
    description: t(
      'Glavni naslov koji posetilac vidi. Treba da sadrži ključnu reč, ali da ne bude isti kao SEO naslov. Prazno = automatski.',
      'The main heading visitors see. Should contain the keyword but differ from the SEO title. Empty = automatic.',
    ),
  },
}

export const guideField: Field = {
  name: 'guide',
  label: t('Vodič za kupovinu (ispod proizvoda)', 'Buying guide (below the products)'),
  type: 'richText',
  localized: true,
  admin: { description: t('Duži tekst za kupce i Google: kako izabrati, ugradnja, servis.', 'Longer text for buyers and Google: how to choose, installation, service.') },
}

export const priceTableField: Field = {
  name: 'priceTable',
  label: t('Cenovnik (tabela)', 'Price table'),
  type: 'array',
  labels: { singular: t('Red', 'Row'), plural: t('Redovi', 'Rows') },
  admin: { description: t('Upišite samo stvarne cene. Prazna tabela se ne prikazuje.', 'Enter real prices only. An empty table is not shown.') },
  fields: [
    { name: 'item', label: t('Stavka', 'Item'), type: 'text', localized: true, required: true },
    {
      type: 'row',
      fields: [
        { name: 'priceFrom', label: t('Cena od (RSD)', 'Price from (RSD)'), type: 'number', min: 0, admin: { width: '33%' } },
        { name: 'priceTo', label: t('Cena do (RSD)', 'Price to (RSD)'), type: 'number', min: 0, admin: { width: '33%' } },
        { name: 'note', label: t('Napomena', 'Note'), type: 'text', localized: true, admin: { width: '34%' } },
      ],
    },
  ],
}

export const faqField: Field = {
  name: 'faq',
  label: t('Česta pitanja na ovoj strani', 'FAQ on this page'),
  type: 'array',
  labels: { singular: t('Pitanje', 'Question'), plural: t('Pitanja', 'Questions') },
  admin: { description: t('Prikazuju se na strani i kao FAQ za Google.', 'Shown on the page and as FAQ data for Google.') },
  fields: [
    { name: 'question', label: t('Pitanje', 'Question'), type: 'text', localized: true, required: true },
    { name: 'answer', label: t('Odgovor', 'Answer'), type: 'textarea', localized: true, required: true },
  ],
}

/**
 * One keyword = one page: the main search phrase of a category or service page.
 * Used in the SEO title and H1; saving is refused if another category or service already uses it.
 */
export const keywordField: Field = {
  name: 'keyword',
  label: t('Glavna ključna reč (SEO)', 'Main keyword (SEO)'),
  type: 'text',
  localized: true,
  admin: {
    position: 'sidebar',
    description: t(
      'Npr. „Rampe za parking”. Ide u naslov za Google i H1. Svaka strana ima svoju – ista reč ne može na dve strane.',
      'E.g. "Parking barriers". Used in the Google title and H1. One keyword per page – it cannot be used on two pages.',
    ),
  },
  validate: async (value: unknown, { req, id, collectionSlug }: { req: { payload: import('payload').Payload; locale?: string | null }; id?: number | string; collectionSlug?: string }) => {
    const kw = typeof value === 'string' ? value.trim().toLowerCase() : ''
    if (!kw) return true
    const locale = (req.locale === 'en' ? 'en' : 'sr') as 'sr' | 'en'
    for (const collection of ['services', 'product-categories'] as const) {
      const res = await req.payload.find({ collection, locale, depth: 0, limit: 200, pagination: false, select: { keyword: true, title: true } })
      const clash = res.docs.find((d) => (d as { keyword?: string | null }).keyword?.trim().toLowerCase() === kw && !(collection === collectionSlug && d.id === id))
      if (clash) return `„${value}” već koristi strana „${(clash as { title?: string }).title}”. Jedna ključna reč = jedna strana.`
    }
    return true
  },
}
