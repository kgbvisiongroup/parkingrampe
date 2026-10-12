import { strFromU8, unzipSync } from 'fflate'

/** Minimal .xlsx reader: returns every sheet as rows of cell text. Images, styles and formulas are ignored. */
export function readXlsx(buffer: Buffer | ArrayBuffer | Uint8Array): { name: string; rows: string[][] }[] {
  const files = unzipSync(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer as ArrayBuffer))
  const text = (path: string) => (files[path] ? strFromU8(files[path]) : '')
  const decode = (s: string) =>
    s
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
      .replace(/&amp;/g, '&')
  const tText = (xml: string) => [...xml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => decode(m[1])).join('')

  const shared = [...text('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => tText(m[1]))

  // Sheet names → files, via workbook relationships.
  const rels = new Map<string, string>()
  for (const m of text('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b[^>]*>/g)) {
    const id = m[0].match(/Id="([^"]+)"/)?.[1]
    const target = m[0].match(/Target="([^"]+)"/)?.[1]
    if (id && target) rels.set(id, target.startsWith('/') ? target.slice(1) : `xl/${target.replace(/^\.\//, '')}`)
  }
  const sheets: { name: string; rows: string[][] }[] = []
  for (const m of text('xl/workbook.xml').matchAll(/<sheet\b[^>]*>/g)) {
    const name = decode(m[0].match(/name="([^"]*)"/)?.[1] ?? '')
    const rid = m[0].match(/r:id="([^"]+)"/)?.[1]
    const path = rid ? rels.get(rid) : undefined
    if (!path) continue
    const rows: string[][] = []
    for (const r of text(path).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>|<row\b[^>]*\/>/g)) {
      const cells: string[] = []
      for (const c of (r[1] ?? '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const attrs = c[1]
        const body = c[2] ?? ''
        const ref = attrs.match(/r="([A-Z]+)\d+"/)?.[1]
        const col = ref ? [...ref].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1 : cells.length
        const type = attrs.match(/t="([^"]+)"/)?.[1]
        const v = body.match(/<v>([\s\S]*?)<\/v>/)?.[1]
        let value = ''
        if (type === 's' && v != null) value = shared[Number(v)] ?? ''
        else if (type === 'inlineStr') value = tText(body)
        else if (v != null) value = decode(v)
        cells[col] = value
      }
      rows.push(Array.from(cells, (x) => x ?? ''))
    }
    sheets.push({ name, rows })
  }
  return sheets
}
