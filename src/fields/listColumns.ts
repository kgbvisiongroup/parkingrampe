import type { Field } from 'payload'
import { t } from './shared'

/** List-view columns only (not shown in the edit form): image thumbnail and edit/delete buttons. */
export const thumbColumn: Field = {
  name: 'thumb',
  type: 'ui',
  label: t('Slika', 'Image'),
  admin: { components: { Cell: '/components/admin/ListCells#ThumbCell' } },
}

export const actionsColumn: Field = {
  name: 'rowActions',
  type: 'ui',
  label: t('Akcije', 'Actions'),
  admin: { components: { Cell: '/components/admin/ListCells#RowActionsCell' } },
}
