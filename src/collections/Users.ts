import type { CollectionConfig } from 'payload'
import { t } from '../fields/shared'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: t('Korisnik', 'User'), plural: t('Korisnici', 'Users') },
  admin: { useAsTitle: 'email', group: t('Podešavanja', 'Settings') },
  // 12 h: behind a firewall that strips Set-Cookie the session cannot be refreshed, so it lasts a working day.
  auth: { tokenExpiration: 60 * 60 * 12 },
  fields: [{ name: 'name', label: t('Ime', 'Name'), type: 'text' }],
}
