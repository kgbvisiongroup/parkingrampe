import type { GlobalConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { layoutField } from '../blocks/config'
import { t } from '../fields/shared'
import { revalidateGlobal } from '../hooks/revalidate'

export const Home: GlobalConfig = {
  slug: 'home',
  label: t('Početna strana', 'Home page'),
  admin: {
    group: t('Sadržaj', 'Content'),
    description: t(
      'Početna strana je sastavljena od sekcija. Dodajte nove, menjajte redosled prevlačenjem ili ih obrišite.',
      'The home page is built from sections. Add new ones, drag to reorder or remove them.',
    ),
  },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'heading',
      label: t('Glavni naslov strane (H1)', 'Main page heading (H1)'),
      type: 'text',
      localized: true,
      admin: {
        description: t(
          'Ne vidi se na ekranu (prvi je slajder), ali ga čita Google. Treba da se razlikuje od SEO naslova. Prazno = automatski.',
          'Not visible (the slider comes first) but read by Google. Should differ from the SEO title. Empty = automatic.',
        ),
      },
    },
    layoutField(),
  ],
}
