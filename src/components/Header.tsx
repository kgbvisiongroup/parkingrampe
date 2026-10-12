'use client'

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { ArrowRight, ChevronDown, Menu, Phone, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n'
import type { NavItem } from '@/lib/nav'
import { useAlternates } from './Alternates'

type Props = {
  locale: Locale
  siteName: string
  logoUrl: string | null
  phone?: string | null
  phoneDisplay?: string | null
  items: NavItem[]
  cta: { label: string; href: string } | null
  showSearch: boolean
  showPhone: boolean
  searchHref: string
  labels: { menu: string; close: string; search: string; searchPlaceholder: string; categories: string; viewAll: string; skip: string }
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Glass panel: drops down from the bar with a soft clip reveal. */
const panel: Variants = {
  hidden: { opacity: 0, y: -10, clipPath: 'inset(0 0 100% 0)' },
  show: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.42, ease: EASE, staggerChildren: 0.035, delayChildren: 0.08 } },
  exit: { opacity: 0, y: -6, clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.25, ease: EASE } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
}

const glass = 'bg-[rgb(18_22_25/0.58)] backdrop-blur-2xl backdrop-saturate-150'

export function Header({ locale, siteName, logoUrl, phone, phoneDisplay, items, cta, showSearch, showPhone, searchHref, labels }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const alternates = useAlternates()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const [mobile, setMobile] = useState(false)
  const [mobileSub, setMobileSub] = useState<number | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [megaGroup, setMegaGroup] = useState(0)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const searchInput = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  type Hit = { title: string; href: string; code?: string | null; image?: string | null }
  const [live, setLive] = useState<{ products: Hit[]; categories: Hit[]; services: Hit[] } | null>(null)

  // Results while typing (after a short pause).
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setLive(null)
      return
    }
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?locale=${locale}&q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        if (res.ok) setLive(await res.json())
      } catch {}
    }, 220)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [query, locale])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(null)
    setMobile(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? 'hidden' : ''
  }, [mobile])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInput.current?.focus(), 80)
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null)
        setSearchOpen(false)
        setMobile(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const solid = scrolled || open !== null || searchOpen || mobile
  const enter = (i: number) => {
    clearTimeout(closeTimer.current)
    if (open !== i) setMegaGroup(0)
    setOpen(i)
    setSearchOpen(false)
  }
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 200)
  }
  const isActive = (href?: string | null) =>
    !!href && (pathname === href || (href !== `/${locale}` && pathname.startsWith(href + '/')))
  const openItem = open !== null ? items[open] : null
  const group = openItem?.kind === 'mega' ? openItem.groups[megaGroup] : null
  const groupLinks = group ? (group.children.length ? group.children : [{ label: group.label, href: group.href }]) : []

  const underline = (active: boolean) => (
    <span
      aria-hidden
      className={`absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-accent transition-transform duration-300 ease-out ${
        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}
    />
  )

  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-white focus:px-3 focus:py-2 focus:text-ink">
        {labels.skip}
      </a>
      <header className="fixed inset-x-0 top-0 z-50 text-white" onMouseLeave={leave}>
        {/* Bar */}
        <div
          className={`relative border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
            solid ? `${glass} border-white/10` : 'border-white/20 bg-gradient-to-b from-black/45 to-black/0'
          }`}
        >
          <div className={`wrap flex items-center justify-between gap-4 transition-[height] duration-500 ${scrolled ? 'h-[62px]' : 'h-[66px] md:h-[78px]'}`}>
            <div className="flex min-w-0 items-center">
              <Link href={`/${locale}`} className="flex shrink-0 items-center" aria-label={siteName}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={siteName}
                    width={200}
                    height={73}
                    className={`w-auto transition-[height] duration-500 ${scrolled ? 'h-9' : 'h-10 md:h-12'}`}
                  />
                ) : (
                  <span className="text-xl font-extrabold tracking-wide">{siteName}</span>
                )}
              </Link>
              <span className="mx-5 hidden h-7 w-px bg-white/35 xl:block" aria-hidden />
              <nav aria-label="Glavni meni" className="hidden items-center xl:flex">
                {items.map((it, i) =>
                  it.kind === 'link' ? (
                    <Link
                      key={i}
                      href={it.href}
                      onMouseEnter={() => setOpen(null)}
                      className={`group relative whitespace-nowrap px-3 py-2 text-[14.5px] font-semibold tracking-[-0.005em] transition-colors ${
                        isActive(it.href) ? 'text-white' : 'text-white/85 hover:text-white'
                      }`}
                    >
                      {it.label}
                      {underline(isActive(it.href))}
                    </Link>
                  ) : (
                    <button
                      key={i}
                      type="button"
                      aria-expanded={open === i}
                      onMouseEnter={() => enter(i)}
                      onClick={() => (open === i ? setOpen(null) : enter(i))}
                      className={`group relative flex items-center gap-1 whitespace-nowrap px-3 py-2 text-[14.5px] font-semibold tracking-[-0.005em] transition-colors ${
                        open === i || isActive(it.href) ? 'text-white' : 'text-white/85 hover:text-white'
                      }`}
                    >
                      {it.label}
                      <ChevronDown className={`size-3.5 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} aria-hidden />
                      {underline(open === i || isActive(it.href))}
                    </button>
                  ),
                )}
              </nav>
            </div>

            <div className="flex items-center gap-1 text-[13.5px]">
              {showPhone && phone && (
                <a href={`tel:${phone}`} className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white 2xl:flex">
                  <Phone className="size-3.5" aria-hidden />
                  {phoneDisplay || phone}
                </a>
              )}
              {showSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(null)
                    setSearchOpen((v) => !v)
                  }}
                  aria-label={labels.search}
                  aria-expanded={searchOpen}
                  className="grid size-10 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Search className="size-[18px]" aria-hidden />
                </button>
              )}
              <div className="flex items-center rounded-full border border-white/20 p-0.5 text-[12px] font-bold uppercase tracking-wider" role="group" aria-label="Jezik / Language">
                {(['sr', 'en'] as const).map((l) =>
                  l === locale ? (
                    <span key={l} aria-current="true" className="rounded-full bg-white px-2.5 py-1 text-dark">
                      {l === 'sr' ? 'SRB' : 'EN'}
                    </span>
                  ) : (
                    <Link
                      key={l}
                      href={alternates[l] ?? `/${l}`}
                      hrefLang={l}
                      className="rounded-full px-2.5 py-1 text-white/80 transition-colors hover:text-white"
                    >
                      {l === 'sr' ? 'SRB' : 'EN'}
                    </Link>
                  ),
                )}
              </div>
              {cta && (
                <Link href={cta.href} className="btn-accent ml-2 hidden whitespace-nowrap !px-5 !py-2.5 shadow-[0_6px_20px_-6px_var(--accent)] transition-transform hover:-translate-y-px sm:inline-flex">
                  {cta.label}
                </Link>
              )}
              <button
                type="button"
                onClick={() => setMobile((v) => !v)}
                aria-expanded={mobile}
                aria-controls="mobile-menu"
                aria-label={mobile ? labels.close : labels.menu}
                className="relative ml-1 grid size-10 place-items-center xl:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobile ? 'x' : 'm'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobile ? <X className="size-6" /> : <Menu className="size-6" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div variants={panel} initial="hidden" animate="show" exit="exit" className={`absolute inset-x-0 top-full border-b border-white/10 ${glass}`}>
              <form
                className="wrap flex items-center gap-3 py-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  const q = searchInput.current?.value.trim()
                  if (q) router.push(`${searchHref}?q=${encodeURIComponent(q)}`)
                }}
              >
                <Search className="size-5 text-white/55" aria-hidden />
                <input
                  ref={searchInput}
                  name="q"
                  type="search"
                  placeholder={labels.searchPlaceholder}
                  aria-label={labels.search}
                  className="h-11 min-w-0 flex-1 bg-transparent text-xl font-medium text-white outline-none placeholder:text-white/40"
                  autoComplete="off"
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="btn-accent !px-5 !py-2.5">
                  {labels.search}
                </button>
              </form>
              {live && (live.products.length > 0 || live.categories.length > 0 || live.services.length > 0) && (
                <div className="wrap max-h-[60vh] overflow-y-auto pb-6">
                  <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {live.products.map((p) => (
                        <li key={p.href}>
                          <Link href={p.href} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/10">
                            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded bg-white">
                              {p.image && <img src={p.image} alt="" className="max-h-full max-w-full object-contain p-0.5" />}
                            </span>
                            <span className="min-w-0">
                              {p.code && <span className="block text-[11px] font-bold uppercase tracking-wider text-accent">{p.code}</span>}
                              <span className="line-clamp-2 block text-[13.5px] font-medium text-white/90">{p.code && p.title.startsWith(p.code) ? p.title.slice(p.code.length).replace(/^\s*[–-]\s*/, '') : p.title}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-1 border-white/10 md:border-l md:pl-6">
                      {[...live.categories, ...live.services].map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block rounded-lg px-2 py-1.5 text-[14px] font-semibold text-white/85 hover:bg-white/10 hover:text-white">
                            {c.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop dropdown / mega menu */}
        <AnimatePresence>
          {openItem && openItem.kind !== 'link' && (
            <motion.div
              key={open}
              variants={panel}
              initial="hidden"
              animate="show"
              exit="exit"
              onMouseEnter={() => clearTimeout(closeTimer.current)}
              className={`absolute inset-x-0 top-full hidden border-b border-white/10 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] xl:block ${glass}`}
            >
              <div className="wrap py-10">
                {openItem.kind === 'mega' ? (
                  <div className="grid grid-cols-[minmax(240px,300px)_1px_minmax(220px,1fr)_auto] gap-10">
                    <div>
                      <motion.p variants={item} className="mb-5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-white/55">
                        {labels.categories}
                      </motion.p>
                      <ul className="space-y-1">
                        {openItem.groups.map((g, gi) => (
                          <motion.li key={g.href} variants={item}>
                            <Link
                              href={g.href}
                              onMouseEnter={() => setMegaGroup(gi)}
                              onFocus={() => setMegaGroup(gi)}
                              className={`group flex items-center justify-between rounded-lg px-3 py-2 text-[15.5px] font-semibold transition-colors ${
                                megaGroup === gi ? 'bg-white/10 text-white' : 'text-white/75 hover:text-white'
                              }`}
                            >
                              {g.label}
                              <ArrowRight
                                className={`size-4 transition-all duration-300 ${megaGroup === gi ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}
                                aria-hidden
                              />
                            </Link>
                          </motion.li>
                        ))}
                        {openItem.href && (
                          <motion.li variants={item} className="pt-3">
                            <Link href={openItem.href} className="inline-flex items-center gap-2 px-3 text-[13px] font-semibold text-accent hover:underline hover:underline-offset-4">
                              {labels.viewAll}
                              <ArrowRight className="size-3.5" aria-hidden />
                            </Link>
                          </motion.li>
                        )}
                      </ul>
                    </div>
                    <span className="w-px bg-gradient-to-b from-white/0 via-white/35 to-white/0" aria-hidden />
                    <AnimatePresence mode="wait">
                      <motion.ul
                        key={megaGroup}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } }}
                        exit={{ opacity: 0, x: -8, transition: { duration: 0.15 } }}
                        className="space-y-1 pt-[38px]"
                      >
                        {groupLinks.map((c, ci) => (
                          <motion.li
                            key={c.href}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: EASE, delay: 0.04 * ci }}
                          >
                            <Link
                              href={c.href}
                              className="group inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14.5px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                            >
                              <span className="h-px w-3 bg-accent transition-all duration-300 group-hover:w-5" aria-hidden />
                              {c.label}
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </AnimatePresence>
                    <div className="relative hidden h-[200px] w-[300px] overflow-hidden rounded-xl bg-white/5 xl:block">
                      <AnimatePresence>
                        {group?.image && (
                          <motion.img
                            key={group.image}
                            src={group.image}
                            alt=""
                            initial={{ opacity: 0, scale: 1.06 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="absolute inset-0 size-full object-cover"
                          />
                        )}
                      </AnimatePresence>
                      {group && (
                        <Link href={group.href} className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-[13px] font-bold">
                          {group.label}
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <ul className="flex flex-wrap gap-3">
                    {openItem.children.map((c) => (
                      <motion.li key={c.href} variants={item}>
                        <Link
                          href={c.href}
                          className="group flex min-w-[220px] items-center justify-between gap-6 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-[15px] font-semibold text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 hover:text-white"
                        >
                          <span className="flex items-center gap-2">
                            {c.label}
                            {c.badge && <span className="rounded-full bg-accent px-2 py-px text-[10px] font-bold uppercase text-white">{c.badge}</span>}
                          </span>
                          <ArrowRight className="size-4 -translate-x-1 opacity-50 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu: slides in from the right */}
        <AnimatePresence>
          {mobile && (
            <motion.nav
              id="mobile-menu"
              aria-label={labels.menu}
              initial={{ x: '100%' }}
              animate={{ x: 0, transition: { duration: 0.45, ease: EASE } }}
              exit={{ x: '100%', transition: { duration: 0.3, ease: EASE } }}
              className="absolute inset-x-0 top-full h-[calc(100dvh-62px)] overflow-y-auto bg-[rgb(18_22_25/0.9)] backdrop-blur-2xl xl:hidden"
            >
              <motion.ul
                className="wrap divide-y divide-white/10 py-4"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
              >
                {items.map((it, i) => (
                  <motion.li key={i} variants={item} className="py-1">
                    {it.kind === 'link' ? (
                      <Link href={it.href} className="block py-3 text-[19px] font-semibold">
                        {it.label}
                      </Link>
                    ) : (
                      <>
                        <button
                          type="button"
                          aria-expanded={mobileSub === i}
                          onClick={() => setMobileSub(mobileSub === i ? null : i)}
                          className="flex w-full items-center justify-between py-3 text-[19px] font-semibold"
                        >
                          {it.label}
                          <ChevronDown className={`size-5 transition-transform duration-300 ${mobileSub === i ? 'rotate-180' : ''}`} aria-hidden />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileSub === i && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              className="overflow-hidden border-l border-accent/70 pl-4"
                            >
                              {(it.kind === 'mega' ? it.groups : it.children.map((c) => ({ ...c, children: [] as { label: string; href: string }[] }))).map((c) => (
                                <li key={c.href}>
                                  <Link href={c.href} className="block py-1.5 font-medium text-white/90">
                                    {c.label}
                                  </Link>
                                  {c.children.length > 0 && (
                                    <ul className="mb-1 pl-4">
                                      {c.children.map((s) => (
                                        <li key={s.href}>
                                          <Link href={s.href} className="block py-1 text-[14px] text-white/60">
                                            {s.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
              <div className="wrap flex flex-col gap-3 pb-28">
                {cta && (
                  <Link href={cta.href} className="btn-accent btn-accent-lg">
                    {cta.label}
                  </Link>
                )}
                {phone && (
                  <a href={`tel:${phone}`} className="btn-outline-light rounded-full py-3">
                    <Phone className="size-4" aria-hidden />
                    {phoneDisplay || phone}
                  </a>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
