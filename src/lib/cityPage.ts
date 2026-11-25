import { CITY_MIN_WORDS } from '../collections/Cities'
import { plainText } from './lexicalText'

type CityLike = {
  ready?: boolean | null
  intro?: unknown
  body?: unknown
  areas?: string | null
  travelTime?: string | null
  faq?: { question?: string | null; answer?: string | null }[] | null
}

/** Words of the page's own text (intro, local text, areas, travel time, questions and answers). */
export function cityWords(c: CityLike) {
  const rich = (d: unknown) => plainText((d as { root?: never } | null)?.root)
  const text = [rich(c.intro), rich(c.body), c.areas, c.travelTime, ...(c.faq ?? []).flatMap((f) => [f.question, f.answer])].filter(Boolean).join(' ')
  return text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length
}

/** Shown to Google only when marked ready and long enough to be unique. */
export function cityIsIndexable(c: CityLike) {
  return Boolean(c.ready) && cityWords(c) >= CITY_MIN_WORDS
}
