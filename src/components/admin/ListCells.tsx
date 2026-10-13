'use client'

import { useTranslation } from '@payloadcms/ui'
import { ImageOff, Loader2, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { tx } from './adminText'

type Row = { id?: number | string; images?: unknown[]; image?: unknown; cover?: unknown; title?: string }
type MediaLike = { url?: string | null; sizes?: { thumb?: { url?: string | null } } }

const cache = new Map<string, Promise<string | null>>()

/** Thumbnail URL of a media item (object or id); ids are fetched once and cached. */
function thumbOf(ref: unknown): Promise<string | null> {
  if (!ref) return Promise.resolve(null)
  if (typeof ref === 'object') {
    const m = ref as MediaLike
    return Promise.resolve(m.sizes?.thumb?.url || m.url || null)
  }
  const key = String(ref)
  if (!cache.has(key)) {
    cache.set(
      key,
      fetch(`/api/media/${key}?depth=0`, { credentials: 'include' })
        .then((r) => (r.ok ? r.json() : null))
        .then((m: MediaLike | null) => m?.sizes?.thumb?.url || m?.url || null)
        .catch(() => null),
    )
  }
  return cache.get(key)!
}

const relative = (u: string) => u.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '')

/** First image of the row, linking to the edit page. */
export function ThumbCell({ rowData, collectionSlug }: { rowData: Row; collectionSlug: string }) {
  const ref = rowData.images?.[0] ?? rowData.image ?? rowData.cover
  const [src, setSrc] = useState<string | null | undefined>(undefined)
  useEffect(() => {
    let alive = true
    void thumbOf(ref).then((u) => alive && setSrc(u))
    return () => {
      alive = false
    }
  }, [ref])
  return (
    <a href={`/admin/collections/${collectionSlug}/${rowData.id}`} className="kgb-thumb" aria-label={rowData.title}>
      {src ? <img src={relative(src)} alt="" loading="lazy" /> : src === null ? <ImageOff size={16} /> : <span className="kgb-thumb__ph" />}
    </a>
  )
}

/** Pencil (edit) and trash (delete, with confirmation) at the end of every row. */
export function RowActionsCell({ rowData, collectionSlug }: { rowData: Row; collectionSlug: string }) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)

  const remove = async () => {
    setBusy(true)
    const res = await fetch(`/api/${collectionSlug}/${rowData.id}`, { method: 'DELETE', credentials: 'include' }).catch(() => null)
    setBusy(false)
    setConfirm(false)
    if (res?.ok) router.refresh()
    else window.alert(tx(lang, 'Brisanje nije uspelo.', 'Delete failed.'))
  }

  return (
    <div className="kgb-row-actions">
      <a href={`/admin/collections/${collectionSlug}/${rowData.id}`} className="kgb-row-btn" title={tx(lang, 'Izmeni', 'Edit')} aria-label={tx(lang, 'Izmeni', 'Edit')}>
        <Pencil size={15} />
      </a>
      {confirm ? (
        <span className="kgb-row-confirm">
          <button type="button" className="kgb-row-btn is-danger is-solid" onClick={remove} disabled={busy}>
            {busy ? <Loader2 size={14} className="kgb-spin" /> : tx(lang, 'Obriši', 'Delete')}
          </button>
          <button type="button" className="kgb-row-btn" onClick={() => setConfirm(false)} disabled={busy}>
            {tx(lang, 'Ne', 'No')}
          </button>
        </span>
      ) : (
        <button type="button" className="kgb-row-btn is-danger" onClick={() => setConfirm(true)} title={tx(lang, 'Obriši', 'Delete')} aria-label={tx(lang, 'Obriši', 'Delete')}>
          <Trash2 size={15} />
        </button>
      )}
    </div>
  )
}
