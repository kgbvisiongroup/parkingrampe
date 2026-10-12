import type { CollectionConfig } from 'payload'
import { loggedIn } from '../access'
import { t } from '../fields/shared'

/** One conversation from the chat bubble on the site. Messages live in `chat-messages`. */
export const Chats: CollectionConfig = {
  slug: 'chats',
  labels: { singular: t('Razgovor', 'Conversation'), plural: t('Chat poruke', 'Chat') },
  admin: {
    useAsTitle: 'visitorName',
    defaultColumns: ['visitorName', 'lastMessage', 'unread', 'lastMessageAt', 'status'],
    group: t('Upiti', 'Inquiries'),
    description: t(
      'Razgovori sa chat ikonice na sajtu. Otvorite razgovor da biste odgovorili – posetilac odgovor vidi odmah.',
      'Conversations from the chat bubble. Open one to reply – the visitor sees your answer right away.',
    ),
    listSearchableFields: ['visitorName', 'contact', 'lastMessage'],
  },
  defaultSort: '-lastMessageAt',
  // Visitors create chats only through /api/chat/* endpoints (token checked there).
  access: { read: loggedIn, create: () => false, update: loggedIn, delete: loggedIn },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation, req, context }) => {
        // When an admin saves the conversation form, keep the live chat fields from the database
        // (the form may be older than the latest visitor message) and treat the chat as read.
        if (operation === 'update' && req.user && !context?.chatEndpoint && originalDoc) {
          data.lastMessage = originalDoc.lastMessage
          data.lastMessageAt = originalDoc.lastMessageAt
          data.token = originalDoc.token
          data.unread = false
        }
        return data
      },
    ],
    afterDelete: [
      async ({ id, req }) => {
        await req.payload.delete({ collection: 'chat-messages', where: { chat: { equals: id } }, req })
      },
    ],
  },
  fields: [
    {
      name: 'thread',
      type: 'ui',
      admin: { components: { Field: '/components/admin/ChatThread#ChatThread' } },
    },
    {
      type: 'row',
      fields: [
        { name: 'visitorName', label: t('Ime posetioca', 'Visitor name'), type: 'text', required: true },
        { name: 'contact', label: t('Telefon / e-mail', 'Phone / email'), type: 'text' },
      ],
    },
    {
      name: 'status',
      label: t('Status', 'Status'),
      type: 'select',
      defaultValue: 'open',
      admin: { position: 'sidebar' },
      options: [
        { label: t('Otvoren', 'Open'), value: 'open' },
        { label: t('Završen', 'Closed'), value: 'closed' },
      ],
    },
    {
      name: 'unread',
      label: t('Nova poruka', 'New message'),
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'lastMessage', label: t('Poslednja poruka', 'Last message'), type: 'text', admin: { readOnly: true } },
    {
      name: 'lastMessageAt',
      label: t('Vreme poslednje poruke', 'Last message at'),
      type: 'date',
      index: true,
      admin: { readOnly: true, position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      type: 'row',
      fields: [
        { name: 'locale', label: t('Jezik', 'Language'), type: 'text', admin: { readOnly: true } },
        { name: 'page', label: t('Stranica sa koje piše', 'Started on page'), type: 'text', admin: { readOnly: true } },
      ],
    },
    { name: 'notes', label: t('Interne beleške', 'Internal notes'), type: 'textarea' },
    { name: 'token', type: 'text', required: true, admin: { hidden: true } },
  ],
}

export const ChatMessages: CollectionConfig = {
  slug: 'chat-messages',
  labels: { singular: t('Poruka', 'Message'), plural: t('Poruke', 'Messages') },
  admin: { hidden: true, useAsTitle: 'text' },
  defaultSort: 'createdAt',
  access: { read: loggedIn, create: () => false, update: () => false, delete: loggedIn },
  fields: [
    { name: 'chat', type: 'relationship', relationTo: 'chats', required: true, index: true },
    {
      name: 'from',
      type: 'select',
      required: true,
      options: [
        { label: t('Posetilac', 'Visitor'), value: 'visitor' },
        { label: t('Mi', 'Us'), value: 'admin' },
      ],
    },
    { name: 'text', type: 'textarea', required: true },
    { name: 'authorName', type: 'text' },
  ],
}
