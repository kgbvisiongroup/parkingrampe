import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'

/*
 * Texts only, no schema change: removes the mention of a Ministry of Interior (MUP) licence
 * and puts phone control in its place, on the About page, home page and services.
 */

type Pair = [string, string]

const SR: Pair[] = [
  ["Licencirani od MUP-a, iz Obrenovca za celu Srbiju.", "Kapije i rampe kojima upravljate telefonom, iz Obrenovca za celu Srbiju."],
  ["KGB Vision Group je licencirana kompanija iz Obrenovca", "KGB Vision Group je kompanija iz Obrenovca"],
  ["Posedujemo MUP licencu za projektovanje, ugradnju i puštanje u rad tehničkih sistema zaštite.", "Svaku kapiju i rampu povezujemo na telefon: otvarate je iz aplikacije, delite pristup ukućanima ili zaposlenima i vidite ko je i kada prošao."],
  ["MUP licenca i stručnost – licenciran i kontinuirano obučen tim", "Upravljanje telefonom – kapija i rampa u aplikaciji, bez traženja daljinskog"],
  ["Licenca MUP-a i besplatna ponuda za 48h.", "Upravljanje telefonom i besplatna ponuda za 48h."],
  ["Licencirani za sisteme tehničke zaštite.", "Garancija na opremu i ugradnju, servis širom Srbije."],
  ["Licenca MUP-a", "Garancija i servis"],
  ["licenca MUP-a i besplatna ponuda za 48h.", "upravljanje telefonom i besplatna ponuda za 48h."],
  ["preko telefona. Licenca MUP-a i ponuda za 48h.", "preko telefona. Besplatna ponuda za 48h."],
  ["i telefon. Licenca MUP-a, ponuda za 48h.", "i telefon. Upravljanje telefonom, ponuda za 48h."],
  ["Zvanična licenca", "Upravljanje telefonom"],
  ["Licencirani partner Key Automation", "Ovlašćeni partner Key Automation"],
  ['"value":"MUP"', '"value":"App"'],
]

const EN: Pair[] = [
  ["Licensed, from Obrenovac for all of Serbia.", "Gates and barriers you control from your phone, from Obrenovac for all of Serbia."],
  ["KGB Vision Group is a licensed company from Obrenovac", "KGB Vision Group is a company from Obrenovac"],
  ["We hold a licence from the Ministry of Interior for designing, installing and commissioning technical security systems.", "We connect every gate and barrier to your phone: open it from the app, share access with family or staff and see who passed and when."],
  ["Licensed, continuously trained team", "Phone control – your gate and barrier in an app, no more looking for the remote"],
  ["Licensed installer, free quote within 48 hours.", "Phone control and a free quote within 48 hours."],
  ["Licensed for technical security systems.", "Warranty on equipment and installation, service across Serbia."],
  ["Key Automation equipment, licensed installer, free quote within 48h.", "Key Automation equipment, phone control, free quote within 48h."],
  ["Licensed installer, quote within 48h.", "Free quote within 48h."],
  ["Licensed installer", "Warranty and service"],
  ["Official licence", "Phone control"],
  ["Licensed Key Automation partner", "Authorised Key Automation partner"],
]

const SKIP = new Set(['id', 'createdAt', 'updatedAt', 'globalType'])

function replaceAll(doc: Record<string, unknown>, pairs: Pair[]) {
  const data = Object.fromEntries(Object.entries(doc).filter(([k]) => !SKIP.has(k)))
  const before = JSON.stringify(data)
  let after = before
  for (const [from, to] of pairs) after = after.split(from).join(to)
  return after === before ? null : JSON.parse(after)
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  let changed = 0
  for (const [locale, pairs] of [['sr', SR], ['en', EN]] as const) {
    for (const collection of ['pages', 'services'] as const) {
      const res = await payload.find({ collection, locale, depth: 0, limit: 500, pagination: false, req })
      for (const doc of res.docs) {
        const data = replaceAll(doc as unknown as Record<string, unknown>, pairs)
        if (!data) continue
        await payload.update({ collection, id: doc.id, locale, data, depth: 0, req })
        changed++
      }
    }
    const home = await payload.findGlobal({ slug: 'home', locale, depth: 0, req })
    const data = home && replaceAll(home as unknown as Record<string, unknown>, pairs)
    if (data) {
      await payload.updateGlobal({ slug: 'home', locale, data, depth: 0, req })
      changed++
    }
  }
  if (changed) payload.logger.info(`Tekst o licenci MUP-a zamenjen u ${changed} zapisa.`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Text change only; nothing to undo in the schema.
}
