import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { orderField, t } from '../fields/shared'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: t('Pitanje', 'Question'), plural: t('Česta pitanja', 'FAQ') },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'showOnHome', 'order'],
    group: t('Sadržaj', 'Content'),
  },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'question', label: t('Pitanje', 'Question'), type: 'text', required: true, localized: true },
    { name: 'answer', label: t('Odgovor', 'Answer'), type: 'textarea', required: true, localized: true },
    {
      name: 'showOnHome',
      label: t('Prikaži na početnoj', 'Show on home page'),
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    orderField,
  ],
}
