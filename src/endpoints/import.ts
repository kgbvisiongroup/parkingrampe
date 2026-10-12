import type { Endpoint } from 'payload'
import { type CategoryMode, importProducts, parseWorkbook, readZipImages } from '../lib/catalogImport'

const bad = (status: number, error: string) => Response.json({ error }, { status })

export const importEndpoints: Endpoint[] = [
  {
    // Upload: Excel (required) + ZIP with images (optional).
    path: '/import/products',
    method: 'post',
    handler: async (req) => {
      if (!req.user) return bad(401, 'Prijavite se u admin panel.')
      let form: FormData
      try {
        form = await (req as unknown as Request).formData()
      } catch {
        return bad(400, 'Fajl nije primljen. Pokušajte ponovo.')
      }
      const excel = form.get('excel')
      if (!(excel instanceof Blob) || !excel.size) return bad(400, 'Izaberite Excel fajl (.xlsx).')
      const zip = form.get('images')
      const images = new Map<string, Buffer>()
      const extra = form.getAll('photos')

      try {
        const rows = await parseWorkbook(Buffer.from(await excel.arrayBuffer()))
        if (!rows.length) return bad(400, 'U tabeli nema redova sa šifrom i nazivom.')
        if (zip instanceof Blob && zip.size) {
          for (const [k, v] of readZipImages(Buffer.from(await zip.arrayBuffer()))) images.set(k, v)
        }
        // Single images can also be picked directly instead of a ZIP.
        for (const f of extra) {
          if (f instanceof File && f.size) images.set(f.name.toLowerCase(), Buffer.from(await f.arrayBuffer()))
        }
        const mode = (String(form.get('categoryMode') || 'file') as CategoryMode) || 'file'
        const result = await importProducts(req.payload, rows, images, {
          categoryMode: mode,
          categoryId: Number(form.get('categoryId')) || undefined,
          updateExisting: form.get('updateExisting') === 'true',
          keepCategory: form.get('keepCategory') === 'true',
        })
        return Response.json({ rows: rows.length, ...result })
      } catch (err) {
        req.payload.logger.error({ err, msg: 'Uvoz proizvoda nije uspeo' })
        return bad(400, (err as Error).message || 'Uvoz nije uspeo.')
      }
    },
  },
]
