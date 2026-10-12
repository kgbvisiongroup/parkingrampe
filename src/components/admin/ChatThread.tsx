'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useCallback, useEffect, useRef, useState } from 'react'

type Msg = { id: number | string; from: 'visitor' | 'admin'; text: string; createdAt: string; authorName?: string | null }

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('sr-Latn-RS', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

/** Live conversation view with a reply box, shown at the top of each chat in the admin panel. */
export function ChatThread() {
  const { id } = useDocumentInfo()
  const [messages, setMessages] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const lastCount = useRef(0)

  const load = useCallback(async () => {
    if (!id) return
    try {
      const res = await fetch(
        `/api/chat-messages?where[chat][equals]=${id}&sort=createdAt&limit=500&depth=0`,
        { credentials: 'include', cache: 'no-store' },
      )
      if (!res.ok) return
      const json = await res.json()
      const docs = json.docs as Msg[]
      setMessages(docs)
      if (docs.length !== lastCount.current) {
        if (docs.length > lastCount.current && docs[docs.length - 1]?.from === 'visitor' && document.visibilityState === 'visible') {
          void fetch('/api/chat/read', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          })
        }
        lastCount.current = docs.length
      }
    } catch {}
  }, [id])

  useEffect(() => {
    void load()
    const timer = setInterval(load, 4000)
    return () => clearInterval(timer)
  }, [load])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  async function send(e?: React.FormEvent) {
    e?.preventDefault()
    const message = text.trim()
    if (!message || !id) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/chat/reply', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, message }),
      })
      if (!res.ok) throw new Error()
      setText('')
      await load()
    } catch {
      setError('Odgovor nije poslat. Proverite vezu i pokušajte ponovo.')
    } finally {
      setSending(false)
    }
  }

  if (!id) return null

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Razgovor</h3>
        <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>Osvežava se automatski</span>
      </div>
      <div
        ref={listRef}
        style={{
          background: 'var(--theme-elevation-50)',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 8,
          padding: 16,
          height: 420,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {messages.length === 0 && <p style={{ color: 'var(--theme-elevation-500)', margin: 'auto' }}>Još nema poruka.</p>}
        {messages.map((m) => {
          const mine = m.from === 'admin'
          return (
            <div key={m.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <div
                style={{
                  background: mine ? 'var(--theme-success-500, #2bb04a)' : 'var(--theme-elevation-0)',
                  color: mine ? '#fff' : 'var(--theme-text)',
                  border: mine ? 'none' : '1px solid var(--theme-elevation-150)',
                  borderRadius: 12,
                  padding: '8px 12px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.45,
                }}
              >
                {m.text}
              </div>
              <div style={{ fontSize: 11, color: 'var(--theme-elevation-500)', marginTop: 3, textAlign: mine ? 'right' : 'left' }}>
                {mine ? m.authorName || 'Mi' : 'Posetilac'} · {fmt(m.createdAt)}
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={send} style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'flex-end' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
          rows={2}
          placeholder="Napišite odgovor… (Enter šalje, Shift+Enter novi red)"
          style={{
            flex: 1,
            resize: 'vertical',
            padding: '10px 12px',
            borderRadius: 6,
            border: '1px solid var(--theme-elevation-200)',
            background: 'var(--theme-input-bg, var(--theme-elevation-0))',
            color: 'var(--theme-text)',
            font: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          style={{
            padding: '11px 18px',
            borderRadius: 6,
            border: 0,
            background: 'var(--theme-elevation-800)',
            color: 'var(--theme-elevation-0)',
            fontWeight: 600,
            cursor: sending ? 'wait' : 'pointer',
            opacity: sending || !text.trim() ? 0.6 : 1,
          }}
        >
          {sending ? 'Šaljem…' : 'Pošalji'}
        </button>
      </form>
      {error && <p style={{ color: 'var(--theme-error-500)', marginTop: 6 }}>{error}</p>}
    </div>
  )
}
