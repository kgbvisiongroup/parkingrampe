'use client'

import { useAuth, useDocumentInfo, useTranslation } from '@payloadcms/ui'
import { ImageOff, Loader2, Pencil, Trash2, X } from 'lucide-react'
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

/** Delete via the API; the row/document is removed only after "Da" is clicked. */
function useDelete(collectionSlug: string | undefined, id: number | string | undefined, after: () => void) {
  const { i18n } = useTranslation()
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const remove = async () => {
    setBusy(true)
    const res = await fetch(`/api/${collectionSlug}/${id}`, { method: 'DELETE', credentials: 'include' }).catch(() => null)
    setBusy(false)
    setConfirm(false)
    if (res?.ok) after()
    else window.alert(tx(i18n.language, 'Brisanje nije uspelo.', 'Delete failed.'))
  }
  return { confirm, setConfirm, busy, remove, lang: i18n.language }
}

function ConfirmDelete({ busy, lang, onYes, onNo }: { busy: boolean; lang: string; onYes: () => void; onNo: () => void }) {
  return (
    <span className="kgb-row-confirm" role="group" aria-label={tx(lang, 'Potvrda brisanja', 'Confirm delete')}>
      <span className="kgb-row-ask">{tx(lang, 'Obrisati?', 'Delete?')}</span>
      <button type="button" className="kgb-row-btn is-danger is-solid" onClick={onYes} disabled={busy}>
        {busy ? <Loader2 size={14} className="kgb-spin" /> : <Trash2 size={14} />}
        <span>{tx(lang, 'Da', 'Yes')}</span>
      </button>
      <button type="button" className="kgb-row-btn" onClick={onNo} disabled={busy}>
        <X size={14} />
        <span>{tx(lang, 'Ne', 'No')}</span>
      </button>
    </span>
  )
}

/** "Izmeni" and "Obriši" buttons at the end of every list row. */
export function RowActionsCell({ rowData, collectionSlug }: { rowData: Row; collectionSlug: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const { confirm, setConfirm, busy, remove, lang } = useDelete(collectionSlug, rowData.id, () => router.refresh())
  // Nobody can delete their own user account from the list.
  const self = collectionSlug === 'users' && user?.id === rowData.id

  return (
    <div className="kgb-row-actions" onClick={(e) => e.stopPropagation()}>
      {confirm ? (
        <ConfirmDelete busy={busy} lang={lang} onYes={remove} onNo={() => setConfirm(false)} />
      ) : (
        <>
          <a href={`/admin/collections/${collectionSlug}/${rowData.id}`} className="kgb-row-btn is-edit" title={tx(lang, 'Izmeni', 'Edit')}>
            <Pencil size={14} />
            <span>{tx(lang, 'Izmeni', 'Edit')}</span>
          </a>
          {!self && (
            <button type="button" className="kgb-row-btn is-danger" onClick={() => setConfirm(true)} title={tx(lang, 'Obriši', 'Delete')}>
              <Trash2 size={14} />
              <span>{tx(lang, 'Obriši', 'Delete')}</span>
            </button>
          )}
        </>
      )}
    </div>
  )
}

/** "Obriši" button next to "Sačuvaj" in the edit view of every collection. */
export function DocDeleteButton() {
  const { id, collectionSlug } = useDocumentInfo()
  const { user } = useAuth()
  const router = useRouter()
  const { confirm, setConfirm, busy, remove, lang } = useDelete(collectionSlug, id, () => router.push(`/admin/collections/${collectionSlug}`))
  if (!id || !collectionSlug || (collectionSlug === 'users' && user?.id === id)) return null

  return (
    <div className="kgb-row-actions kgb-doc-delete">
      {confirm ? (
        <ConfirmDelete busy={busy} lang={lang} onYes={remove} onNo={() => setConfirm(false)} />
      ) : (
        <button type="button" className="kgb-row-btn is-danger" onClick={() => setConfirm(true)}>
          <Trash2 size={14} />
          <span>{tx(lang, 'Obriši', 'Delete')}</span>
        </button>
      )}
    </div>
  )
}
