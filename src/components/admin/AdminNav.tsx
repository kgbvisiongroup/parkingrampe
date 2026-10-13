import { NavWrapper } from '@payloadcms/next/client'
import type { ServerProps } from 'payload'
import { AdminNavClient, type NavSection } from './AdminNavClient'

type Props = ServerProps & { visibleEntities?: { collections: string[]; globals: string[] } }

/**
 * Sidebar of the admin panel: grouped links with icons, live inbox badge, profile and logout.
 * Only what the signed-in user may see is listed.
 */
export function AdminNav({ i18n, visibleEntities }: Props) {
  const lang = i18n?.language
  const col = new Set(visibleEntities?.collections ?? [])
  const glob = new Set(visibleEntities?.globals ?? [])
  const c = (slug: string) => (col.has(slug) ? `/admin/collections/${slug}` : null)
  const g = (slug: string) => (glob.has(slug) ? `/admin/globals/${slug}` : null)

  const sections: NavSection[] = [
    {
      key: 'site',
      icon: 'globe',
      label: ['Sajt', 'Website'],
      items: [
        { href: g('home'), icon: 'home', label: ['Početna strana', 'Home page'] },
        { href: c('pages'), icon: 'file', label: ['Stranice', 'Pages'] },
        { href: c('services'), icon: 'wrench', label: ['Usluge', 'Services'] },
        { href: c('projects'), icon: 'image', label: ['Portfolio', 'Portfolio'] },
        { href: c('faqs'), icon: 'help', label: ['Česta pitanja', 'FAQ'] },
        { href: c('clients'), icon: 'users', label: ['Klijenti', 'Clients'] },
        { href: c('media'), icon: 'folder', label: ['Slike i fajlovi', 'Media'] },
      ],
    },
    {
      key: 'catalog',
      icon: 'cart',
      label: ['Proizvodi', 'Products'],
      items: [
        { href: c('products'), icon: 'package', label: ['Svi proizvodi', 'All products'] },
        { href: c('product-categories'), icon: 'layers', label: ['Kategorije', 'Categories'] },
        { href: col.has('products') ? '/admin/uvoz-proizvoda' : null, icon: 'upload', label: ['Uvoz iz Excela', 'Excel import'] },
      ],
    },
    {
      key: 'inbox',
      icon: 'messages',
      label: ['Upiti', 'Inquiries'],
      items: [
        { href: c('chats'), icon: 'chat', label: ['Chat poruke', 'Chat messages'], badge: 'chats' },
        { href: c('inquiries'), icon: 'inbox', label: ['Upiti sa sajta', 'Website inquiries'], badge: 'inquiries' },
      ],
    },
    {
      key: 'system',
      icon: 'settings',
      label: ['Sistem', 'System'],
      items: [
        { href: g('settings'), icon: 'sliders', label: ['Podešavanja sajta', 'Site settings'] },
        { href: g('navigation'), icon: 'menu', label: ['Meni i futer', 'Menu and footer'] },
        { href: c('users'), icon: 'shield', label: ['Korisnici', 'Users'] },
      ],
    },
  ]
    .map((s) => ({ ...s, items: s.items.filter((i) => i.href) }))
    .filter((s) => s.items.length) as NavSection[]

  return (
    <NavWrapper baseClass="nav">
      <AdminNavClient lang={lang} sections={sections} />
    </NavWrapper>
  )
}
