/**
 * Fills the specification table of every Key Automation product (Serbian + English) from the
 * catalogue Excel: product code, EAN and the values written in the description
 * (power supply, control unit, max weight / leaf length, kit contents…).
 *
 * Run on the server:   npm run products:specs
 * Products whose table was edited by hand in the CMS are left alone (only the automatic
 * "Šifra" / "Sadržaj kompleta" rows are replaced). Use --force to replace every table.
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { buildSpecs } from '../src/lib/productSpecs'
import { readXlsx } from '../src/lib/xlsxRead'

// Labels written by the first import and by this script; any other label means the table was edited by hand.
const AUTO_LABELS = new Set([
  'Šifra', 'Sadržaj kompleta', 'Šifra proizvoda', 'EAN', 'Napajanje', 'Upravljačka jedinica', 'Maks. težina kapije',
  'Maks. dužina krila', 'Dužina ruke rampe', 'Sila', 'Struja', 'Enkoder', 'Upotreba', 'Povezivost (aplikacija)', 'NLS funkcija', 'Prijemnik',
])

async function run() {
  const force = process.argv.includes('--force')
  const file = path.resolve('scripts/catalog/Key_Automation_artikli.xlsx')
  const [head, ...rows] = readXlsx(fs.readFileSync(file))[0].rows
  const ix = (n: string) => head.findIndex((h) => h.toLowerCase().startsWith(n))
  const byCode = new Map(rows.filter((r) => r[ix('sif')]).map((r) => [r[ix('sif')].trim().toUpperCase(), r]))

  const payload = await getPayload({ config })
  const products = await payload.find({ collection: 'products', locale: 'sr', depth: 0, limit: 1000, pagination: false })
  let done = 0, kept = 0, missing = 0
  for (const p of products.docs) {
    const row = p.code ? byCode.get(p.code.trim().toUpperCase()) : undefined
    if (!row) { missing++; continue }
    const current = (p.specs ?? []) as { label: string }[]
    if (!force && current.some((s) => !AUTO_LABELS.has(s.label))) { kept++; continue }
    const specs = buildSpecs(p.code!, row[ix('naz')], row[ix('ean')])
    const sr = await payload.update({
      collection: 'products',
      id: p.id,
      locale: 'sr',
      data: { specs: specs.map((s) => ({ label: s.sr, value: s.value })) },
    })
    const ids = ((sr.specs ?? []) as { id?: string }[]).map((s) => s.id)
    await payload.update({
      collection: 'products',
      id: p.id,
      locale: 'en',
      data: { specs: specs.map((s, n) => ({ id: ids[n], label: s.en, value: s.valueEn ?? s.value })) },
    })
    done++
  }
  console.log(`Gotovo: tabela karakteristika upisana za ${done} proizvoda, ručno uređenih preskočeno ${kept}, bez reda u Excelu ${missing}.`)
  process.exit(0)
}

void run()
