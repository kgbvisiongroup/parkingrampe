import crypto from 'node:crypto'
import type { Endpoint, PayloadRequest } from 'payload'

const MAX_TEXT = 2000
const hits = new Map<string, number[]>()

function ipOf(req: PayloadRequest) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
}

/** At most `max` actions per IP in 10 minutes. */
function limited(req: PayloadRequest, key: string, max: number) {
  const id = `${key}:${ipOf(req)}`
  const now = Date.now()
  const recent = (hits.get(id) ?? []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(id, recent)
  return recent.length > max
}

async function body(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await req.json?.()) ?? {}) as Record<string, unknown>
  } catch {
    return {}
  }
}

const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

const bad = (status: number, error: string) => Response.json({ error }, { status })

/** Loads a chat and checks the visitor's secret token in constant time. */
async function chatForVisitor(req: PayloadRequest, id: unknown, token: unknown) {
  const numId = Number(id)
  if (!numId || typeof token !== 'string' || !token) return null
  const chat = await req.payload
    .findByID({ collection: 'chats', id: numId, depth: 0, overrideAccess: true })
    .catch(() => null)
  if (!chat?.token) return null
  const a = Buffer.from(chat.token)
  const b = Buffer.from(token)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  return chat
}

async function notify(req: PayloadRequest, subject: string, text: string) {
  try {
    const settings = await req.payload.findGlobal({ slug: 'settings', depth: 0 })
    const to = settings.chat?.notifyEmail || process.env.CONTACT_EMAIL_TO || 'office@kgb.co.rs'
    if (!to || !process.env.SMTP_HOST) return
    await req.payload.sendEmail({ to, subject, text })
  } catch (err) {
    req.payload.logger.error({ err, msg: 'Chat e-mail obaveštenje nije poslato' })
  }
}

function publicMessage(m: { id: number | string; from: string; text: string; createdAt: string; authorName?: string | null }) {
  return { id: m.id, from: m.from, text: m.text, at: m.createdAt, author: m.from === 'admin' ? m.authorName || null : null }
}

export const chatEndpoints: Endpoint[] = [
  {
    path: '/chat/start',
    method: 'post',
    handler: async (req) => {
      const data = await body(req)
      if (str(data.website, 100)) return Response.json({ ok: true }) // honeypot
      if (limited(req, 'start', 5)) return bad(429, 'too_many')
      const name = str(data.name, 80)
      const text = str(data.message, MAX_TEXT)
      if (!name || !text) return bad(400, 'missing')
      const token = crypto.randomBytes(24).toString('base64url')
      const now = new Date().toISOString()
      const chat = await req.payload.create({
        collection: 'chats',
        overrideAccess: true,
        data: {
          visitorName: name,
          contact: str(data.contact, 120),
          locale: str(data.locale, 5),
          page: str(data.page, 300),
          status: 'open',
          unread: true,
          lastMessage: text.slice(0, 140),
          lastMessageAt: now,
          token,
        },
      })
      const msg = await req.payload.create({
        collection: 'chat-messages',
        overrideAccess: true,
        data: { chat: chat.id, from: 'visitor', text },
      })
      void notify(req, `Novi chat na sajtu: ${name}`, `${name} (${chat.contact || 'bez kontakta'}) piše:\n\n${text}\n\nOdgovorite u admin panelu: /admin/collections/chats/${chat.id}`)
      return Response.json({ id: chat.id, token, messages: [publicMessage(msg)] })
    },
  },
  {
    path: '/chat/send',
    method: 'post',
    handler: async (req) => {
      const data = await body(req)
      if (limited(req, 'send', 40)) return bad(429, 'too_many')
      const chat = await chatForVisitor(req, data.id, data.token)
      if (!chat) return bad(404, 'not_found')
      const text = str(data.message, MAX_TEXT)
      if (!text) return bad(400, 'missing')
      const msg = await req.payload.create({
        collection: 'chat-messages',
        overrideAccess: true,
        data: { chat: chat.id, from: 'visitor', text },
      })
      await req.payload.update({
        collection: 'chats',
        id: chat.id,
        overrideAccess: true,
        context: { chatEndpoint: true },
        data: { unread: true, status: 'open', lastMessage: text.slice(0, 140), lastMessageAt: new Date().toISOString() },
      })
      return Response.json({ message: publicMessage(msg) })
    },
  },
  {
    path: '/chat/messages',
    method: 'get',
    handler: async (req) => {
      const url = new URL(req.url || '', 'http://local')
      const chat = await chatForVisitor(req, url.searchParams.get('id'), url.searchParams.get('token'))
      if (!chat) return bad(404, 'not_found')
      const after = url.searchParams.get('after')
      const res = await req.payload.find({
        collection: 'chat-messages',
        overrideAccess: true,
        depth: 0,
        limit: 300,
        sort: 'createdAt',
        where: {
          and: [{ chat: { equals: chat.id } }, ...(after ? [{ createdAt: { greater_than: after } }] : [])],
        },
      })
      return Response.json({ status: chat.status, messages: res.docs.map(publicMessage) })
    },
  },
  {
    path: '/chat/reply',
    method: 'post',
    handler: async (req) => {
      if (!req.user) return bad(401, 'unauthorized')
      const data = await body(req)
      const id = Number(data.id)
      const text = str(data.message, MAX_TEXT)
      if (!id || !text) return bad(400, 'missing')
      const author = (req.user as { name?: string | null; email?: string }).name || null
      const msg = await req.payload.create({
        collection: 'chat-messages',
        overrideAccess: true,
        data: { chat: id, from: 'admin', text, authorName: author },
      })
      await req.payload.update({
        collection: 'chats',
        id,
        overrideAccess: true,
        context: { chatEndpoint: true },
        data: { unread: false, lastMessage: `↩ ${text.slice(0, 138)}`, lastMessageAt: new Date().toISOString() },
      })
      return Response.json({ message: publicMessage(msg) })
    },
  },
  {
    path: '/chat/read',
    method: 'post',
    handler: async (req) => {
      if (!req.user) return bad(401, 'unauthorized')
      const data = await body(req)
      const id = Number(data.id)
      if (!id) return bad(400, 'missing')
      await req.payload.update({ collection: 'chats', id, overrideAccess: true, context: { chatEndpoint: true }, data: { unread: false } })
      return Response.json({ ok: true })
    },
  },
  {
    path: '/inbox/counts',
    method: 'get',
    handler: async (req) => {
      if (!req.user) return bad(401, 'unauthorized')
      const [chats, inquiries] = await Promise.all([
        req.payload.count({ collection: 'chats', where: { unread: { equals: true } }, overrideAccess: true }),
        req.payload.count({ collection: 'inquiries', where: { status: { equals: 'new' } }, overrideAccess: true }),
      ])
      return Response.json({ chats: chats.totalDocs, inquiries: inquiries.totalDocs })
    },
  },
]
