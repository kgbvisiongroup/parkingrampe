import type { Field } from 'payload'
import { t } from './shared'

export const linkTargets = ['pages', 'services', 'product-categories', 'products', 'projects'] as const

type Options = {
  label?: Record<string, string> | false
  withLabel?: boolean
  description?: Record<string, string>
  condition?: (data: any, sibling: any) => boolean
}

/** A link to a page of the site (picked from a list) or to any URL. */
export function linkGroup(name = 'link', { label, withLabel = true, description, condition }: Options = {}): Field {
  const fields: Field[] = []
  if (withLabel) {
    fields.push({ name: 'label', type: 'text', localized: true, label: t('Tekst dugmeta / linka', 'Button / link text') })
  }
  fields.push(
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'internal',
          label: t('Vodi na', 'Links to'),
          options: [
            { label: t('Stranicu sajta', 'A page of this site'), value: 'internal' },
            { label: t('Drugu adresu (URL)', 'Another address (URL)'), value: 'custom' },
          ],
          admin: { layout: 'horizontal' },
        },
        { name: 'newTab', type: 'checkbox', label: t('Otvori u novom tabu', 'Open in new tab') },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: [...linkTargets],
      label: t('Stranica', 'Page'),
      admin: { condition: (_, sibling) => sibling?.type !== 'custom' },
    },
    {
      name: 'url',
      type: 'text',
      localized: true,
      label: 'URL',
      admin: {
        condition: (_, sibling) => sibling?.type === 'custom',
        description: t('Npr. /sr/kontakt, https://… ili tel:+381…', 'E.g. /en/contact, https://… or tel:+381…'),
      },
    },
  )
  return {
    name,
    type: 'group',
    label: label === false ? false : (label ?? t('Link', 'Link')),
    admin: { hideGutter: true, description, condition },
    fields,
  }
}
