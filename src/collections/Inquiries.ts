import type { CollectionConfig } from 'payload'
import { loggedIn } from '../access'
import { t } from '../fields/shared'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: t('Upit', 'Inquiry'), plural: t('Upiti sa sajta', 'Inquiries') },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email', 'service', 'status', 'createdAt'],
    group: t('Upiti', 'Inquiries'),
  },
  defaultSort: '-createdAt',
  // Created only through the contact form server action (with validation and spam check).
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        const to = process.env.CONTACT_EMAIL_TO || 'office@kgb.co.rs'
        if (operation !== 'create' || !to || !process.env.SMTP_HOST) return doc
        try {
          await req.payload.sendEmail({
            to,
            replyTo: doc.email || undefined,
            subject: `Novi upit sa sajta: ${doc.name}`,
            text: [
              `Ime: ${doc.name}`,
              `Telefon: ${doc.phone || '-'}`,
              `E-mail: ${doc.email || '-'}`,
              `Usluga: ${doc.service || '-'}`,
              `Jezik: ${doc.locale}`,
              '',
              doc.message,
            ].join('\n'),
          })
        } catch (err) {
          req.payload.logger.error({ err, msg: 'Slanje e-maila za upit nije uspelo' })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'status',
      label: t('Status', 'Status'),
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: t('Novo', 'New'), value: 'new' },
        { label: t('U obradi', 'In progress'), value: 'progress' },
        { label: t('Završeno', 'Done'), value: 'done' },
      ],
    },
    { name: 'name', label: t('Ime', 'Name'), type: 'text', required: true },
    { name: 'phone', label: t('Telefon', 'Phone'), type: 'text' },
    { name: 'email', label: t('E-mail', 'Email'), type: 'email' },
    { name: 'service', label: t('Usluga', 'Service'), type: 'text' },
    { name: 'message', label: t('Poruka', 'Message'), type: 'textarea', required: true },
    { name: 'locale', label: t('Jezik', 'Language'), type: 'text', admin: { readOnly: true } },
    { name: 'pageUrl', label: t('Poslato sa stranice', 'Sent from page'), type: 'text', admin: { readOnly: true } },
    { name: 'notes', label: t('Interne beleške', 'Internal notes'), type: 'textarea' },
  ],
}
