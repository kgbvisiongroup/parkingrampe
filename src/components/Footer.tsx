/* eslint-disable @next/next/no-img-element */
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import type { Setting } from '@/payload-types'
import type { Dictionary, Locale } from '@/lib/i18n'
import { platformName, SocialIcon } from './SocialIcon'

type Props = {
  locale: Locale
  settings: Setting
  logoUrl: string | null
  dict: Dictionary
  columns: { title: string; links: { label: string; href: string }[] }[]
}

export function Footer({ locale, settings, logoUrl, dict, columns }: Props) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-dark text-[14px] text-white/70">
      <div
        className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(var(--footer-cols),1fr)]"
        style={{ ['--footer-cols' as string]: columns.length + 1 }}
      >
        <div>
          <Link href={`/${locale}`} aria-label={settings.siteName} className="inline-block">
            {logoUrl ? (
              <img src={logoUrl} alt={settings.siteName} className="h-14 w-auto" width={200} height={73} />
            ) : (
              <span className="text-xl font-extrabold uppercase tracking-wider text-white">{settings.siteName}</span>
            )}
          </Link>
          {settings.footerText && <p className="mt-5 max-w-xs leading-relaxed">{settings.footerText}</p>}
          {!!settings.socials?.length && (
            <ul className="mt-6 space-y-2.5">
              {settings.socials.map((s) => (
                <li key={s.id ?? s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platformName[s.platform] ?? s.platform}
                    className="group inline-flex items-center gap-3 text-white/75 transition-colors hover:text-white"
                  >
                    <span className="grid size-9 place-items-center rounded-full border border-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                      <SocialIcon platform={s.platform} className="size-4" />
                    </span>
                    <span className="text-[13.5px] font-semibold">{s.handle || platformName[s.platform]}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="label-caps text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <address className="not-italic">
          <h2 className="label-caps text-white">{dict.contact}</h2>
          <ul className="mt-4 space-y-2.5">
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone}`} className="flex items-start gap-2.5 hover:text-white">
                  <Phone className="mt-1 size-3.5 shrink-0" aria-hidden />
                  {settings.phoneDisplay || settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-start gap-2.5 hover:text-white">
                  <Mail className="mt-1 size-3.5 shrink-0" aria-hidden />
                  {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li>
                <a href={settings.mapsUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 hover:text-white">
                  <MapPin className="mt-1 size-3.5 shrink-0" aria-hidden />
                  {settings.address}
                </a>
              </li>
            )}
            {settings.workingHours && (
              <li className="flex items-start gap-2.5">
                <Clock className="mt-1 size-3.5 shrink-0" aria-hidden />
                <span className="whitespace-pre-line">{settings.workingHours}</span>
              </li>
            )}
          </ul>
        </address>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-1 py-5 text-[12px] text-white/45 sm:flex-row sm:justify-between">
          <p>
            © {year} {settings.legalName || settings.siteName}. {dict.rights}
          </p>
          {settings.pib && (
            <p>
              PIB {settings.pib}
              {settings.mb ? ` · MB ${settings.mb}` : ''}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
