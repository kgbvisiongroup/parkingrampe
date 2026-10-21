import type { CollectionConfig } from 'payload'
import { loggedIn } from '../access'
import { t } from '../fields/shared'
import { receivedAt, renderNotification, siteAddress } from '../lib/notificationEmail'

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
        const to = process.env.CONTACT_EMAIL_TO || 'office@parkingrampe.rs'
        if (operation !== 'create' || !to || !process.env.SMTP_HOST) return doc
        try {
          const { html, text } = renderNotification({
            eyebrow: 'Novi upit',
            title: 'Poruka sa kontakt forme',
            intro: 'Neko vas je upravo kontaktirao putem sajta. Detalji su ispod.',
            rows: [
              { label: 'Ime', value: doc.name },
              { label: 'Email', value: doc.email || '', href: doc.email ? `mailto:${doc.email}` : undefined },
              { label: 'Telefon', value: doc.phone || '', href: doc.phone ? `tel:${String(doc.phone).replace(/[^\d+]/g, '')}` : undefined },
              { label: 'Usluga', value: doc.service || '' },
              { label: 'Jezik', value: String(doc.locale || '').toUpperCase() },
              { label: 'Stranica', value: doc.pageUrl || '' },
              { label: 'Primljeno', value: receivedAt(new Date(doc.createdAt)) },
            ],
            messageLabel: 'Poruka',
            message: doc.message,
            // Opens a reply to the customer straight away (subject and quoted message filled in).
            button: {
              label: 'Odgovori odmah na poruku',
              href: doc.email
                ? `mailto:${doc.email}?subject=${encodeURIComponent(`Re: Upit sa sajta${doc.service ? ` – ${doc.service}` : ''}`)}&body=${encodeURIComponent(
                    `Poštovani/a ${doc.name},\n\n\n\n---\nVaša poruka:\n${String(doc.message).slice(0, 1500)}`,
                  )}`
                : `${siteAddress()}/admin/collections/inquiries/${doc.id}`,
            },
          })
          // "Reply" in the mail program answers the customer directly.
          await req.payload.sendEmail({
            to,
            replyTo: doc.email ? `${doc.name} <${doc.email}>` : undefined,
            subject: `Novi upit sa sajta: ${doc.name}${doc.service ? ` – ${doc.service}` : ''}`,
            html,
            text,
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
