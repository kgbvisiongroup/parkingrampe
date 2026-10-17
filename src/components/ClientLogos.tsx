/* eslint-disable @next/next/no-img-element */
import type { Client } from '@/payload-types'
import { asMedia, mediaUrl } from '@/lib/media'

/** Client logos in an endless, slowly moving strip (pauses on hover). */
export function ClientLogos({ heading, clients }: { heading: string; clients: Client[] }) {
  const items = clients
    .map((c) => ({ c, src: mediaUrl(c.logo, 'thumb') }))
    .filter((i): i is { c: Client; src: string } => !!i.src)
  if (!items.length) return null

  // Repeat short lists so the strip is always wider than the screen, then double it for a seamless loop.
  const base = Array.from({ length: Math.max(1, Math.ceil(10 / items.length)) }, () => items).flat()
  const strip = [...base, ...base]
  const duration = Math.max(20, base.length * 3.5)

  return (
    <section className="overflow-hidden bg-white py-12 md:py-16">
      <div className="wrap">
        <h2 className="h-section">{heading}</h2>
      </div>
      <div className="marquee group relative mt-9" aria-label={heading}>
        <ul className="marquee__track flex w-max items-center group-hover:[animation-play-state:paused]" style={{ animationDuration: `${duration}s` }}>
          {strip.map(({ c, src }, i) => {
            const img = (
              <img
                src={src}
                alt={asMedia(c.logo)?.alt || c.name}
                loading="lazy"
                width={150}
                height={56}
                className="h-auto max-h-14 w-auto max-w-[150px] object-contain opacity-70 grayscale transition duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
              />
            )
            const card = 'group/logo grid h-24 w-44 place-items-center rounded-2xl border border-line bg-white px-6 shadow-[0_10px_30px_-22px_rgb(0_0_0/0.35)] transition duration-300 hover:-translate-y-1 hover:border-accent/50 sm:h-28 sm:w-52'
            return (
              <li key={`${c.id}-${i}`} className="pr-5 sm:pr-8" aria-hidden={i >= base.length || undefined}>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label={c.name} className={card} tabIndex={i >= base.length ? -1 : undefined}>
                    {img}
                  </a>
                ) : (
                  <div className={card}>{img}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
