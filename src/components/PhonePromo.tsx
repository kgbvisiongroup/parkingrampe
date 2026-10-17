/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Smartphone } from 'lucide-react'
import Link from 'next/link'

/** Gallery tile that promotes opening the gate / barrier from the phone (KUBEW module, KEY Smart app). */
export function PhonePromo({ href, image, locale }: { href: string; image?: string | null; locale: 'sr' | 'en' }) {
  const t =
    locale === 'en'
      ? { label: 'KEY Smart app', title: 'Open your gate and barrier from your phone', short: 'Open by phone', cta: 'KUBEW module' }
      : { label: 'KEY Smart aplikacija', title: 'Otvarajte kapiju i rampu telefonom', short: 'Otvaranje telefonom', cta: 'KUBEW modul' }
  return (
    <Link
      href={href}
      aria-label={`${t.title} – ${t.cta}`}
      className="group relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden bg-dark p-2 text-white sm:p-5"
    >
      <span className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-accent/30 blur-2xl transition-transform duration-700 group-hover:scale-125 sm:size-48" />
      <span className="relative flex items-start justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-accent">
          <Smartphone className="size-5 sm:size-4" aria-hidden />
          <span className="hidden sm:inline">{t.label}</span>
        </span>
        {image && (
          <img
            src={image}
            alt="KUBEW"
            loading="lazy"
            className="hidden h-16 w-auto rounded-lg bg-white p-1.5 shadow-lg transition-transform duration-700 group-hover:-translate-y-1 sm:block lg:h-20"
          />
        )}
      </span>
      <span className="relative">
        <span className="block text-[11px] font-extrabold leading-tight sm:hidden">{t.short}</span>
        <span className="hidden text-[clamp(15px,1.8vw,21px)] font-extrabold leading-tight sm:block">{t.title}</span>
        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-white/80 group-hover:text-white sm:mt-2 sm:text-[13px]">
          {t.cta}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1 sm:size-4" aria-hidden />
        </span>
      </span>
    </Link>
  )
}
