import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'

/*
 * Content only, no schema change:
 * - home page: remove "Useful links", show the client logos strip above the map
 * - working hours: Saturday and Sunday on separate lines
 * A failed step is logged and never stops the site.
 */

type Block = { id?: string | null; blockType: string; [k: string]: unknown }

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  try {
    const home = await payload.findGlobal({ slug: 'home', locale: 'sr', depth: 0, req })
    const layout = ((home?.layout ?? []) as Block[]).filter((b) => b.blockType !== 'linkBoxes')
    if (layout.length) {
      if (!layout.some((b) => b.blockType === 'clients')) {
        const mapAt = layout.findIndex((b) => b.blockType === 'map')
        layout.splice(mapAt === -1 ? layout.length : mapAt, 0, { blockType: 'clients', heading: 'Naši klijenti' })
      }
      await payload.updateGlobal({ slug: 'home', locale: 'sr', data: { layout } as never, depth: 0, req })
      const en = await payload.findGlobal({ slug: 'home', locale: 'en', depth: 0, req })
      const enLayout = ((en?.layout ?? []) as Block[]).map((b) =>
        b.blockType === 'clients' && (!b.heading || b.heading === 'Naši klijenti') ? { ...b, heading: 'Our clients' } : b,
      )
      await payload.updateGlobal({ slug: 'home', locale: 'en', data: { layout: enLayout } as never, depth: 0, req })
      payload.logger.info('Početna: dodati klijenti, uklonjeni korisni linkovi.')
    }
  } catch (err) {
    payload.logger.warn(`Početna nije izmenjena: ${(err as Error).message}`)
  }

  try {
    const fix = [
      ['sr', /Subota i nedelja:\s*ne radimo/i, 'Subota: Neradna\nNedelja: Neradna'],
      ['en', /Saturday and Sunday:\s*closed/i, 'Saturday: Closed\nSunday: Closed'],
    ] as const
    for (const [locale, from, to] of fix) {
      const s = await payload.findGlobal({ slug: 'settings', locale, depth: 0, req, fallbackLocale: false as never })
      const hours = (s as { workingHours?: string | null })?.workingHours
      if (hours && from.test(hours)) {
        await payload.updateGlobal({ slug: 'settings', locale, data: { workingHours: hours.replace(from, to) } as never, depth: 0, req })
      }
    }
  } catch (err) {
    payload.logger.warn(`Radno vreme nije izmenjeno: ${(err as Error).message}`)
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content change only.
}
