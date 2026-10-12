import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { Setting } from '@/payload-types'
import { getDictionary, type Locale } from '@/lib/i18n'
import { getServices } from '@/lib/payload'
import { ContactForm } from './ContactForm'
import { OpenChatButton } from './OpenChatButton'

/** Contact details on the left, inquiry form on the right. */
export async function ContactPanel({ locale, settings, defaultService }: { locale: Locale; settings: Setting; defaultService?: string }) {
  const dict = getDictionary(locale)
  const services = await getServices(locale)
  const info = [
    settings.phone && { icon: Phone, label: dict.phone, value: settings.phoneDisplay || settings.phone, href: `tel:${settings.phone}` },
    settings.email && { icon: Mail, label: dict.email, value: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: MapPin, label: dict.address, value: settings.address, href: settings.mapsUrl || undefined },
    settings.workingHours && { icon: Clock, label: dict.workingHours, value: settings.workingHours },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[]

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {info.map((it) => {
            const body = (
              <>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <it.icon className="size-[18px]" aria-hidden />
                </span>
                <span>
                  <span className="label-caps block text-muted">{it.label}</span>
                  <span className="mt-0.5 block whitespace-pre-line text-[15px] font-bold text-ink">{it.value}</span>
                </span>
              </>
            )
            return (
              <li key={it.label}>
                {it.href ? (
                  <a
                    href={it.href}
                    target={it.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-band/60"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 px-2 py-4">{body}</div>
                )}
              </li>
            )
          })}
        </ul>
        {settings.chat?.enabled !== false && (
          <OpenChatButton className="btn-dark mt-6 rounded-xl">
            <MessageCircle className="size-4" aria-hidden />
            {dict.askAboutProduct}
          </OpenChatButton>
        )}
      </div>
      <div className="rounded-2xl border border-line/70 bg-white p-6 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.25)] md:p-9">
        <ContactForm locale={locale} labels={dict.form} services={services.map((s) => s.title)} defaultService={defaultService} />
      </div>
    </div>
  )
}
