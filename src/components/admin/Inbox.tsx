'use client'

import { useAuth } from '@payloadcms/ui'
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

function greeting(h: number) {
  if (h < 5 || h >= 18) return 'Dobro veče'
  if (h < 12) return 'Dobro jutro'
  return 'Dobar dan'
}

const icons = {
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />,
  inbox: <path d="M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6l2-8Z" />,
  upload: <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v4h16v-4" />,
}

const StatIcon = ({ name }: { name: keyof typeof icons }) => (
  <span className="kgb-stat__icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {icons[name]}
    </svg>
  </span>
)

/** Dashboard header: date, greeting with the user's name and cards for new chats and inquiries. */
export function InboxDashboard() {
  const counts = useCounts()
  const { user } = useAuth<{ name?: string | null; email?: string }>()
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => setNow(new Date()), [])

  const name = user?.name || user?.email?.split('@')[0] || ''
  const date = now?.toLocaleDateString('sr-Latn-RS', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const stat = (href: string, icon: keyof typeof icons, value: number | string | undefined, label: string, badgeText?: string) => (
    <a href={href} className="kgb-stat">
      <div className="kgb-stat__top">
        <StatIcon name={icon} />
        <span className="kgb-stat__value">{value ?? '–'}</span>
        {badgeText && <span className="kgb-stat__badge">{badgeText}</span>}
      </div>
      <div className="kgb-stat__label">{label}</div>
    </a>
  )

  return (
    <>
      <div className="kgb-hero">
        <div className="kgb-hero__date">{date ?? '\u00a0'}</div>
        <h1 className="kgb-hero__title">
          {now ? greeting(now.getHours()) : 'Dobrodošli'}
          {name && (
            <>
              , <span>{name}</span>
            </>
          )}
        </h1>
        <div className="kgb-hero__sub">Upravljanje sajtom parkingrampe.rs na jednom mestu.</div>
      </div>
      <div className="kgb-stats">
        {stat('/admin/collections/chats?where[unread][equals]=true', 'chat', counts?.chats, 'Nepročitane chat poruke', counts?.chats ? 'Novo' : undefined)}
        {stat('/admin/collections/inquiries?where[status][equals]=new', 'inbox', counts?.inquiries, 'Novi upiti sa kontakt forme', counts?.inquiries ? 'Novo' : undefined)}
        {stat('/admin/uvoz-proizvoda', 'upload', 'Excel', 'Uvoz proizvoda')}
      </div>
    </>
  )
}
