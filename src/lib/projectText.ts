import type { Project } from '@/payload-types'

type ProjectLike = Pick<Project, 'title' | 'city' | 'location' | 'objectType' | 'equipment'>

/** Codes of the installed products, e.g. "ALT4K, FT33". */
export function equipmentCodes(p: Pick<Project, 'equipment'>, max = 2) {
  return (p.equipment ?? [])
    .map((e) => (typeof e === 'object' && e ? e.code || e.title : null))
    .filter(Boolean)
    .slice(0, max)
    .join(', ')
}

const GENERIC = /^(slika|image|photo|foto|projekat|project|logo|img|dsc|whatsapp)\b|\.(jpe?g|png|webp)$/i

/**
 * Descriptive alt text for project photos: the photo's own alt when it says something,
 * otherwise "Parking rampa ALT4K, hotel, Šabac" built from the project fields.
 */
export function projectAlt(p: ProjectLike, mediaAlt?: string | null) {
  const own = mediaAlt?.trim()
  if (own && !GENERIC.test(own) && own.toLowerCase() !== p.title.trim().toLowerCase()) return own
  const codes = equipmentCodes(p)
  return [codes ? `${p.title} ${codes}` : p.title, p.objectType, p.city || p.location].filter(Boolean).join(', ')
}
