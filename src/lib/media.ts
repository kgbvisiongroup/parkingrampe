import type { Media } from '@/payload-types'

export type MediaRef = number | Media | null | undefined

export function asMedia(ref: MediaRef): Media | null {
  return ref && typeof ref === 'object' ? ref : null
}

type Size = 'thumb' | 'card' | 'hero' | 'og'

export function mediaUrl(ref: MediaRef, size?: Size): string | null {
  const media = asMedia(ref)
  if (!media) return null
  const url = (size ? media.sizes?.[size]?.url : null) || media.url
  if (!url) return null
  // Payload returns absolute URLs when serverURL is set; keep them relative so next/image can optimise them.
  return url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '')
}

export function focal(ref: MediaRef): string {
  const m = asMedia(ref)
  if (!m || m.focalX == null || m.focalY == null) return '50% 50%'
  return `${m.focalX}% ${m.focalY}%`
}
