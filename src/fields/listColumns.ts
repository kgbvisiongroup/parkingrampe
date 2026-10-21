import type { CollectionConfig, Field } from 'payload'
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

const DELETE_BUTTON = '/components/admin/ListCells#DocDeleteButton'

/**
 * Edit and delete buttons everywhere in the admin: an "Akcije" column at the end of every list
 * and a "Obriši" button next to "Sačuvaj" in the edit view. Hidden collections are left alone.
 */
export function withActionButtons(c: CollectionConfig): CollectionConfig {
  if (c.admin?.hidden === true) return c
  const named = c.fields.flatMap((f) => ('name' in f && f.type !== 'ui' ? [f.name] : []))
  const has = c.fields.some((f) => 'name' in f && f.name === 'rowActions')
  const title = c.admin?.useAsTitle || (c.upload ? 'filename' : 'id')
  const columns = c.admin?.defaultColumns ?? [title, ...named.filter((n) => n !== title).slice(0, 2)]
  const before = c.admin?.components?.edit?.beforeDocumentControls ?? []
  return {
    ...c,
    fields: has ? c.fields : [...c.fields, actionsColumn],
    admin: {
      ...c.admin,
      defaultColumns: columns.includes('rowActions') ? columns : [...columns, 'rowActions'],
      components: {
        ...c.admin?.components,
        edit: { ...c.admin?.components?.edit, beforeDocumentControls: [...before, DELETE_BUTTON] },
      },
    },
  }
}
