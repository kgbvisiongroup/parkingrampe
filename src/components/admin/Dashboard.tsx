import { SetStepNav } from '@payloadcms/ui'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Inbox,
  Layers,
  MessageCircle,
  Package,
  Upload,
} from 'lucide-react'
import type { Payload, ServerProps, Where } from 'payload'
import type { ReactNode } from 'react'
import { tx } from './adminText'

const DAYS = 14
const TZ = 'Europe/Belgrade'

const dayKey = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: TZ }) // YYYY-MM-DD

/** Per-day counts for the last DAYS days (oldest first). */
async function series(payload: Payload, collection: 'inquiries' | 'chat-messages', extra?: Where) {
  const since = new Date(Date.now() - DAYS * 86400000)
  const res = await payload.find({
    collection,
    depth: 0,
    limit: 5000,
    pagination: false,
    select: { createdAt: true },
    where: { and: [{ createdAt: { greater_than: since.toISOString() } }, ...(extra ? [extra] : [])] },
    overrideAccess: true,
  })
  const counts = new Map<string, number>()
  for (const d of res.docs) {
    const k = dayKey(new Date(d.createdAt as string))
    counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  return Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(Date.now() - (DAYS - 1 - i) * 86400000)
    return { day: d, value: counts.get(dayKey(d)) ?? 0 }
  })
}

/** Smooth SVG path through the points (Catmull-Rom → Bézier). */
function smooth(points: [number, number][]) {
  if (points.length < 2) return ''
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d
}

function Sparkline({ values }: { values: number[] }) {
  const w = 220
  const h = 34
  const max = Math.max(1, ...values)
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 3 - (v / max) * (h - 8)] as [number, number])
  const line = smooth(pts)
  return (
    <svg className="kgb-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <path d={`${line} L${w},${h} L0,${h} Z`} className="kgb-spark__area" />
      <path d={line} className="kgb-spark__line" pathLength={1} />
    </svg>
  )
}

function ActivityChart({ lang, a, b }: { lang?: string; a: { day: Date; value: number }[]; b: { day: Date; value: number }[] }) {
  const w = 900
  const h = 260
  const pad = { l: 8, r: 8, t: 16, b: 34 }
  const max = Math.max(4, ...a.map((p) => p.value), ...b.map((p) => p.value))
  const x = (i: number) => pad.l + (i / (DAYS - 1)) * (w - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - v / max) * (h - pad.t - pad.b)
  const line = (s: typeof a) => smooth(s.map((p, i) => [x(i), y(p.value)]))
  const base = h - pad.b
  const fmt = (d: Date) => d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'sr-Latn-RS', { day: 'numeric', month: 'numeric', timeZone: TZ })
  const sum = (s: typeof a) => s.reduce((t, p) => t + p.value, 0)
  return (
    <div className="kgb-chart">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={tx(lang, 'Aktivnost poslednjih 14 dana', 'Activity in the last 14 days')}>
        <defs>
          <linearGradient id="kgb-g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--kgb-chart-a)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--kgb-chart-a)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="kgb-g2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--kgb-chart-b)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--kgb-chart-b)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={pad.l} x2={w - pad.r} y1={y(max * f)} y2={y(max * f)} className="kgb-chart__grid" />
        ))}
        <path d={`${line(a)} L${x(DAYS - 1)},${base} L${x(0)},${base} Z`} fill="url(#kgb-g1)" className="kgb-chart__area" />
        <path d={`${line(b)} L${x(DAYS - 1)},${base} L${x(0)},${base} Z`} fill="url(#kgb-g2)" className="kgb-chart__area" />
        <path d={line(a)} className="kgb-chart__line kgb-chart__line--a" pathLength={1} />
        <path d={line(b)} className="kgb-chart__line kgb-chart__line--b" pathLength={1} />
        {a.map((p, i) =>
          i % 3 === 0 || i === DAYS - 1 ? (
            <text key={i} x={x(i)} y={h - 10} textAnchor={i === 0 ? 'start' : i === DAYS - 1 ? 'end' : 'middle'} className="kgb-chart__label">
              {fmt(p.day)}
            </text>
          ) : null,
        )}
      </svg>
      <div className="kgb-chart__legend">
        <span>
          <i className="is-a" /> {tx(lang, 'Upiti', 'Inquiries')} <b>{sum(a)}</b>
        </span>
        <span>
          <i className="is-b" /> {tx(lang, 'Chat poruke posetilaca', 'Visitor chat messages')} <b>{sum(b)}</b>
        </span>
      </div>
    </div>
  )
}

function Stat({
  href,
  icon,
  value,
  label,
  badge,
  warn,
  wide,
  children,
}: {
  href: string
  icon: ReactNode
  value: ReactNode
  label: string
  badge?: string
  warn?: boolean
  wide?: boolean
  children?: ReactNode
}) {
  return (
    <a href={href} className={`kgb-card kgb-stat${wide ? ' kgb-stat--wide' : ''}`}>
      <div className="kgb-stat__top">
        <span className="kgb-stat__icon">{icon}</span>
        <span className="kgb-stat__value">{value}</span>
      </div>
      <div className="kgb-stat__row">
        <span className="kgb-stat__label">{label}</span>
        {badge && <span className={`kgb-pill${warn ? ' kgb-pill--warn' : ''}`}>{badge}</span>}
      </div>
      {children}
    </a>
  )
}

/** Admin home: greeting, things that need attention, key numbers and the last 14 days of activity. */
export async function Dashboard({ payload, i18n, user }: ServerProps) {
  if (!payload) return null
  const lang = i18n?.language
  const count = (collection: Parameters<Payload['count']>[0]['collection'], where?: Where) =>
    payload.count({ collection, where, overrideAccess: true }).then((r) => r.totalDocs)

  const [
    unreadChats,
    newInquiries,
    products,
    categories,
    pages,
    services,
    projects,
    media,
    chats,
    inquiries30,
    noAlt,
    noExcerpt,
    catNoImage,
    inqSeries,
    chatSeries,
  ] = await Promise.all([
    count('chats', { unread: { equals: true } }),
    count('inquiries', { status: { equals: 'new' } }),
    count('products'),
    count('product-categories'),
    count('pages'),
    count('services'),
    count('projects'),
    count('media'),
    count('chats'),
    count('inquiries', { createdAt: { greater_than: new Date(Date.now() - 30 * 86400000).toISOString() } }),
    count('media', { and: [{ mimeType: { contains: 'image' } }, { or: [{ alt: { exists: false } }, { alt: { equals: '' } }] }] }),
    count('products', { or: [{ excerpt: { exists: false } }, { excerpt: { equals: '' } }] }),
    count('product-categories', { image: { exists: false } }),
    series(payload, 'inquiries'),
    series(payload, 'chat-messages', { from: { equals: 'visitor' } }),
  ])

  const now = new Date()
  const hour = Number(now.toLocaleString('en-GB', { hour: '2-digit', hour12: false, timeZone: TZ }))
  const greeting =
    hour < 5 || hour >= 18 ? tx(lang, 'Dobro veče', 'Good evening') : hour < 12 ? tx(lang, 'Dobro jutro', 'Good morning') : tx(lang, 'Dobar dan', 'Good afternoon')
  const date = now.toLocaleDateString(lang === 'en' ? 'en-GB' : 'sr-Latn-RS', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ })
  const u = user as { name?: string | null; email?: string } | null
  const name = u?.name || u?.email?.split('@')[0] || ''

  const attention = [
    { n: unreadChats, href: '/admin/collections/chats?where[unread][equals]=true', icon: <MessageCircle size={16} />, title: tx(lang, 'Nepročitane chat poruke', 'Unread chat messages'), sub: tx(lang, 'Posetioci čekaju odgovor', 'Visitors are waiting for a reply'), level: 'warn' },
    { n: newInquiries, href: '/admin/collections/inquiries?where[status][equals]=new', icon: <Inbox size={16} />, title: tx(lang, 'Novi upiti', 'New inquiries'), sub: tx(lang, 'Sa kontakt forme na sajtu', 'From the website contact form'), level: 'warn' },
    { n: noAlt, href: '/admin/collections/media', icon: <ImageIcon size={16} />, title: tx(lang, 'Slike bez opisa (SEO)', 'Images without alt text (SEO)'), sub: tx(lang, 'Google ne zna šta je na slici', 'Google cannot tell what is on the image'), level: 'info' },
    { n: noExcerpt, href: '/admin/collections/products', icon: <Package size={16} />, title: tx(lang, 'Proizvodi bez kratkog opisa', 'Products without a short description'), sub: tx(lang, 'Prikazuje se na karticama i u pretrazi', 'Shown on cards and in search'), level: 'info' },
    { n: catNoImage, href: '/admin/collections/product-categories', icon: <Layers size={16} />, title: tx(lang, 'Kategorije bez slike', 'Categories without an image'), sub: tx(lang, 'Kartica u meniju je prazna', 'The menu card is empty'), level: 'info' },
  ].filter((a) => a.n > 0)

  const fmtN = (n: number) => n.toLocaleString(lang === 'en' ? 'en-GB' : 'sr-Latn-RS')

  return (
    <div className="kgb-dash">
      <SetStepNav nav={[]} />

      <section className="kgb-card kgb-hero">
        <div className="kgb-hero__date">{date}</div>
        <h1 className="kgb-hero__title">
          {greeting}
          {name && (
            <>
              , <span>{name}</span>
            </>
          )}
        </h1>
        <p className="kgb-hero__sub">{tx(lang, 'Vaš sajt parkingrampe.rs na jednom mestu.', 'Your parkingrampe.rs website in one place.')}</p>
        {attention.length > 0 && (
          <div className="kgb-chips">
            {attention.map((a) => (
              <a key={a.title} href={a.href} className={`kgb-chip${a.level === 'warn' ? ' kgb-chip--warn' : ''}`}>
                <AlertTriangle size={14} aria-hidden />
                {a.title}: <b>{fmtN(a.n)}</b>
              </a>
            ))}
          </div>
        )}
      </section>

      <div className="kgb-grid kgb-grid--2">
        <Stat
          wide
          href="/admin/collections/products"
          icon={<Package size={18} />}
          value={fmtN(products)}
          label={tx(lang, 'Proizvoda u katalogu', 'Products in the catalogue')}
          badge={tx(lang, `${categories} kategorija`, `${categories} categories`)}
        />
        <Stat
          wide
          href="/admin/collections/inquiries"
          icon={<Inbox size={18} />}
          value={fmtN(inquiries30)}
          label={tx(lang, 'Upiti u poslednjih 30 dana', 'Inquiries in the last 30 days')}
          badge={newInquiries ? tx(lang, `Novo: ${newInquiries}`, `New: ${newInquiries}`) : undefined}
          warn={!!newInquiries}
        >
          <Sparkline values={inqSeries.map((p) => p.value)} />
        </Stat>
      </div>

      <div className="kgb-grid kgb-grid--4">
        <Stat
          href="/admin/collections/chats"
          icon={<MessageCircle size={18} />}
          value={fmtN(chats)}
          label={tx(lang, 'Chat razgovori', 'Chat conversations')}
          badge={unreadChats ? tx(lang, `Nepročitano: ${unreadChats}`, `Unread: ${unreadChats}`) : undefined}
          warn={!!unreadChats}
        >
          <Sparkline values={chatSeries.map((p) => p.value)} />
        </Stat>
        <Stat href="/admin/collections/pages" icon={<FileText size={18} />} value={fmtN(pages + services)} label={tx(lang, 'Stranice i usluge', 'Pages and services')} />
        <Stat href="/admin/collections/projects" icon={<Layers size={18} />} value={fmtN(projects)} label={tx(lang, 'Portfolio projekti', 'Portfolio projects')} />
        <Stat href="/admin/collections/media" icon={<ImageIcon size={18} />} value={fmtN(media)} label={tx(lang, 'Slike, video i PDF', 'Images, video and PDF')} />
      </div>

      <div className="kgb-grid kgb-grid--main">
        <section className="kgb-card kgb-panel">
          <header>
            <h2>{tx(lang, 'Aktivnost', 'Activity')}</h2>
            <p>{tx(lang, 'Poslednjih 14 dana', 'Last 14 days')}</p>
          </header>
          <ActivityChart lang={lang} a={inqSeries} b={chatSeries} />
        </section>

        <section className="kgb-card kgb-panel">
          <header>
            <h2>{tx(lang, 'Zahteva pažnju', 'Needs attention')}</h2>
          </header>
          <ul className="kgb-attn">
            {attention.map((a) => (
              <li key={a.title}>
                <a href={a.href} className={`kgb-attn__row${a.level === 'warn' ? ' is-warn' : ''}`}>
                  <span className="kgb-attn__icon">{a.icon}</span>
                  <span className="kgb-attn__text">
                    <b>{a.title}</b>
                    <small>{a.sub}</small>
                  </span>
                  <span className="kgb-attn__n">{fmtN(a.n)}</span>
                  <ArrowRight size={15} className="kgb-attn__go" aria-hidden />
                </a>
              </li>
            ))}
            {!attention.length && (
              <li className="kgb-attn__ok">
                <CheckCircle2 size={18} aria-hidden /> {tx(lang, 'Sve je u redu. Nema ničega što čeka.', 'All good. Nothing is waiting.')}
              </li>
            )}
          </ul>
          <a href="/admin/uvoz-proizvoda" className="kgb-btn-ghost">
            <Upload size={15} aria-hidden /> {tx(lang, 'Uvoz proizvoda iz Excela', 'Import products from Excel')}
          </a>
        </section>
      </div>
    </div>
  )
}
