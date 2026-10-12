/* eslint-disable @next/next/no-img-element */
import type { Client } from '@/payload-types'
import { asMedia, mediaUrl } from '@/lib/media'

export function ClientLogos({ heading, clients }: { heading: string; clients: Client[] }) {
  if (!clients.length) return null
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="wrap">
        <h2 className="h-section">{heading}</h2>
        <ul className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-7">
          {clients.map((c) => {
            const src = mediaUrl(c.logo, 'thumb')
            if (!src) return null
            const img = (
              <img
                src={src}
                alt={asMedia(c.logo)?.alt || c.name}
                loading="lazy"
                className="mx-auto max-h-12 w-auto max-w-[130px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            )
            return (
              <li key={c.id}>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label={c.name}>
                    {img}
                  </a>
                ) : (
                  img
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
