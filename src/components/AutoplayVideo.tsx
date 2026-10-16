'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Maximize2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/** Muted video that starts by itself as soon as the page opens (browsers only allow muted autoplay). */
export function AutoplayVideo({ src, type, label, className, controls = false }: { src: string; type: string; label: string; className?: string; controls?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    // Start right away when the page opens; if the browser delays it, retry once the video is visible.
    void v.play().catch(() => {})
    const io = new IntersectionObserver(([e]) => e.isIntersecting && v.paused && void v.play().catch(() => {}), { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <video ref={ref} className={className} aria-label={label} muted autoPlay loop playsInline controls={controls} preload="auto" disablePictureInPicture>
      <source src={src} type={type} />
    </video>
  )
}

export type GalleryVideo = { src: string; type: string; label: string }

/**
 * Videos that all play at once, silently and without a player, like moving photos.
 * A click opens the video large, with the player and sound.
 */
export function VideoGallery({ videos, closeLabel }: { videos: GalleryVideo[]; closeLabel: string }) {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const current = open !== null ? videos[open] : null
  return (
    <>
      <ul className={`grid gap-1.5 sm:gap-2.5 ${videos.length % 3 === 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {videos.map((v, i) => (
          <li key={v.src}>
            <button type="button" onClick={() => setOpen(i)} aria-label={v.label} className="group relative block w-full overflow-hidden bg-black">
              <AutoplayVideo src={v.src} type={v.type} label={v.label} className="pointer-events-none aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <span className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-black/45 text-white opacity-80 transition-opacity group-hover:opacity-100 sm:size-9">
                <Maximize2 className="size-4" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.label}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.video
              key={current.src}
              className="max-h-[86vh] w-full max-w-6xl bg-black"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              controls
              autoPlay
              playsInline
            >
              <source src={current.src} type={current.type} />
            </motion.video>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="size-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
