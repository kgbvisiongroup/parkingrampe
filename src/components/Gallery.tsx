'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export type GalleryImage = { src: string; full: string; alt: string; width?: number | null; height?: number | null }

export function Gallery({ images, closeLabel }: { images: GalleryImage[]; closeLabel: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const count = images.length

  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? null : (i + dir + count) % count)),
    [count],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open, step])

  if (!count) return null
  const current = open !== null ? images[open] : null

  return (
    <>
      <ul className="columns-1 gap-2.5 sm:columns-2 lg:columns-3 [&>li]:mb-2.5">
        {images.map((img, i) => (
          <motion.li
            key={img.src + i}
            className="break-inside-avoid"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -60px 0px' }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay: (i % 3) * 0.08 }}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden bg-band"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width || 960}
                height={img.height || 720}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              key={open}
              className="relative h-[82vh] w-full max-w-6xl"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={current.full} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="size-6" />
            </button>
            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Prethodna"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                  }}
                  className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  aria-label="Sledeća"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                  }}
                  className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="size-6" />
                </button>
                <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/70">
                  {(open ?? 0) + 1} / {count}
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
