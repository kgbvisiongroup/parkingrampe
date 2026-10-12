import type { Field, FieldHook } from 'payload'

const map: Record<string, string> = {
  š: 's', Š: 's', č: 'c', Č: 'c', ć: 'c', Ć: 'c', ž: 'z', Ž: 'z', đ: 'dj', Đ: 'dj',
}

export function slugify(input: string): string {
  return input
    .replace(/[šŠčČćĆžŽđĐ]/g, (c) => map[c] ?? c)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    if (typeof source === 'string' && source) return slugify(source)
    return value
  }

/** Localized URL slug, filled from the title when left empty. */
export function slugField(fallbackField = 'title'): Field {
  return {
    name: 'slug',
    label: { sr: 'URL (slug)', en: 'URL (slug)' },
    type: 'text',
    localized: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: {
        sr: 'Deo adrese stranice. Ostavite prazno da se napravi iz naslova.',
        en: 'Part of the page address. Leave empty to generate it from the title.',
      },
    },
    hooks: { beforeValidate: [formatSlug(fallbackField)] },
  }
}
