/**
 * SEO task 1: one main keyword per page (see content-drafts/keyword-map.md).
 *
 *   npm run seo:keywords            – shows what would change, changes nothing
 *   npm run seo:keywords -- --apply – writes it
 *
 * Only empty keyword fields are filled; a keyword typed in the CMS is never replaced.
 * The home page title is replaced only if it is empty or still the old one.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type Target = { collection: 'services' | 'product-categories'; slug: string; sr: string; en: string }

const MAP: Target[] = [
  { collection: 'services', slug: 'automatske-rampe', sr: 'Rampe za parking', en: 'Parking barriers' },
  { collection: 'services', slug: 'motori-za-kapije', sr: 'Motori za kapije', en: 'Gate motors' },
  { collection: 'services', slug: 'kontrola-pristupa', sr: 'Kontrola pristupa', en: 'Access control' },
  { collection: 'product-categories', slug: 'parking-rampe', sr: 'Automatske rampe', en: 'Automatic barriers' },
  { collection: 'product-categories', slug: 'motori-za-klizne-kapije', sr: 'Motori za klizne kapije', en: 'Sliding gate motors' },
  // No single swing-gate category exists; the linear motors (RAY, STAR kits) are the main swing-gate offer.
  { collection: 'product-categories', slug: 'linearni-motori-za-krilne-kapije', sr: 'Linearni motori za krilne kapije', en: 'Linear swing gate motors' },
  { collection: 'product-categories', slug: 'garazna-vrata', sr: 'Motori za garažna vrata', en: 'Garage door motors' },
  { collection: 'product-categories', slug: 'kontrola-pristupa', sr: 'Oprema za kontrolu pristupa', en: 'Access control equipment' },
]

const HOME = {
  sr: 'Parking rampe i motori za kapije – Key Automation | KGB Automation',
  en: 'Parking barriers and gate motors – Key Automation | KGB Automation',
}
const OLD_HOME = [
  'parking rampe, motori za kapije, led spoljna rasveta',
  'parking rampe, motori za kapije i kontrola pristupa | kgb automation',
  'parking barriers, gate motors and access control | kgb automation',
]

const apply = process.argv.includes('--apply')

async function run() {
  const payload = await getPayload({ config })
  console.log(apply ? 'Upisujem izmene…\n' : 'Probni prolaz – ništa se ne menja. Za upis: npm run seo:keywords -- --apply\n')

  for (const t of MAP) {
    const res = await payload.find({ collection: t.collection, locale: 'sr', where: { slug: { equals: t.slug } }, depth: 0, limit: 1 })
    const doc = res.docs[0] as { id: number; title: string; keyword?: string | null } | undefined
    if (!doc) { console.log(`! ${t.collection}/${t.slug}: strana ne postoji – preskočeno`); continue }
    if (doc.keyword?.trim()) { console.log(`= ${doc.title}: već ima „${doc.keyword}”`); continue }
    console.log(`+ ${doc.title}: „${t.sr}” / „${t.en}”`)
    if (apply) {
      await payload.update({ collection: t.collection, id: doc.id, locale: 'sr', data: { keyword: t.sr } as never })
      await payload.update({ collection: t.collection, id: doc.id, locale: 'en', data: { keyword: t.en } as never })
    }
  }

  for (const locale of ['sr', 'en'] as const) {
    const home = await payload.findGlobal({ slug: 'home', locale, depth: 0 })
    const current = home.meta?.title?.trim() ?? ''
    if (current === HOME[locale]) { console.log(`= Početna (${locale}): naslov je već dobar`); continue }
    if (current && !OLD_HOME.includes(current.toLowerCase())) { console.log(`= Početna (${locale}): ručno upisan naslov „${current}” – ne menjam`); continue }
    console.log(`+ Početna (${locale}): „${current || '(prazno)'}” → „${HOME[locale]}”`)
    if (apply) await payload.updateGlobal({ slug: 'home', locale, data: { meta: { ...home.meta, title: HOME[locale] } } as never })
  }
  console.log('\nGotovo.')
  process.exit(0)
}

void run()
