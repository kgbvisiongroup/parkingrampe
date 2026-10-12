'use client'

import { useEffect, useRef, useState } from 'react'

type Counts = { chats: number; inquiries: number }

function useCounts(interval = 15000) {
  const [counts, setCounts] = useState<Counts | null>(null)
  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch('/api/inbox/counts', { credentials: 'include', cache: 'no-store' })
        if (res.ok && alive) setCounts(await res.json())
      } catch {}
    }
    void load()
    const t = setInterval(load, interval)
    return () => {
      alive = false
      clearInterval(t)
    }
  }, [interval])
  return counts
}

function beep() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = 880
    g.gain.setValueAtTime(0.08, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.35)
  } catch {}
}

const badge: React.CSSProperties = {
  minWidth: 20,
  height: 20,
  padding: '0 6px',
  borderRadius: 999,
  background: '#e5252a',
  color: '#fff',
  fontSize: 12,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

/** In the left navigation: live counters for new chat messages and inquiries. */
export function InboxNav() {
  const counts = useCounts()
  const prevChats = useRef<number | null>(null)

  useEffect(() => {
    if (!counts) return
    const total = counts.chats + counts.inquiries
    const base = document.title.replace(/^\(\d+\)\s*/, '')
    document.title = total ? `(${total}) ${base}` : base
    if (prevChats.current !== null && counts.chats > prevChats.current) beep()
    prevChats.current = counts.chats
  }, [counts])

  const row = (href: string, label: string, n: number) => (
    <a
      href={href}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 0',
        color: 'inherit',
        textDecoration: 'none',
        fontWeight: n ? 600 : 400,
      }}
    >
      {label}
      {n > 0 && <span style={badge}>{n}</span>}
    </a>
  )

  return (
    <div style={{ borderTop: '1px solid var(--theme-elevation-100)', marginTop: 12, paddingTop: 12 }}>
      <div style={{ fontSize: 12, color: 'var(--theme-elevation-500)', marginBottom: 4 }}>Prijemno sanduče</div>
      {row('/admin/collections/chats?where[unread][equals]=true', 'Nove chat poruke', counts?.chats ?? 0)}
      {row('/admin/collections/inquiries?where[status][equals]=new', 'Novi upiti', counts?.inquiries ?? 0)}
      <a href="/admin/uvoz-proizvoda" style={{ display: 'block', padding: '6px 0', color: 'inherit', textDecoration: 'none' }}>
        Uvoz proizvoda iz Excela
      </a>
    </div>
  )
}

/** On the dashboard: two large cards that link to unread chats and new inquiries. */
export function InboxDashboard() {
  const counts = useCounts()
  const card = (href: string, title: string, n: number | undefined, empty: string) => (
    <a
      href={href}
      style={{
        flex: '1 1 260px',
        display: 'block',
        padding: '20px 22px',
        borderRadius: 8,
        border: '1px solid var(--theme-elevation-150)',
        background: n ? 'var(--theme-elevation-50)' : 'transparent',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <strong style={{ fontSize: 28 }}>{n ?? '–'}</strong>
        {!!n && <span style={badge}>novo</span>}
      </div>
      <div style={{ marginTop: 4, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--theme-elevation-500)', marginTop: 2 }}>{n ? 'Kliknite da otvorite' : empty}</div>
    </a>
  )
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
      {card('/admin/collections/chats?where[unread][equals]=true', 'Nepročitane chat poruke', counts?.chats, 'Nema novih poruka')}
      {card('/admin/collections/inquiries?where[status][equals]=new', 'Novi upiti sa kontakt forme', counts?.inquiries, 'Nema novih upita')}
    </div>
  )
}
