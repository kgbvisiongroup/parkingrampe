import type { GlobalConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { t } from '../fields/shared'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'settings',
  label: t('Podešavanja sajta', 'Site settings'),
  admin: { group: t('Podešavanja', 'Settings') },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: t('Osnovno', 'General'),
          fields: [
            { name: 'siteName', label: t('Naziv sajta', 'Site name'), type: 'text', required: true, defaultValue: 'KGB Automation' },
            { name: 'logo', label: t('Logo (svetli, za tamnu pozadinu)', 'Logo (light, for dark background)'), type: 'upload', relationTo: 'media' },
            { name: 'favicon', label: t('Ikonica sajta (favicon)', 'Favicon'), type: 'upload', relationTo: 'media' },
            { name: 'footerText', label: t('Tekst u futeru', 'Footer text'), type: 'textarea', localized: true },
          ],
        },
        {
          label: t('Kontakt', 'Contact'),
          fields: [
            { name: 'phone', label: t('Telefon (za poziv, npr. +381665101150)', 'Phone (dial format)'), type: 'text' },
            { name: 'phoneDisplay', label: t('Telefon (kako se prikazuje)', 'Phone (as displayed)'), type: 'text' },
            { name: 'email', label: t('E-mail', 'Email'), type: 'email' },
            { name: 'address', label: t('Adresa', 'Address'), type: 'text', localized: true },
            { name: 'mapsUrl', label: t('Link ka Google mapi', 'Google Maps link'), type: 'text' },
            {
              name: 'mapEmbedUrl',
              label: t('Google Maps "embed" link (za mapu na kontakt strani)', 'Google Maps embed URL'),
              type: 'text',
            },
            { name: 'workingHours', label: t('Radno vreme', 'Working hours'), type: 'textarea', localized: true },
            {
              name: 'socials',
              label: t('Društvene mreže', 'Social profiles'),
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  label: t('Mreža', 'Platform'),
                  type: 'select',
                  required: true,
                  options: ['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin'].map((v) => ({
                    label: v.charAt(0).toUpperCase() + v.slice(1),
                    value: v,
                  })),
                },
                { name: 'url', label: 'URL', type: 'text', required: true },
                { name: 'handle', label: t('Korisničko ime (npr. @kgbvision)', 'Handle (e.g. @kgbvision)'), type: 'text' },
              ],
            },
          ],
        },
        {
          label: t('Izgled', 'Appearance'),
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'accentColor',
                  label: t('Boja istaknutog dugmeta', 'Highlight button colour'),
                  type: 'text',
                  defaultValue: '#2bb04a',
                  admin: { description: t('HEX boja, npr. #2bb04a (zelena) ili #e30613 (crvena).', 'HEX colour, e.g. #2bb04a or #e30613.') },
                  validate: (v: unknown) => !v || /^#[0-9a-fA-F]{6}$/.test(String(v)) || 'Format: #RRGGBB',
                },
                {
                  name: 'darkColor',
                  label: t('Tamna boja (dugmad, trake, futer)', 'Dark colour (buttons, bars, footer)'),
                  type: 'text',
                  defaultValue: '#2f3336',
                  validate: (v: unknown) => !v || /^#[0-9a-fA-F]{6}$/.test(String(v)) || 'Format: #RRGGBB',
                },
                {
                  name: 'greyColor',
                  label: t('Siva pozadina traka', 'Grey band background'),
                  type: 'text',
                  defaultValue: '#ededed',
                  validate: (v: unknown) => !v || /^#[0-9a-fA-F]{6}$/.test(String(v)) || 'Format: #RRGGBB',
                },
              ],
            },
          ],
        },
        {
          label: 'Chat',
          description: t(
            'Chat ikonica u donjem desnom uglu sajta. Poruke stižu u „Chat poruke” u admin panelu.',
            'Chat bubble in the bottom right corner. Messages arrive under "Chat" in the admin panel.',
          ),
          fields: [
            {
              name: 'chat',
              type: 'group',
              label: false,
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true, label: t('Uključi chat na sajtu', 'Show chat on the site') },
                {
                  type: 'row',
                  fields: [
                    { name: 'agentName', type: 'text', label: t('Ime koje posetilac vidi', 'Name visitors see'), defaultValue: 'KGB Automation' },
                    {
                      name: 'agentTitle',
                      type: 'text',
                      localized: true,
                      label: t('Tekst ispod imena', 'Text under the name'),
                    },
                  ],
                },
                { name: 'avatar', type: 'upload', relationTo: 'media', label: t('Slika (avatar)', 'Avatar image') },
                {
                  name: 'greeting',
                  type: 'textarea',
                  localized: true,
                  label: t('Pozdravna poruka', 'Greeting message'),
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'whatsapp', type: 'text', label: t('WhatsApp broj (npr. 381665101150)', 'WhatsApp number') },
                    { name: 'viber', type: 'text', label: t('Viber broj (npr. 381665101150)', 'Viber number') },
                  ],
                },
                {
                  name: 'notifyEmail',
                  type: 'email',
                  label: t('Pošalji e-mail obaveštenje na novu poruku (opciono)', 'Email me about new chats (optional)'),
                  admin: { description: t('Radi kada je podešen SMTP (vidi README).', 'Works when SMTP is configured.') },
                },
              ],
            },
          ],
        },
        {
          label: t('Podaci o firmi', 'Company details'),
          fields: [
            { name: 'legalName', label: t('Pun naziv firme', 'Legal name'), type: 'text' },
            { name: 'pib', label: 'PIB', type: 'text' },
            { name: 'mb', label: t('Matični broj', 'Registration number'), type: 'text' },
            { name: 'activityCode', label: t('Šifra delatnosti', 'Activity code'), type: 'text' },
            { name: 'bankAccount', label: t('Tekući račun', 'Bank account'), type: 'text' },
          ],
        },
        {
          label: 'SEO',
          description: t(
            'Podrazumevana SEO podešavanja. Svaka stranica i usluga ima i svoj SEO tab koji ima prednost.',
            'Default SEO settings. Every page and service also has its own SEO tab, which takes priority.',
          ),
          fields: [
            {
              name: 'titleTemplate',
              label: t('Dodatak naslovu', 'Title suffix'),
              type: 'text',
              defaultValue: '| KGB Automation',
              admin: { description: t('Dodaje se iza naslova svake stranice u Google rezultatima.', 'Appended to every page title.') },
            },
            {
              name: 'defaultDescription',
              label: t('Podrazumevani opis', 'Default description'),
              type: 'textarea',
              localized: true,
              maxLength: 170,
            },
            { name: 'defaultOgImage', label: t('Podrazumevana slika za deljenje', 'Default share image'), type: 'upload', relationTo: 'media' },
            { name: 'keywords', label: t('Ključne reči', 'Keywords'), type: 'text', localized: true },
            { name: 'googleVerification', label: 'Google Search Console verification', type: 'text' },
            { name: 'bingVerification', label: 'Bing verification (msvalidate.01)', type: 'text' },
            { name: 'yandexVerification', label: 'Yandex verification', type: 'text' },
            {
              name: 'gaMeasurementId',
              label: 'Google Analytics 4 ID (G-XXXXXXX)',
              type: 'text',
            },
            {
              name: 'noIndexSite',
              label: t('Sakrij ceo sajt od pretraživača (samo za testiranje)', 'Hide entire site from search engines (testing only)'),
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}
