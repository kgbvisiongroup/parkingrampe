'use client'

import { useNav } from '@payloadcms/ui'
import {
  ChevronDown,
  ChevronsLeft,
  CircleHelp,
  ExternalLink,
  File,
  Folder,
  Globe,
  Home,
  Image as ImageIcon,
  Inbox,
  Layers,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MessagesSquare,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  SlidersHorizontal,
  Upload,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { tx, type AdminLang } from './adminText'
import { InboxWatcher, useCounts } from './Inbox'

const icons = {
  globe: Globe,
  home: Home,
  file: File,
  wrench: Wrench,
  image: ImageIcon,
  help: CircleHelp,
  users: Users,
  folder: Folder,
  cart: ShoppingCart,
  package: Package,
  layers: Layers,
  upload: Upload,
  messages: MessagesSquare,
  chat: MessageCircle,
  inbox: Inbox,
  settings: Settings,
  sliders: SlidersHorizontal,
  menu: Menu,
  shield: Shield,
}

export type NavIcon = keyof typeof icons
export type NavItem = { href: string | null; icon: NavIcon; label: [string, string]; badge?: 'chats' | 'inquiries' }
export type NavSection = { key: string; icon: NavIcon; label: [string, string]; items: NavItem[] }

const Shield2 = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z" fill="#2bb04a" />
    <path d="m8.5 12 2.4 2.4 4.6-4.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const STORAGE = 'kgb-nav-open'

export function AdminNavClient({ lang, sections }: { lang: AdminLang; sections: NavSection[] }) {
  const pathname = usePathname() || ''
  const counts = useCounts()
  const { setNavOpen } = useNav()
  const l = (pair: [string, string]) => tx(lang, pair[0], pair[1])

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/'))
  const sectionWithActive = sections.find((s) => s.items.some((i) => isActive(i.href!)))?.key

  // Open groups are remembered; the group of the current page is always open.
  const [open, setOpen] = useState<Record<string, boolean>>({})
  useEffect(() => {
    try {
      setOpen(JSON.parse(localStorage.getItem(STORAGE) || '{}'))
    } catch {}
  }, [])
  const toggle = (key: string) =>
    setOpen((o) => {
      const next = { ...o, [key]: !(o[key] ?? key === sectionWithActive) }
      try {
        localStorage.setItem(STORAGE, JSON.stringify(next))
      } catch {}
      return next
    })

  const total = counts ? counts.chats + counts.inquiries : 0

  const link = (href: string, Icon: typeof Home, label: string, badge?: number, opts?: { external?: boolean }) => (
    <a
      key={href}
      href={href}
      className={`kgb-nav__link${isActive(href) ? ' is-active' : ''}`}
      target={opts?.external ? '_blank' : undefined}
      rel={opts?.external ? 'noopener noreferrer' : undefined}
    >
      <Icon size={18} strokeWidth={1.8} aria-hidden />
      <span className="kgb-nav__text">{label}</span>
      {!!badge && <span className="kgb-nav__badge">{badge}</span>}
      {opts?.external && <ExternalLink size={13} className="kgb-nav__ext" aria-hidden />}
    </a>
  )

  return (
    <div className="kgb-nav">
      <InboxWatcher counts={counts} />
      <div className="kgb-nav__brand">
        <a href="/admin" className="kgb-nav__logo">
          <Shield2 />
          <span>
            <strong>KGB</strong>
            <small>AUTOMATION</small>
          </span>
        </a>
        <button type="button" className="kgb-nav__collapse" onClick={() => setNavOpen(false)} aria-label={tx(lang, 'Sakrij meni', 'Hide menu')}>
          <ChevronsLeft size={16} />
        </button>
      </div>

      <nav className="kgb-nav__main">
        {link('/admin', LayoutGrid, tx(lang, 'Kontrolna tabla', 'Dashboard'))}
        {link('/admin/collections/chats', Mail, tx(lang, 'Sanduče', 'Inbox'), total)}
        {link('/', Globe, tx(lang, 'Pogledaj sajt', 'View website'), undefined, { external: true })}

        <div className="kgb-nav__sep" />

        {sections.map((s) => {
          const Icon = icons[s.icon]
          const isOpen = open[s.key] ?? s.key === sectionWithActive
          return (
            <div key={s.key} className={`kgb-nav__group${isOpen ? ' is-open' : ''}`}>
              <button type="button" className="kgb-nav__link kgb-nav__toggle" onClick={() => toggle(s.key)} aria-expanded={isOpen}>
                <Icon size={18} strokeWidth={1.8} aria-hidden />
                <span className="kgb-nav__text">{l(s.label)}</span>
                <ChevronDown size={15} className="kgb-nav__chev" aria-hidden />
              </button>
              <div className="kgb-nav__sub">
                <div>
                  {s.items.map((i) => {
                    const ItemIcon = icons[i.icon]
                    const n = i.badge && counts ? counts[i.badge] : 0
                    return link(i.href!, ItemIcon, l(i.label), n)
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      <div className="kgb-nav__bottom">
        {link('/admin/account', User, tx(lang, 'Podešavanja profila', 'Profile settings'))}
        {link('/admin/logout', LogOut, tx(lang, 'Odjava', 'Log out'))}
      </div>
    </div>
  )
}
