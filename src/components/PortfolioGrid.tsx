'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export type PortfolioItem = {
  id: number
  title: string
  href: string
  image: string | null
  alt: string
  focal?: string
  serviceId?: number | null
  serviceTitle?: string | null
  location?: string | null
}

export function PortfolioGrid({ items, filters, allLabel }: { items: PortfolioItem[]; filters: { id: number; title: string }[]; allLabel: string }) {
  const [active, setActive] = useState<number | null>(null)
  const visible = active === null ? items : items.filter((i) => i.serviceId === active)

  return (
    <>
      {filters.length > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-1" role="group" aria-label="Filter">
          {[{ id: null as number | null, title: allLabel }, ...filters].map((f) => (
            <button
              key={f.id ?? 'all'}
              type="button"
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
              className={`px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.05em] transition-colors ${
                active === f.id ? 'bg-dark text-white' : 'text-ink hover:bg-band'
              }`}
            >
              {f.title}
            </button>
          ))}
        </div>
      )}
      <motion.ul layout className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.li
              layout
              key={p.id}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay: (i % 3) * 0.08 }}
            >
              <Link href={p.href} className="tile-zoom relative block aspect-square overflow-hidden bg-[#d9d9d9]">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: p.focal }}
                  />
                )}
                <span className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/45 to-transparent" />
                <span className="absolute left-3 right-3 top-2.5 text-[clamp(14px,2.1vw,24px)] font-extrabold uppercase leading-tight text-white text-shadow sm:left-5 sm:right-5 sm:top-3">
                  {p.location || p.title}
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-8 text-white sm:px-5 sm:pb-4 sm:pt-10">
                  {p.serviceTitle && <span className="label-caps block text-white/75">{p.serviceTitle}</span>}
                  <span className="block text-[12.5px] font-bold sm:text-[14px]">{p.title}</span>
                </span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  )
}
