'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

export type Slide = {
  image: string | null
  alt: string
  focal: string
  title?: string | null
  subtitle?: string | null
  button?: { href: string; label: string; target?: string } | null
}

const heights = { full: 'h-[100svh]', large: 'h-[72svh] min-h-[460px]', medium: 'h-[52svh] min-h-[360px]' }

export function HeroSlider({ slides, height = 'large', interval = 3.5 }: { slides: Slide[]; height?: keyof typeof heights; interval?: number }) {
  const DURATION = Math.min(15, Math.max(2, interval)) * 1000
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const count = slides.length
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])

  useEffect(() => {
    if (count < 2 || paused || reduce) return
    const t = setTimeout(() => go(index + 1), DURATION)
    return () => clearTimeout(t)
  }, [index, paused, reduce, count, go, DURATION])

  if (!count) return null
  const s = slides[index]

  return (
    <section
      className={`relative isolate overflow-hidden bg-dark ${heights[height] ?? heights.large}`}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {s.image && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: reduce ? 1 : 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: reduce ? 0 : DURATION / 1000 + 1, ease: 'linear' }}
            >
              <Image src={s.image} alt={s.alt} fill priority={index === 0} sizes="100vw" className="object-cover" style={{ objectPosition: s.focal }} />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Top shade keeps the white menu readable on bright photos */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />

      {(s.title || s.subtitle || s.button) && (
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 via-transparent to-transparent pb-16 md:pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="wrap text-center text-white"
            >
              {s.title && <h2 className="text-[clamp(26px,4.6vw,52px)] font-extrabold uppercase tracking-[0.04em] text-white text-shadow">{s.title}</h2>}
              {s.subtitle && <p className="mx-auto mt-2 max-w-xl text-[15px] text-white/90 text-shadow md:text-lg">{s.subtitle}</p>}
              {s.button && (
                <Link href={s.button.href} target={s.button.target} className="btn-outline-light mt-6">
                  {s.button.label}
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Prethodni slajd"
            className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center text-white/85 transition-colors hover:text-white md:left-[7%]"
          >
            <ChevronLeft className="size-8" strokeWidth={1} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Sledeći slajd"
            className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center text-white/85 transition-colors hover:text-white md:right-[7%]"
          >
            <ChevronRight className="size-8" strokeWidth={1} />
          </button>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {slides.map((sl, i) => (
              <button
                key={i}
                type="button"
                aria-label={sl.title || `Slajd ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-[3px] transition-all ${i === index ? 'w-8 bg-white' : 'w-4 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
