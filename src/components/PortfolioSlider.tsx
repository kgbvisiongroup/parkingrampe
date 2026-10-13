'use client'

import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export type SlideImage = { src: string; alt: string }

/** Large photo slider at the top of the portfolio: autoplay, arrows, dots and swipe. */
export function PortfolioSlider({ images, prevLabel, nextLabel }: { images: SlideImage[]; prevLabel: string; nextLabel: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)
  const count = images.length

  const go = useCallback((to: number, d: number) => setState([(to + count) % count, d]), [count])
  const next = useCallback(() => go(index + 1, 1), [go, index])
  const prev = useCallback(() => go(index - 1, -1), [go, index])

  useEffect(() => {
    if (paused || count < 2) return
    const t = setTimeout(next, 4000)
    return () => clearTimeout(t)
  }, [index, paused, count, next])

  if (!count) return null
  const img = images[index]

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) next()
    else if (info.offset.x > 60) prev()
  }

  return (
    <section
      className="relative overflow-hidden bg-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            initial={{ x: dir > 0 ? '12%' : '-12%', opacity: 0, scale: 1.04 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: dir > 0 ? '-8%' : '8%', opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
          >
            <Image src={img.src} alt={img.alt} fill priority={index === 0} sizes="100vw" className="pointer-events-none object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={prevLabel}
              className="absolute left-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-accent backdrop-blur-sm transition hover:scale-110 hover:bg-black/45 sm:left-5 sm:size-14"
            >
              <ChevronLeft className="size-7 sm:size-9" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={nextLabel}
              className="absolute right-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-accent backdrop-blur-sm transition hover:scale-110 hover:bg-black/45 sm:right-5 sm:size-14"
            >
              <ChevronRight className="size-7 sm:size-9" strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex flex-wrap justify-center gap-2 bg-dark px-4 py-4" role="tablist">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1} / ${count}`}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? 'w-7 bg-white' : 'w-2.5 bg-accent hover:bg-accent/70'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
