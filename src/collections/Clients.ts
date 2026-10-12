import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { orderField, t } from '../fields/shared'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: t('Klijent', 'Client'), plural: t('Klijenti', 'Clients') },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order'], group: t('Sadržaj', 'Content') },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', label: t('Naziv', 'Name'), type: 'text', required: true },
    { name: 'logo', label: t('Logo', 'Logo'), type: 'upload', relationTo: 'media', required: true },
    { name: 'url', label: t('Sajt (opciono)', 'Website (optional)'), type: 'text' },
    orderField,
  ],
}
