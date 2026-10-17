'use client'

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle, Phone, Send, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dictionary, Locale } from '@/lib/i18n'

type Msg = { id: string | number; from: 'visitor' | 'admin' | 'greeting'; text: string; at: string; author?: string | null }
type Session = { id: number; token: string }

type Props = {
  locale: Locale
  labels: Dictionary['chat']
  agentName: string
  agentTitle?: string | null
  avatarUrl?: string | null
  greeting?: string | null
  phone?: string | null
  whatsapp?: string | null
  viber?: string | null
}

const STORE = 'kgb-chat'
const SEEN = 'kgb-chat-seen'

const read = <T,>(key: string): T | null => {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : null
  } catch {
    return null
  }
}
const write = (key: string, value: unknown) => {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

const time = (iso: string) => new Date(iso).toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' })

/** Chat bubble in the bottom right corner. Messages go to "Chat" in the admin panel. */
export function ChatWidget({ locale, labels, agentName, agentTitle, avatarUrl, greeting, phone, whatsapp, viber }: Props) {
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [unread, setUnread] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [form, setForm] = useState({ name: '', contact: '', message: '' })
  const listRef = useRef<HTMLDivElement>(null)
  const lastAt = useRef<string | null>(null)
  const ids = useRef(new Set<string | number>())

  // Restore a conversation from this browser.
  useEffect(() => {
    const s = read<Session>(STORE)
    if (s?.id && s.token) setSession(s)
    else if (greeting && !read<boolean>(SEEN)) setUnread(1)
    const onOpen = () => setOpen(true)
    window.addEventListener('kgb:open-chat', onOpen)
    return () => window.removeEventListener('kgb:open-chat', onOpen)
  }, [greeting])

  const poll = useCallback(async () => {
    if (!session) return
    try {
      const q = new URLSearchParams({ id: String(session.id), token: session.token })
      if (lastAt.current) q.set('after', lastAt.current)
      const res = await fetch(`/api/chat/messages?${q}`, { cache: 'no-store' })
      if (res.status === 404) {
        write(STORE, null)
        setSession(null)
        setMessages([])
        return
      }
      if (!res.ok) return
      const json = (await res.json()) as { messages: Msg[] }
      if (!json.messages.length) return
      lastAt.current = json.messages[json.messages.length - 1].at
      const fresh = json.messages.filter((m) => !ids.current.has(m.id))
      if (!fresh.length) return
      fresh.forEach((m) => ids.current.add(m.id))
      if (!open) {
        const seenAt = read<string>(SEEN + '-at')
        const newReplies = fresh.filter((m) => m.from === 'admin' && (!seenAt || m.at > seenAt)).length
        if (newReplies) setUnread((u) => u + newReplies)
      }
      setMessages((prev) => [...prev, ...fresh])
    } catch {}
  }, [session, open])

  useEffect(() => {
    if (!session) return
    void poll()
    const t = setInterval(poll, open ? 4000 : 20000)
    return () => clearInterval(t)
  }, [session, open, poll])

  useEffect(() => {
    if (!open) return
    setUnread(0)
    write(SEEN, true)
    write(SEEN + '-at', new Date().toISOString())
  }, [open, messages.length])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, open])

  async function start(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          locale,
          page: window.location.pathname,
          website: (e.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value,
        }),
      })
      if (!res.ok) throw new Error()
      const json = (await res.json()) as { id: number; token: string; messages: Msg[] }
      const s = { id: json.id, token: json.token }
      write(STORE, s)
      lastAt.current = json.messages.at(-1)?.at ?? null
      json.messages.forEach((m) => ids.current.add(m.id))
      setMessages(json.messages)
      setSession(s)
      setForm({ name: '', contact: '', message: '' })
    } catch {
      setError(labels.error)
    } finally {
      setBusy(false)
    }
  }

  async function send(e?: React.FormEvent) {
    e?.preventDefault()
    const message = text.trim()
    if (!message || !session) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...session, message }),
      })
      if (!res.ok) throw new Error()
      const json = (await res.json()) as { message: Msg }
      lastAt.current = json.message.at
      ids.current.add(json.message.id)
      setMessages((prev) => [...prev, json.message])
      setText('')
    } catch {
      setError(labels.error)
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    write(STORE, null)
    setSession(null)
    setMessages([])
    ids.current.clear()
    lastAt.current = null
  }

  const shown: Msg[] = greeting
    ? [{ id: 'greeting', from: 'greeting', text: greeting, at: messages[0]?.at ?? '' }, ...messages]
    : messages

  const avatar = (size: string) =>
    avatarUrl ? (
      <img src={avatarUrl} alt={agentName} className={`${size} rounded-full object-cover`} />
    ) : (
      <span className={`${size} grid place-items-center rounded-full bg-accent text-white`}>
        <MessageCircle className="size-1/2" aria-hidden />
      </span>
    )

  const input = 'w-full border border-line bg-white px-3 py-2.5 text-[14px] text-ink outline-none focus:border-dark'

  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label={labels.title}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[76px] right-0 flex h-[min(560px,calc(100dvh-110px))] w-[min(370px,calc(100vw-32px))] origin-bottom-right flex-col overflow-hidden rounded-xl bg-white shadow-[0_18px_60px_-12px_rgb(0_0_0/0.4)]"
          >
            <header className="flex items-center gap-3 bg-dark px-4 py-3.5 text-white">
              <span className="relative">
                {avatar('size-10')}
                <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-dark bg-[#3fd36a]" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold leading-tight">{agentName}</p>
                <p className="truncate text-[12px] text-white/65">{agentTitle || labels.online}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={labels.close} className="grid size-9 place-items-center text-white/80 hover:text-white">
                <X className="size-5" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#f4f4f4] px-4 py-4" aria-live="polite">
              {shown.map((m) => {
                const mine = m.from === 'visitor'
                return (
                  <div key={m.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[14px] leading-snug ${
                        mine ? 'rounded-br-sm bg-dark text-white' : 'rounded-bl-sm bg-white text-ink shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.at && m.from !== 'greeting' && (
                      <span className="mt-0.5 text-[11px] text-muted">
                        {mine ? labels.you : m.author || agentName} · {time(m.at)}
                      </span>
                    )}
                  </div>
                )
              })}

              {!session && (
                <form onSubmit={start} className="space-y-2.5 rounded-lg bg-white p-3.5 shadow-sm">
                  <p className="text-[13px] text-body">{labels.intro}</p>
                  <input
                    className={input}
                    required
                    maxLength={80}
                    placeholder={labels.name}
                    aria-label={labels.name}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                  />
                  <input
                    className={input}
                    maxLength={120}
                    placeholder={labels.contact}
                    aria-label={labels.contact}
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  />
                  <textarea
                    className={`${input} resize-none`}
                    required
                    rows={3}
                    maxLength={2000}
                    placeholder={labels.message}
                    aria-label={labels.message}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                  <button type="submit" disabled={busy} className="btn-dark w-full py-3 disabled:opacity-60">
                    {labels.start}
                  </button>
                </form>
              )}
              {error && <p className="text-[13px] font-bold text-alert">{error}</p>}
            </div>

            {session && (
              <form onSubmit={send} className="flex items-end gap-2 border-t border-line p-3">
                <textarea
                  rows={1}
                  value={text}
                  maxLength={2000}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void send()
                    }
                  }}
                  placeholder={labels.placeholder}
                  aria-label={labels.placeholder}
                  className="max-h-28 min-h-10 flex-1 resize-none bg-[#f4f4f4] px-3 py-2.5 text-[14px] text-ink outline-none"
                />
                <button type="submit" disabled={busy || !text.trim()} aria-label={labels.send} className="grid size-10 place-items-center bg-dark text-white disabled:opacity-40">
                  <Send className="size-4" />
                </button>
              </form>
            )}

            <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line px-4 py-2 text-[12px] text-muted">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-ink">
                  <Phone className="size-3" aria-hidden /> {labels.call}
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  WhatsApp
                </a>
              )}
              {viber && (
                <a href={`viber://chat?number=%2B${viber.replace(/\D/g, '')}`} className="hover:text-ink">
                  Viber
                </a>
              )}
              {session && (
                <button type="button" onClick={reset} className="ml-auto hover:text-ink">
                  {labels.newChat}
                </button>
              )}
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? labels.close : labels.open}
        aria-expanded={open}
        className={`relative grid size-[60px] place-items-center rounded-full text-white shadow-[0_8px_28px_-6px_rgb(0_0_0/0.45)] transition-[transform,background-color] duration-300 hover:scale-105 ${
          open ? 'bg-dark' : 'bg-accent'
        }`}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-7" strokeWidth={2} aria-hidden />}
        {!open && unread > 0 && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent/40 [animation-duration:2.6s]" aria-hidden />}
        {!open && unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-alert px-1 text-[11px] font-extrabold text-white">
            {unread}
          </span>
        )}
      </button>
    </div>
  )
}
