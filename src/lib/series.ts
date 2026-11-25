/**
 * Key Automation product series from the product code, used when the "series" field is empty.
 * Only prefixes we are sure of; anything else stays empty and can be filled in the CMS.
 */
const RULES: [RegExp, string][] = [
  [/^KTUS/i, 'TURBO S'],
  [/^KSUN\d+F/i, 'SUN FASTLINE'],
  [/^KSUN/i, 'SUN'],
  [/^STO\d{4,}/i, 'STORM'],
  [/^ALT\d/i, 'ALT'],
  [/^KRAY|^RAY/i, 'RAY'],
  [/^KSTAR|^STAR/i, 'STAR'],
]

export function seriesFromCode(code?: string | null): string | undefined {
  const c = (code ?? '').trim()
  return RULES.find(([re]) => re.test(c))?.[1]
}
