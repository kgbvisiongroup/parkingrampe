'use client'

import { useLocale, useTheme, useTranslation } from '@payloadcms/ui'
import { Bell, CornerDownLeft, Moon, Search, Sun } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { tx } from './adminText'
import { useCounts } from './Inbox'

type Dest = { href: string; sr: string; en: string; keywords?: string }

const DESTINATIONS: Dest[] = [
  { href: '/admin', sr: 'Kontrolna tabla', en: 'Dashboard' },
  { href: '/admin/collections/products', sr: 'Proizvodi', en: 'Products', keywords: 'artikli katalog' },
  { href: '/admin/collections/products/create', sr: 'Novi proizvod', en: 'New product', keywords: 'dodaj' },
  { href: '/admin/collections/product-categories', sr: 'Kategorije proizvoda', en: 'Product categories' },
  { href: '/admin/uvoz-proizvoda', sr: 'Uvoz proizvoda iz Excela', en: 'Import products from Excel', keywords: 'xlsx zip' },
  { href: '/admin/collections/chats', sr: 'Chat poruke', en: 'Chat messages', keywords: 'sanduče inbox' },
  { href: '/admin/collections/inquiries', sr: 'Upiti sa sajta', en: 'Website inquiries', keywords: 'kontakt forma' },
  { href: '/admin/globals/home', sr: 'Početna strana', en: 'Home page', keywords: 'slajder sekcije' },
  { href: '/admin/collections/pages', sr: 'Stranice', en: 'Pages', keywords: 'o nama kontakt' },
  { href: '/admin/collections/services', sr: 'Usluge', en: 'Services' },
  { href: '/admin/collections/projects', sr: 'Portfolio projekti', en: 'Portfolio projects' },
  { href: '/admin/collections/faqs', sr: 'Česta pitanja', en: 'FAQ' },
  { href: '/admin/collections/clients', sr: 'Klijenti', en: 'Clients' },
  { href: '/admin/collections/media', sr: 'Slike i fajlovi', en: 'Media', keywords: 'fotografije video pdf' },
  { href: '/admin/globals/settings', sr: 'Podešavanja sajta', en: 'Site settings', keywords: 'telefon adresa boje chat seo' },
  { href: '/admin/globals/navigation', sr: 'Meni i futer', en: 'Menu and footer' },
  { href: '/admin/collections/users', sr: 'Korisnici', en: 'Users' },
  { href: '/admin/account', sr: 'Moj profil i lozinka', en: 'My profile and password' },
]

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'dj')

/** Right side of the admin header: search (⌘K), SR/EN switch, light/dark theme, notifications. */
export function HeaderActions() {
  const { i18n, switchLanguage } = useTranslation()
  const lang = i18n.language
  const { theme, setTheme } = useTheme()
  const counts = useCounts()
  const total = counts ? counts.chats + counts.inquiries : 0

  // Dark theme is the default until the user picks one.
  useEffect(() => {
    if (!document.cookie.split('; ').some((c) => c.startsWith('kgb-theme='))) setTheme('dark')
  }, [setTheme])

  // One switch for both: the admin language and the language of the content being edited.
  const locale = useLocale()
  const wanted = lang === 'en' ? 'en' : 'sr'
  const activeCode = lang === 'en' ? 'en' : 'rs-latin'
  useEffect(() => {
    // Payload remembers the last content language; keep it in step with the admin language.
    if (locale?.code && locale.code !== wanted) {
      const url = new URL(window.location.href)
      url.searchParams.set('locale', wanted)
      window.location.replace(url.toString())
    }
  }, [locale?.code, wanted])
  const switchAll = async (code: 'rs-latin' | 'en') => {
    if (code === lang) return
    await switchLanguage?.(code)
    const url = new URL(window.location.href)
    url.searchParams.set('locale', code === 'en' ? 'en' : 'sr')
    window.location.assign(url.toString())
  }

  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      setQ('')
      setSel(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  const results = useMemo(() => {
    const n = norm(q.trim())
    const list: { href: string; label: string; hint?: string }[] = DESTINATIONS.filter(
      (d) => !n || norm(`${d.sr} ${d.en} ${d.keywords ?? ''}`).includes(n),
    ).map((d) => ({ href: d.href, label: tx(lang, d.sr, d.en) }))
    if (n) {
      const s = encodeURIComponent(q.trim())
      list.unshift(
        { href: `/admin/collections/products?search=${s}`, label: `${tx(lang, 'Traži u proizvodima', 'Search products')}: „${q.trim()}“`, hint: '↵' },
        { href: `/admin/collections/pages?search=${s}`, label: `${tx(lang, 'Traži u stranicama', 'Search pages')}: „${q.trim()}“` },
      )
    }
    return list.slice(0, 9)
  }, [q, lang])

  const go = useCallback((href?: string) => {
    if (!href) return
    setOpen(false)
    window.location.assign(href)
  }, [])

  return (
    <div className="kgb-actions">
      <button type="button" className="kgb-search" onClick={() => setOpen(true)}>
        <Search size={15} aria-hidden />
        <span>{tx(lang, 'Pretraži sve', 'Search everything')}</span>
        <kbd>⌘K</kbd>
      </button>

      <div className="kgb-lang" role="group" aria-label={tx(lang, 'Jezik', 'Language')}>
        {(['rs-latin', 'en'] as const).map((code) => (
          <button
            key={code}
            type="button"
            className={activeCode === code ? 'is-active' : ''}
            aria-pressed={activeCode === code}
            onClick={() => void switchAll(code)}
          >
            {code === 'en' ? 'EN' : 'SR'}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="kgb-icon-btn"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={tx(lang, 'Svetla / tamna tema', 'Light / dark theme')}
        title={tx(lang, 'Svetla / tamna tema', 'Light / dark theme')}
      >
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <a
        href={counts?.chats ? '/admin/collections/chats?where[unread][equals]=true' : '/admin/collections/inquiries?where[status][equals]=new'}
        className="kgb-icon-btn"
        aria-label={tx(lang, 'Obaveštenja', 'Notifications')}
        title={tx(lang, `Nove poruke: ${total}`, `New messages: ${total}`)}
      >
        <Bell size={17} />
        {total > 0 && <span className="kgb-dot">{total > 99 ? '99+' : total}</span>}
      </a>

      {open && (
        <div className="kgb-palette" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="kgb-palette__box">
            <div className="kgb-palette__input">
              <Search size={18} aria-hidden />
              <input
                ref={inputRef}
                value={q}
                placeholder={tx(lang, 'Šta tražite? Proizvod, stranica, podešavanje…', 'What are you looking for? Product, page, setting…')}
                onChange={(e) => {
                  setQ(e.target.value)
                  setSel(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSel((s) => Math.min(s + 1, results.length - 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setSel((s) => Math.max(s - 1, 0))
                  } else if (e.key === 'Enter') go(results[sel]?.href)
                }}
              />
              <kbd>Esc</kbd>
            </div>
            <ul className="kgb-palette__list">
              {results.map((r, i) => (
                <li key={r.href + i}>
                  <button type="button" className={i === sel ? 'is-active' : ''} onMouseEnter={() => setSel(i)} onClick={() => go(r.href)}>
                    <span>{r.label}</span>
                    {i === sel && <CornerDownLeft size={14} aria-hidden />}
                  </button>
                </li>
              ))}
              {!results.length && <li className="kgb-palette__empty">{tx(lang, 'Nema rezultata.', 'No results.')}</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
