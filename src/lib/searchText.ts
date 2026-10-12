const map: Record<string, string> = { š: 's', č: 'c', ć: 'c', ž: 'z', đ: 'dj' }

/** Lowercase, no diacritics, single spaces – so "Šifrator" matches "sifrator". */
export function normalizeSearch(input: string): string {
  return input
    .toLowerCase()
    .replace(/[šččćžđ]/g, (c) => map[c] ?? c)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Search words; codes like "KRAY-2324" also match without the dash. */
export function searchTerms(q: string): string[] {
  return normalizeSearch(q)
    .split(' ')
    .filter((w) => w.length >= 2)
    .slice(0, 6)
    .map(stem)
}

/** Light Serbian stemming: "fotocelije" also finds "fotocelija", "rampa" finds "rampe". */
function stem(w: string): string {
  if (!/^[a-z]+$/.test(w) || w.length < 5) return w
  return w.slice(0, Math.max(4, w.length - 2))
}
