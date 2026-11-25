import type { CollectionConfig, TextField } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields/slug'
import { faqField, headingField } from '../fields/seoContent'
import { orderField, t } from '../fields/shared'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/** Minimum unique text (intro + local text + FAQ) before a city page may be shown to Google. */
export const CITY_MIN_WORDS = 500

/**
 * City pages: /sr/rampe-i-motori-za-kapije-<grad> (SEO task 7).
 * A page stays hidden from Google (noindex, not in the sitemap or the footer) until it is marked
 * ready AND has at least 500 words of its own – no copies with only the city name swapped.
 */
export const Cities: CollectionConfig = {
  slug: 'cities',
  labels: { singular: t('Grad', 'City'), plural: t('Gradovi', 'Cities') },
  admin: {
    useAsTitle: 'city',
    defaultColumns: ['city', 'slug', 'ready', 'updatedAt'],
    group: t('Sadržaj', 'Content'),
    description: t(
      'Strane „Rampe i motori za kapije – <grad>”. Strana je skrivena od Google-a dok ne označite „Spremno” i dok nema bar 500 reči svog teksta: lokalni projekti, delovi grada, vreme dolaska, lokalna pitanja.',
      '"Barriers and gate motors – <city>" pages. Hidden from Google until marked "Ready" and until it has at least 500 words of its own: local projects, areas, travel time, local questions.',
    ),
  },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'city', label: t('Grad', 'City'), type: 'text', required: true, localized: true, admin: { description: t('Npr. Beograd', 'E.g. Belgrade') } },
    {
      name: 'cityIn',
      label: t('Grad u lokativu („u …”)', 'City with "in"'),
      type: 'text',
      localized: true,
      admin: { description: t('Npr. „Beogradu”, „Šapcu”, „Novom Sadu” – za naslov „Rampe i motori za kapije u Beogradu”.', 'E.g. "Belgrade".') },
    },
    { ...(slugField('city') as TextField), admin: { position: 'sidebar', description: t('Npr. beograd → /sr/rampe-i-motori-za-kapije-beograd', 'E.g. belgrade → /en/barriers-and-gate-motors-belgrade') } },
    orderField,
    {
      name: 'ready',
      label: t('Spremno za Google', 'Ready for Google'),
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: t('Uključite tek kada strana ima svoj, jedinstven tekst.', 'Turn on only when the page has its own unique text.') },
    },
    headingField,
    { name: 'intro', label: t('Uvod', 'Intro'), type: 'richText', localized: true },
    {
      name: 'areas',
      label: t('Delovi grada i okolna mesta koja pokrivamo', 'Areas and nearby places we cover'),
      type: 'textarea',
      localized: true,
      admin: { description: t('Jedno mesto ili deo grada u redu.', 'One place or area per line.') },
    },
    {
      name: 'travelTime',
      label: t('Dolazak i ugradnja (vreme)', 'Travel and installation time'),
      type: 'text',
      localized: true,
      admin: { description: t('Npr. „Iz Obrenovca stižemo za oko 40 minuta; ugradnja rampe traje jedan dan.”', 'E.g. "From Obrenovac in about 40 minutes; a barrier takes one day."') },
    },
    { name: 'body', label: t('Lokalni tekst (projekti, objekti, iskustva)', 'Local text (projects, sites, experience)'), type: 'richText', localized: true },
    {
      name: 'projects',
      label: t('Projekti u ovom gradu', 'Projects in this city'),
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: { description: t('Prazno = projekti čije polje „Grad” odgovara ovom gradu.', 'Empty = projects whose "City" matches.') },
    },
    faqField,
  ],
}
