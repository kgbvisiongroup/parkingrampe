import type { GlobalConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { linkGroup } from '../fields/link'
import { t } from '../fields/shared'
import { revalidateGlobal } from '../hooks/revalidate'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: t('Meni i futer', 'Menu and footer'),
  admin: { group: t('Podešavanja', 'Settings') },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: t('Glavni meni', 'Main menu'),
          fields: [
            {
              name: 'items',
              label: t('Stavke menija', 'Menu items'),
              type: 'array',
              labels: { singular: t('Stavka', 'Item'), plural: t('Stavke', 'Items') },
              admin: { initCollapsed: true },
              fields: [
                { name: 'label', type: 'text', localized: true, required: true, label: t('Naziv u meniju', 'Menu label') },
                {
                  name: 'kind',
                  type: 'select',
                  defaultValue: 'link',
                  required: true,
                  label: t('Vrsta', 'Type'),
                  options: [
                    { label: t('Običan link', 'Simple link'), value: 'link' },
                    { label: t('Veliki meni proizvoda (automatski iz kategorija)', 'Products mega menu (built from categories)'), value: 'products' },
                    { label: t('Padajući meni usluga (automatski)', 'Services dropdown (automatic)'), value: 'services' },
                    { label: t('Padajući meni (ručno)', 'Dropdown (manual)'), value: 'dropdown' },
                  ],
                },
                linkGroup('link', { withLabel: false, label: false, condition: (_, s) => s?.kind !== 'dropdown' }),
                {
                  name: 'children',
                  type: 'array',
                  label: t('Podstavke', 'Sub-items'),
                  admin: { condition: (_, s) => s?.kind === 'dropdown' },
                  fields: [
                    { name: 'label', type: 'text', localized: true, required: true, label: t('Naziv', 'Label') },
                    linkGroup('link', { withLabel: false, label: false }),
                  ],
                },
              ],
            },
            linkGroup('cta', {
              label: t('Istaknuto dugme u meniju (desno)', 'Highlighted menu button (right)'),
            }),
            {
              type: 'row',
              fields: [
                { name: 'showSearch', type: 'checkbox', defaultValue: true, label: t('Prikaži pretragu', 'Show search') },
                { name: 'showPhone', type: 'checkbox', defaultValue: true, label: t('Prikaži telefon', 'Show phone') },
              ],
            },
          ],
        },
        {
          label: t('Futer', 'Footer'),
          fields: [
            {
              name: 'footerColumns',
              label: t('Kolone sa linkovima', 'Link columns'),
              type: 'array',
              maxRows: 3,
              fields: [
                { name: 'title', type: 'text', localized: true, required: true, label: t('Naslov kolone', 'Column title') },
                {
                  name: 'links',
                  type: 'array',
                  label: t('Linkovi', 'Links'),
                  fields: [
                    { name: 'label', type: 'text', localized: true, required: true, label: t('Naziv', 'Label') },
                    linkGroup('link', { withLabel: false, label: false }),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
