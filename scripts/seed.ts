/**
 * Fills an empty CMS with the content of the current parkingrampe.rs site (Serbian + English).
 *   npm run seed            – adds content only if the database is empty
 *   npm run seed -- --force – deletes existing content first
 */
import 'dotenv/config'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'
import config from '../src/payload.config'
import { parseWorkbook, importProducts } from '../src/lib/catalogImport'
import { type Block, type ImageKey, L, categories, categoryDescriptions, categoryImages, clients, faqs, featuredCodes, images, l, products, projects, rt, services } from './seed-data'

type Loc = 'sr' | 'en'
const force = process.argv.includes('--force')

/* ---------- helpers ---------- */

/** Resolve every L(sr, en) in a structure to one language. */
function pick<T>(value: T, locale: Loc): any {
  if (value instanceof L) return pick((value as L<unknown>)[locale], locale)
  if (Array.isArray(value)) return value.map((v) => pick(v, locale))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, pick(v, locale)]))
  }
  return value
}

/** Copy array row ids from the saved Serbian doc so the English update fills the same rows. */
function withIds(en: any, saved: any): any {
  if (Array.isArray(en)) {
    return en.map((row, i) => {
      if (row && typeof row === 'object' && !Array.isArray(row) && saved?.[i]?.id) {
        return { ...withIds(row, saved[i]), id: saved[i].id }
      }
      return row
    })
  }
  if (en && typeof en === 'object' && !(en.root && en.root.type === 'root')) {
    return Object.fromEntries(Object.entries(en).map(([k, v]) => [k, withIds(v, saved?.[k])]))
  }
  return en
}

function textNode(text: string) {
  return { type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }
}

function lexical(blocks: Block[]) {
  const children = blocks.map((b) => {
    if ('h' in b) {
      return { type: 'heading', tag: 'h3', children: [textNode(b.h)], direction: 'ltr', format: '', indent: 0, version: 1 }
    }
    if ('ul' in b) {
      return {
        type: 'list',
        listType: 'bullet',
        tag: 'ul',
        start: 1,
        children: b.ul.map((item, i) => ({
          type: 'listitem',
          value: i + 1,
          children: [textNode(item)],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        })),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      }
    }
    return { type: 'paragraph', children: [textNode(b.p)], direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1 }
  })
  return { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } }
}

/** Rich text: L<Block[]> → L<lexical JSON>. */
const rich = (v: L<Block[]>) => l(lexical(v.sr), lexical(v.en))

async function placeholder(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e3a40"/><stop offset="1" stop-color="#172024"/></linearGradient></defs>
    <rect width="1600" height="1000" fill="url(#g)"/>
    <rect x="160" y="560" width="900" height="22" rx="11" fill="#2bbd4f"/>
    <text x="160" y="500" font-family="sans-serif" font-size="56" fill="#ffffff" opacity=".85">${label.replace(/[<&>]/g, '')}</text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toBuffer()
}

async function download(url: string): Promise<{ data: Buffer; mimetype: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) })
    if (!res.ok) return null
    const data = Buffer.from(await res.arrayBuffer())
    return { data, mimetype: res.headers.get('content-type')?.split(';')[0] || 'image/jpeg' }
  } catch {
    return null
  }
}

/** Optional: put your own photos in a folder as <key>.jpg|png|webp and set SEED_IMAGE_DIR. */
function localImage(key: string): { data: Buffer; mimetype: string } | null {
  // Your own folder first, then the images shipped with the project (logo, favicon).
  const dirs = [process.env.SEED_IMAGE_DIR, path.resolve('scripts/seed-images')].filter(Boolean) as string[]
  for (const dir of dirs) {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      const file = path.resolve(dir, `${key}.${ext}`)
      if (fs.existsSync(file)) return { data: fs.readFileSync(file), mimetype: `image/${ext === 'jpg' ? 'jpeg' : ext}` }
    }
  }
  return null
}

async function uploadImages(payload: Payload) {
  const ids: Partial<Record<ImageKey, number>> = {}
  const sources: Record<string, string> = {}
  let downloaded = 0
  for (const [key, img] of Object.entries(images) as [ImageKey, (typeof images)[ImageKey]][]) {
    const local = localImage(key)
    const fromSite = local ?? (await download(img.url))
    let data: Buffer
    let name = path.basename(new URL(img.url).pathname)
    let mimetype = 'image/jpeg'
    if (fromSite) {
      if (!local) downloaded++
      // AVIF and other formats are converted to high-quality WebP so every size can be generated.
      data = await sharp(fromSite.data).webp({ quality: 90 }).toBuffer()
      name = name.replace(/\.(avif|jpe?g|png|webp)$/i, '') + '.webp'
      mimetype = 'image/webp'
      if (/\.png$/i.test(img.url) || fromSite.mimetype === 'image/png') {
        data = await sharp(fromSite.data).png().toBuffer()
        name = name.replace(/\.webp$/, '.png')
        mimetype = 'image/png'
      }
    } else {
      data = await placeholder(img.alt.sr)
      name = `${key}.jpg`
    }
    const doc = await payload.create({
      collection: 'media',
      locale: 'sr',
      data: { alt: img.alt.sr },
      file: { data, mimetype, name, size: data.length },
    })
    await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: img.alt.en } })
    ids[key] = doc.id as number
    sources[doc.filename || name] = img.url
    process.stdout.write('.')
  }
  console.log(`\n  Slike: ${downloaded}/${Object.keys(images).length} preuzeto sa parkingrampe.rs`)
  if (downloaded === 0 && !process.env.SEED_IMAGE_DIR) {
    console.log('  (Sajt nije dostupan – postavljene su privremene slike. Zamenite ih u CMS-u ili pokrenite seed ponovo.)')
  }
  fs.mkdirSync(path.resolve('media'), { recursive: true })
  fs.writeFileSync(path.resolve('media/.sources.json'), JSON.stringify(sources, null, 2))
  return ids as Record<ImageKey, number>
}

/** Create in Serbian, then fill the English version of the same doc. */
async function createBilingual(payload: Payload, collection: any, def: any) {
  const sr = pick(def, 'sr')
  const doc: any = await payload.create({ collection, locale: 'sr', data: sr })
  const en = withIds(pick(def, 'en'), doc)
  await payload.update({ collection, id: doc.id, locale: 'en', data: en })
  return doc
}

async function updateGlobalBilingual(payload: Payload, slug: any, def: any) {
  const saved: any = await payload.updateGlobal({ slug, locale: 'sr', data: pick(def, 'sr') })
  await payload.updateGlobal({ slug, locale: 'en', data: withIds(pick(def, 'en'), saved) })
}

/* ---------- seed ---------- */

type Rel = 'pages' | 'services' | 'product-categories' | 'products' | 'projects'
const link = (relationTo: Rel, id: number, label?: L) => ({
  type: 'internal',
  reference: { relationTo, value: id },
  ...(label ? { label } : {}),
})

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'services' })
  if (existing.totalDocs > 0 && !force) {
    console.log('Baza već ima sadržaj. Za ponovno punjenje: npm run seed -- --force')
    process.exit(0)
  }
  if (force) {
    for (const c of ['chat-messages', 'chats', 'projects', 'products', 'product-categories', 'services', 'faqs', 'clients', 'pages', 'media'] as const) {
      await payload.delete({ collection: c, where: { id: { exists: true } }, overrideAccess: true })
    }
  }

  console.log('→ Slike')
  const img = await uploadImages(payload)

  console.log('→ Pitanja')
  const faqIds: number[] = []
  for (const [i, f] of faqs.entries()) {
    const doc = await createBilingual(payload, 'faqs', { question: f.q, answer: f.a, order: i, showOnHome: true })
    faqIds.push(doc.id)
  }

  console.log('→ Kategorije proizvoda')
  const catIds: Record<string, number> = {}
  for (const [i, c] of categories.entries()) {
    const doc = await createBilingual(payload, 'product-categories', {
      title: c.title,
      slug: c.slug,
      order: c.order ?? i,
      parent: c.parent ? catIds[c.parent] : undefined,
      image: img[c.image],
      description: c.description,
      showInMenu: true,
      meta: { title: c.title, description: c.description, image: img[c.image] },
    })
    catIds[c.key] = doc.id
  }

  console.log('→ Proizvodi')
  for (const [i, p] of products.entries()) {
    await createBilingual(payload, 'products', {
      title: p.title,
      slug: p.slug,
      order: 500 + i,
      category: catIds[p.category],
      featured: !!p.featured,
      images: p.images.map((k) => img[k]),
      excerpt: p.excerpt,
      highlights: p.highlights.map((h) => ({ text: h })),
      specs: p.specs.map(([label, value]) => ({ label, value })),
      meta: { title: p.title, description: p.excerpt, image: img[p.images[0]] },
    })
  }

  console.log('→ Key Automation katalog (Excel + slike)')
  {
    const dir = path.resolve('scripts/catalog')
    const xlsx = fs.readdirSync(dir).find((f) => f.toLowerCase().endsWith('.xlsx'))
    if (xlsx) {
      const rows = await parseWorkbook(fs.readFileSync(path.join(dir, xlsx)))
      const photos = new Map<string, Buffer>()
      const photoDir = path.join(dir, 'slike')
      if (fs.existsSync(photoDir)) for (const f of fs.readdirSync(photoDir)) photos.set(f.toLowerCase(), fs.readFileSync(path.join(photoDir, f)))
      const res = await importProducts(payload, rows, photos, { categoryMode: 'file', updateExisting: true })
      console.log(`  ${res.created} proizvoda, ${res.imagesAdded} slika, kategorije: ${res.categoriesCreated.length}`)
      if (res.errors.length) console.log('  Greške:', res.errors.slice(0, 5))
    }
    // Pictures and texts for the main categories, featured products.
    const cats = await payload.find({ collection: 'product-categories', locale: 'sr', depth: 0, limit: 300 })
    for (const c of cats.docs) {
      catIds[c.title] = c.id as number
      const data: Record<string, unknown> = {}
      const key = categoryImages[c.title]
      if (key && img[key]) Object.assign(data, { image: img[key], imageFit: 'cover', meta: { ...(c.meta ?? {}), image: img[key] } })
      const d = categoryDescriptions[c.title]
      if (d && !c.parent) {
        await payload.update({ collection: 'product-categories', id: c.id, locale: 'sr', data: { ...data, description: d.sr, meta: undefined } })
        await payload.update({ collection: 'product-categories', id: c.id, locale: 'en', data: { description: d.en } })
      } else if (Object.keys(data).length) {
        await payload.update({ collection: 'product-categories', id: c.id, locale: 'sr', data })
      }
    }
    await payload.update({ collection: 'products', where: { code: { in: featuredCodes } }, data: { featured: true } })
  }

  console.log('→ Usluge')
  const serviceIds: Record<string, number> = {}
  for (const s of services) {
    const doc = await createBilingual(payload, 'services', {
      title: s.title,
      slug: s.slug,
      order: s.order,
      badge: (s as { badge?: L }).badge,
      tagline: s.tagline,
      heroImage: img[s.heroImage],
      introHeading: s.introHeading,
      intro: rich(s.intro),
      features: s.features,
      whyHeading: s.whyHeading,
      why: rich(s.why),
      whyImage: img[s.whyImage],
      productCategory: catIds[(s as { category: string }).category] ?? catIds.access,
      gallery: s.gallery.map((g) => img[g]),
      faqs: s.faqIdx.map((i) => faqIds[i]),
      meta: { title: s.meta.title, description: s.meta.description, image: img[s.heroImage] },
    })
    serviceIds[s.key] = doc.id
  }

  console.log('→ Portfolio')
  for (const [i, p] of projects.entries()) {
    await createBilingual(payload, 'projects', {
      title: p.title,
      slug: l(`projekat-${i + 1}`, `project-${i + 1}`),
      order: i,
      service: serviceIds[p.service],
      cover: img[p.image],
      summary: p.summary,
    })
  }

  console.log('→ Klijenti')
  for (const [i, c] of clients.entries()) {
    await payload.create({ collection: 'clients', data: { name: c.name, logo: img[c.logo], order: i } })
  }

  console.log('→ Stranice')
  const pageIds: Record<string, number> = {}
  const catalogPage = await createBilingual(payload, 'pages', {
    title: l('Proizvodi', 'Products'),
    slug: l('proizvodi', 'products'),
    template: 'products',
    lead: l('Key Automation oprema koju ugrađujemo i servisiramo.', 'Key Automation equipment we install and service.'),
    heroImage: img.heroGate,
    meta: {
      title: l('Proizvodi – rampe, motori za kapije, kontrola pristupa', 'Products – barriers, gate motors, access control'),
      description: l(
        'Katalog Key Automation opreme: parking rampe, motori za klizne i krilne kapije, kontrola pristupa i dodatna oprema. Ugradnja u Beogradu i Srbiji.',
        'Key Automation catalogue: parking barriers, sliding and swing gate motors, access control and accessories. Installation in Belgrade and Serbia.',
      ),
    },
  })
  pageIds.catalog = catalogPage.id
  pageIds.services = (
    await createBilingual(payload, 'pages', {
      title: l('Usluge', 'Services'),
      slug: l('usluge', 'services'),
      template: 'services',
      lead: l('Oprema, ugradnja i servis na jednom mestu.', 'Equipment, installation and service in one place.'),
      heroImage: img.heroBarrier,
      meta: {
        title: l('Usluge – ugradnja rampi, kapija i kontrole pristupa', 'Services – barrier, gate and access control installation'),
        description: l(
          'Ugradnja parking rampi, motora za kapije i sistema kontrole pristupa u Beogradu i Srbiji. Key Automation oprema i servis.',
          'Installation of parking barriers, gate motors and access control systems in Belgrade and Serbia. Key Automation equipment and service.',
        ),
      },
    })
  ).id
  pageIds.portfolio = (
    await createBilingual(payload, 'pages', {
      title: l('Portfolio', 'Portfolio'),
      slug: l('portfolio', 'portfolio'),
      template: 'portfolio',
      lead: l('Izbor rampi, kapija i sistema kontrole pristupa koje smo ugradili.', 'A selection of barriers, gates and access systems we have installed.'),
      heroImage: img.p6,
      meta: {
        title: l('Portfolio – ugrađene rampe i kapije', 'Portfolio – installed barriers and gates'),
        description: l(
          'Pogledajte rampe, motore za kapije i sisteme kontrole pristupa koje je ugradio KGB Automation.',
          'See barriers, gate motors and access control systems installed by KGB Automation.',
        ),
      },
    })
  ).id
  pageIds.about = (
    await createBilingual(payload, 'pages', {
      title: l('O nama', 'About us'),
      slug: l('o-nama', 'about'),
      template: 'about',
      lead: l(
        'Projektujemo, ugrađujemo i održavamo tehničke sisteme zaštite i automatizaciju kapija. Licencirani od MUP-a, iz Obrenovca za celu Srbiju.',
        'We design, install and maintain technical security systems and gate automation. Licensed, from Obrenovac for all of Serbia.',
      ),
      heroImage: img.heroGate,
      highlights: [
        { value: 'MUP', label: l('Zvanična licenca', 'Official licence') },
        { value: '48h', label: l('Ponuda nakon upita', 'Quote after inquiry') },
        { value: '0–5', label: l('Godina garancije', 'Years of warranty') },
        { value: 'Srbija', label: l('Radimo na celoj teritoriji', 'We work nationwide') },
      ],
      content: rich(
        rt(
          [
            { h: 'Ko smo mi' },
            {
              p: 'KGB Vision Group je licencirana kompanija iz Obrenovca (Beograd), specijalizovana za ugradnju tehničkih sistema zaštite i automatizacije. Ugrađujemo motore za klizne i krilne kapije, parking rampe, kontrolu pristupa i evidenciju radnog vremena, video nadzor i alarmne sisteme.',
            },
            {
              p: 'Posedujemo MUP licencu za projektovanje, ugradnju i puštanje u rad tehničkih sistema zaštite. Radimo sa proverenim brendovima, a za automatiku kapija i rampi isključivo sa Key Automation opremom.',
            },
            {
              p: 'Stalno proširujemo naše usluge i ulažemo u obuku tima. Naš cilj je da svakom klijentu – od kuće, preko stambene zgrade, do kompanije – pružimo moderno, pouzdano i dugotrajno rešenje, bilo gde u Srbiji.',
            },
            { h: 'Šta nas izdvaja' },
            {
              ul: [
                'MUP licenca i stručnost – licenciran i kontinuirano obučen tim',
                'Pouzdanost – kvalitetna oprema renomiranih proizvođača, uz garanciju na svaku instalaciju',
                'Posvećenost klijentima – besplatan obilazak objekta i ponuda u roku od 48 sati',
                'Kontinuirani razvoj – pratimo najnovije tehnologije u industriji',
              ],
            },
          ],
          [
            { h: 'Who we are' },
            {
              p: 'KGB Vision Group is a licensed company from Obrenovac, Belgrade, specialised in technical security and automation. We install sliding and swing gate motors, parking barriers, access control and time attendance, video surveillance and alarm systems.',
            },
            {
              p: 'We hold a licence from the Ministry of Interior for designing, installing and commissioning technical security systems. We work with proven brands, and for gate and barrier automation exclusively with Key Automation equipment.',
            },
            {
              p: 'We keep expanding our services and invest in training our team. Our goal is to give every client – from a house to an apartment building or a company – a modern, reliable and long-lasting solution, anywhere in Serbia.',
            },
            { h: 'What sets us apart' },
            {
              ul: [
                'Licensed, continuously trained team',
                'Reliability – quality equipment from established manufacturers, with a warranty on every installation',
                'Client focus – free site visit and a quote within 48 hours',
                'Continuous development – we follow the latest technology',
              ],
            },
          ],
        ),
      ),
      meta: {
        title: l('O nama – KGB Vision Group', 'About us – KGB Vision Group'),
        description: l(
          'KGB Vision Group iz Obrenovca ugrađuje parking rampe, motore za kapije i kontrolu pristupa. Ovlašćeni montažeri Key Automation opreme.',
          'KGB Vision Group from Obrenovac, Belgrade installs parking barriers, gate motors and access control. Authorised Key Automation installers.',
        ),
      },
    })
  ).id
  pageIds.contact = (
    await createBilingual(payload, 'pages', {
      title: l('Kontakt', 'Contact'),
      slug: l('kontakt', 'contact'),
      template: 'contact',
      lead: l('Uvek raspoloženi za sva vaša pitanja.', 'Always happy to answer your questions.'),
      content: rich(
        rt(
          [{ p: 'Pozovite nas, pišite nam u chatu ili pošaljite upit preko forme. Recite nam šta vam treba i javićemo se sa predlogom i ponudom.' }],
          [{ p: 'Call us, write in the chat or send an inquiry through the form. Tell us what you need and we will get back to you with a proposal and a quote.' }],
        ),
      ),
      layout: [{ blockType: 'map', heading: l('Gde smo', 'Where we are'), height: 440 }],
      meta: {
        title: l('Kontakt – zatražite ponudu', 'Contact – request a quote'),
        description: l(
          'Kontaktirajte KGB Automation: 066/510-11-50, office@kgb.co.rs, Vojvode Mišića 179, Beograd-Obrenovac. Pošaljite upit za rampu, kapiju ili kontrolu pristupa.',
          'Contact KGB Automation: +381 66 510 1150, office@kgb.co.rs, Vojvode Mišića 179, Belgrade-Obrenovac. Send an inquiry for a barrier, gate or access control.',
        ),
      },
    })
  ).id

  console.log('→ Početna')
  await updateGlobalBilingual(payload, 'home', {
    layout: [
      {
        blockType: 'hero',
        height: 'large',
        slides: [
          { image: img.heroGate, link: { type: 'internal' } },
          { image: img.heroBarrier, link: { type: 'internal' } },
          { image: img.heroAccess, link: { type: 'internal' } },
        ],
      },
      {
        blockType: 'introBand',
        tone: 'grey',
        text: l(
          'Projektujemo, ugrađujemo i održavamo Key Automation motore za klizne i krilne kapije, rampe za parking i kontrolu pristupa širom Srbije. Licenca MUP-a i besplatna ponuda za 48h.',
          'We design, install and maintain Key Automation sliding and swing gate motors, parking barriers and access control across Serbia. Licensed installer, free quote within 48 hours.',
        ),
        link: link('pages', pageIds.catalog, l('Pogledajte katalog proizvoda', 'Browse the product catalogue')),
      },
      { blockType: 'categoryGrid', heading: l('Proizvodi', 'Products'), source: 'top', columns: '4' },
      { blockType: 'productTiles', heading: l('Izdvojeni proizvodi', 'Featured products'), source: 'featured', limit: 6, columns: '3', tone: 'grey' },
      {
        blockType: 'richText',
        heading: l('Kako radimo – od upita do ugradnje u 4 koraka', 'How we work – from inquiry to installation in 4 steps'),
        align: 'left',
        tone: 'white',
        content: rich(
          rt(
            [
              { h: '1. Upit i konsultacije' },
              { p: 'Javite nam se, a zajedno definišemo šta vam je potrebno za kuću, zgradu ili firmu i koji je vaš budžet.' },
              { h: '2. Besplatan izlazak na teren i ponuda' },
              { p: 'Besplatno obilazimo vaš objekat i za 48h šaljemo ponudu sa tačnom cenom.' },
              { h: '3. Ugradnja' },
              { p: 'Stručno ugrađujemo motore za kapije, rampe i kontrolu pristupa, uz minimalno ometanje.' },
              { h: '4. Povezivanje na telefon i podrška' },
              { p: 'Puštamo sistem u rad, povezujemo ga na vaš telefon, pokazujemo kako se koristi i ostajemo na raspolaganju za servis.' },
            ],
            [
              { h: '1. Inquiry and consultation' },
              { p: 'Get in touch and together we work out what your home, building or company needs and what your budget is.' },
              { h: '2. Free site visit and quote' },
              { p: 'We visit your site free of charge and send an exact quote within 48 hours.' },
              { h: '3. Installation' },
              { p: 'We install gate motors, barriers and access control professionally, with minimal disruption.' },
              { h: '4. Phone setup and support' },
              { p: 'We commission the system, connect it to your phone, show you how to use it and stay available for service.' },
            ],
          ),
        ),
      },
      { blockType: 'services', heading: l('Usluge', 'Services'), intro: l('Od izlaska na teren i ponude, preko montaže, do servisa i podrške.', 'From site visit and quote, through installation, to service and support.') },
      {
        blockType: 'projects',
        heading: l('Ugradili smo', 'Our installations'),
        limit: 6,
        link: link('pages', pageIds.portfolio, l('Svi projekti', 'All projects')),
      },
      {
        blockType: 'banner',
        image: img.heroGate,
        title: l('KGB', 'KGB'),
        subtitle: l('Automation', 'Automation'),
        link: link('pages', pageIds.services, l('Saznajte kako radimo – od ponude do servisa', 'See how we work – from quote to service')),
      },
      {
        blockType: 'ctaBand',
        tone: 'grey',
        text: l(
          'Treba vam rampa, kapija ili kontrola pristupa? Opišite nam objekat i dobićete predlog rešenja i ponudu.',
          'Need a barrier, gate or access control? Tell us about your site and we will send a proposed solution and a quote.',
        ),
        link: link('pages', pageIds.contact, l('Zatražite ponudu', 'Request a quote')),
      },
      { blockType: 'faq', heading: l('Često postavljena pitanja', 'Frequently asked questions'), source: 'home' },
      { blockType: 'clients', heading: l('Ponosni na naše klijente i saradnike', 'Clients and partners who trust us') },
      { blockType: 'map', heading: l('Gde smo', 'Where we are'), height: 440 },
    ],
    meta: {
      title: l('Parking rampe, motori za kapije i kontrola pristupa | KGB Automation', 'Parking barriers, gate motors and access control | KGB Automation'),
      description: l(
        'Ugradnja Key Automation parking rampi, motora za kapije i kontrole pristupa u Beogradu i Srbiji. Montaža, servis i podrška. Pozovite 066/510-11-50.',
        'Key Automation parking barriers, gate motors and access control installed in Belgrade and across Serbia. Installation, service and support.',
      ),
      image: img.heroBarrier,
    },
  })

  console.log('→ Meni i futer')
  const topCats = await payload.find({ collection: 'product-categories', locale: 'all', depth: 0, limit: 50, sort: 'order', where: { parent: { exists: false } } })
  const footerProducts = topCats.docs
    .filter((c) => c.showInMenu !== false)
    .map((c) => {
      const t = c.title as unknown as { sr: string; en?: string }
      return { label: l(t.sr, t.en || t.sr), link: link('product-categories', c.id as number) }
    })
  await updateGlobalBilingual(payload, 'navigation', {
    items: [
      { label: l('Početna', 'Home'), kind: 'link', link: { type: 'custom', url: l('/sr', '/en') } },
      { label: l('Proizvodi', 'Products'), kind: 'products', link: link('pages', pageIds.catalog) },
      { label: l('Usluge', 'Services'), kind: 'services', link: link('pages', pageIds.services) },
      { label: l('Portfolio', 'Portfolio'), kind: 'link', link: link('pages', pageIds.portfolio) },
      { label: l('O nama', 'About us'), kind: 'link', link: link('pages', pageIds.about) },
      { label: l('Kontakt', 'Contact'), kind: 'link', link: link('pages', pageIds.contact) },
    ],
    cta: link('pages', pageIds.contact, l('Zatražite ponudu', 'Request a quote')),
    showSearch: true,
    showPhone: true,
    footerColumns: [
      { title: l('Proizvodi', 'Products'), links: footerProducts },
      {
        title: l('Usluge', 'Services'),
        links: services.map((s) => ({ label: s.title, link: link('services', serviceIds[s.key]) })),
      },
      {
        title: l('KGB Automation', 'KGB Automation'),
        links: [
          { label: l('Portfolio', 'Portfolio'), link: link('pages', pageIds.portfolio) },
          { label: l('O nama', 'About us'), link: link('pages', pageIds.about) },
          { label: l('Kontakt', 'Contact'), link: link('pages', pageIds.contact) },
        ],
      },
    ],
  })

  console.log('→ Podešavanja')
  await updateGlobalBilingual(payload, 'settings', {
    siteName: 'KGB Automation',
    logo: img.logo,
    favicon: img.favicon,
    footerText: l(
      'Ugradnja parking rampi, motora za kapije i sistema kontrole pristupa. Ovlašćeni partner Key Automation.',
      'Installation of parking barriers, gate motors and access control systems. Authorised Key Automation partner.',
    ),
    phone: '+381665101150',
    phoneDisplay: '066/510-11-50',
    email: 'office@kgb.co.rs',
    address: l('Vojvode Mišića 179, Beograd-Obrenovac', 'Vojvode Mišića 179, Belgrade-Obrenovac'),
    workingHours: l('Ponedeljak – petak: 08–16h\nSubota i nedelja: ne radimo', 'Monday – Friday: 8am – 4pm\nSaturday and Sunday: closed'),
    mapsUrl: 'https://maps.app.goo.gl/rQS1jHzXkdGGUxUa8',
    mapEmbedUrl: 'https://www.google.com/maps?q=Vojvode+Mi%C5%A1i%C4%87a+179,+Obrenovac&output=embed',
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/kgbvision/', handle: '@kgbvision' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@kgbvisiongroup', handle: '@kgbvisiongroup' },
      { platform: 'facebook', url: 'https://www.facebook.com/kgbvisiongroup/', handle: 'kgbvisiongroup' },
    ],
    accentColor: '#2bb04a',
    darkColor: '#2f3336',
    greyColor: '#ededed',
    chat: {
      enabled: true,
      agentName: 'KGB Automation',
      avatar: img.favicon,
      agentTitle: l('Obično odgovaramo za nekoliko minuta', 'We usually reply within a few minutes'),
      greeting: l(
        'Zdravo! Kako možemo da pomognemo? Pitajte nas za rampe, kapije, kontrolu pristupa ili servis.',
        'Hi! How can we help? Ask us about barriers, gates, access control or service.',
      ),
    },
    legalName: 'KGB Vision Group d.o.o.',
    pib: '108457380',
    activityCode: '8020',
    bankAccount: '170-0030024686000-06',
    titleTemplate: '| KGB Automation',
    defaultDescription: l(
      'Parking rampe, motori za kapije i kontrola pristupa – Key Automation oprema sa ugradnjom i servisom u Beogradu i Srbiji.',
      'Parking barriers, gate motors and access control – Key Automation equipment with installation and service in Belgrade and Serbia.',
    ),
    defaultOgImage: img.heroBarrier,
    keywords: l(
      'parking rampe, automatske rampe, motori za kapije, kontrola pristupa, Key Automation, Beograd',
      'parking barriers, automatic barriers, gate motors, access control, Key Automation, Belgrade',
    ),
    googleVerification: 'b2IfRI-3JqmoE8bYQhpgYw-IivWrChWlqFJIQusM0-M',
    bingVerification: '0A9469EB8F26CC8B101FAA2CFF86C22E',
    yandexVerification: '836766c831db6366',
  })

  console.log('→ Administrator')
  const users = await payload.count({ collection: 'users' })
  if (users.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@kgb.co.rs'
    const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
    await payload.create({ collection: 'users', data: { email, password, name: 'Administrator' } })
    fs.writeFileSync('.admin-login.txt', `CMS: /admin\nE-mail: ${email}\nLozinka: ${password}\n\nPromenite lozinku posle prve prijave i obrišite ovaj fajl.\n`)
    console.log(`  Nalog napravljen: ${email} (lozinka je u fajlu .admin-login.txt)`)
  }

  console.log('✓ Gotovo')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
