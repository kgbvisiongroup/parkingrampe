'use client'

import { useEffect, useRef, useState } from 'react'

export type Counts = { chats: number; inquiries: number }

/* One shared poll for every component that shows the counts (menu, bell, dashboard). */
let current: Counts | null = null
const listeners = new Set<(c: Counts) => void>()
let timer: ReturnType<typeof setInterval> | null = null

async function load() {
  try {
    const res = await fetch('/api/inbox/counts', { credentials: 'include', cache: 'no-store' })
    if (!res.ok) return
    current = (await res.json()) as Counts
    listeners.forEach((l) => l(current!))
  } catch {}
}

/** Number of unread chats and new inquiries, refreshed every 15 s. */
export function useCounts() {
  const [counts, setCounts] = useState<Counts | null>(current)
  useEffect(() => {
    listeners.add(setCounts)
    if (!timer) {
      void load()
      timer = setInterval(load, 15000)
    } else if (current) setCounts(current)
    return () => {
      listeners.delete(setCounts)
      if (!listeners.size && timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, [])
  return counts
}

export function beep() {
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

/** Shows the number of new messages in the browser tab title and beeps on a new chat. Renders nothing. */
export function InboxWatcher({ counts }: { counts: Counts | null }) {
  const prevChats = useRef<number | null>(null)
  useEffect(() => {
    if (!counts) return
    const total = counts.chats + counts.inquiries
    const base = document.title.replace(/^\(\d+\)\s*/, '')
    document.title = total ? `(${total}) ${base}` : base
    if (prevChats.current !== null && counts.chats > prevChats.current) beep()
    prevChats.current = counts.chats
  }, [counts])
  return null
}
