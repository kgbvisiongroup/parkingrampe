/**
 * Builds the specification table of a Key Automation product from the catalogue row
 * (code, Serbian description, EAN) – only values that are written in the description, nothing guessed.
 */
export type SpecRow = { sr: string; en: string; value: string; valueEn?: string }

const num = (s: string) => s.replace('.', ',')

export function buildSpecs(code: string, description: string, ean?: string): SpecRow[] {
  const d = description.replace(/\s+/g, ' ')
  const [main, kit] = d.split(/Sadrži:|Sadrzi:/i)
  const rows: SpecRow[] = [{ sr: 'Šifra proizvoda', en: 'Product code', value: code }]
  if (ean && /^\d{8,14}$/.test(ean.trim())) rows.push({ sr: 'EAN', en: 'EAN', value: ean.trim() })

  const power = main.match(/\b(\d{2,3})\s?V\s?(ac\/dc|dc|ac)\b/i)
  if (power) rows.push({ sr: 'Napajanje', en: 'Power supply', value: `${power[1]} V${power[2].toLowerCase()}` })

  const unit = main.match(/upravlja\S*\s+jedinic\S*\s+([A-Z][A-Z0-9]{3,})\b/)
  if (unit) rows.push({ sr: 'Upravljačka jedinica', en: 'Control unit', value: unit[1] })

  const weight = main.match(/do\s+(\d[\d.,]*)\s?kg/i)
  if (weight) rows.push({ sr: 'Maks. težina kapije', en: 'Max gate weight', value: `${weight[1]} kg` })

  const leaf = main.match(/krilne kapije(?: sa krilima)? do\s+(\d[\d.,]*)\s?m\b/i)
  if (leaf) rows.push({ sr: 'Maks. dužina krila', en: 'Max leaf length', value: `${num(leaf[1])} m`, valueEn: `${leaf[1].replace(',', '.')} m` })

  const arm = main.match(/ruke rampe od\s+(\d[\d,]*)\s+do\s+(\d[\d,]*)\s?m/i)
  if (arm) rows.push({ sr: 'Dužina ruke rampe', en: 'Barrier arm length', value: `${arm[1]}–${arm[2]} m` })

  const force = main.match(/sila\s+(\d+)\s?N\b/i)
  if (force) rows.push({ sr: 'Sila', en: 'Force', value: `${force[1]} N` })

  const amps = main.match(/V\s?dc,\s*(\d+)\s?A\b/i)
  if (amps) rows.push({ sr: 'Struja', en: 'Current', value: `${amps[1]} A` })

  if (/enkoder/i.test(main)) rows.push({ sr: 'Enkoder', en: 'Encoder', value: 'Da', valueEn: 'Yes' })
  if (/intenzivn\S* upotreb/i.test(main)) rows.push({ sr: 'Upotreba', en: 'Use', value: 'Intenzivna', valueEn: 'Intensive' })

  if (/povezivi|connected/i.test(main)) rows.push({ sr: 'Povezivost (aplikacija)', en: 'Connectivity (app)', value: 'Da', valueEn: 'Yes' })
  if (/NLS/.test(main)) rows.push({ sr: 'NLS funkcija', en: 'NLS function', value: 'Da', valueEn: 'Yes' })
  if (/(integrisan|ugra[đd]en)\S* prijemnik/i.test(main)) rows.push({ sr: 'Prijemnik', en: 'Receiver', value: 'Integrisan', valueEn: 'Integrated' })

  const contents = kit?.replace(/\.\s*$/, '').trim()
  if (contents) rows.push({ sr: 'Sadržaj kompleta', en: 'Kit contents', value: contents })
  return rows
}
