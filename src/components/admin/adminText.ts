/** Admin UI language helpers: Payload uses 'rs-latin' and 'en'. */
export type AdminLang = string | undefined

export const isEn = (lang: AdminLang) => lang === 'en'

/** Picks the Serbian or English text for the current admin language. */
export const tx = (lang: AdminLang, sr: string, en: string) => (isEn(lang) ? en : sr)
