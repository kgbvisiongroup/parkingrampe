'use client'

import { useEffect, useRef } from 'react'

/** Muted video that starts by itself as soon as the page opens (browsers only allow muted autoplay). */
export function AutoplayVideo({ src, type, label, className }: { src: string; type: string; label: string; className?: string }) {
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
    <video ref={ref} className={className} aria-label={label} muted autoPlay loop playsInline controls preload="auto">
      <source src={src} type={type} />
    </video>
  )
}
