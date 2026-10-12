import type { CollectionConfig } from 'payload'
import { t } from '../fields/shared'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: t('Korisnik', 'User'), plural: t('Korisnici', 'Users') },
  admin: { useAsTitle: 'email', group: t('Podešavanja', 'Settings') },
  auth: true,
  fields: [{ name: 'name', label: t('Ime', 'Name'), type: 'text' }],
}
