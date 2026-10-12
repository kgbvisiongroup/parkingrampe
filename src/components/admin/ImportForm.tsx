'use client'

import { useState } from 'react'

type Result = {
  rows: number
  created: number
  updated: number
  skipped: number
  imagesAdded: number
  categoriesCreated: string[]
  missingImages: string[]
  errors: string[]
}

const box: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 8,
  padding: '18px 20px',
  background: 'var(--theme-elevation-0)',
}
const label: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: 6 }
const hint: React.CSSProperties = { fontSize: 13, color: 'var(--theme-elevation-500)', marginTop: 6 }

export function ImportForm({ categories }: { categories: { id: number; label: string }[] }) {
  const [mode, setMode] = useState<'file' | 'fixed' | 'none'>('file')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setResult(null)
    const fd = new FormData(e.currentTarget)
    fd.set('updateExisting', String(fd.get('updateExisting') === 'on'))
    fd.set('keepCategory', String(fd.get('keepCategory') === 'on'))
    try {
      const res = await fetch('/api/import/products', { method: 'POST', body: fd, credentials: 'include' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Uvoz nije uspeo.')
      setResult(json)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ maxWidth: 820, paddingBottom: 60 }}>
      <h1 style={{ marginBottom: 6 }}>Uvoz proizvoda iz Excela</h1>
      <p style={{ color: 'var(--theme-elevation-600)', marginTop: 0 }}>
        Excel treba da ima kolone <b>Šifra</b> i <b>Naziv</b>, a po želji <b>Kategorija</b>, <b>Podkategorija</b>, <b>Slika</b> i{' '}
        <b>Cena</b>. Ostale kolone (npr. EAN) se preskaču. Slike pošaljite kao ZIP – ime slike mora da bude isto kao u koloni „Slika”
        (ili kao šifra, npr. <code>KSUN5024EK.jpg</code>).{' '}
        <a href="/sablon-proizvodi.xlsx" style={{ textDecoration: 'underline' }}>
          Preuzmite prazan šablon
        </a>
        .
      </p>

      <form onSubmit={submit} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        <div style={box}>
          <label style={label} htmlFor="excel">
            1. Excel fajl (.xlsx) *
          </label>
          <input id="excel" name="excel" type="file" accept=".xlsx" required />
        </div>

        <div style={box}>
          <label style={label} htmlFor="images">
            2. Slike – ZIP arhiva (opciono)
          </label>
          <input id="images" name="images" type="file" accept=".zip" />
          <p style={hint}>Umesto ZIP-a možete izabrati i više slika odjednom:</p>
          <input id="photos" name="photos" type="file" accept="image/*" multiple />
        </div>

        <div style={box}>
          <span style={label}>3. Kategorije</span>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>
              <input type="radio" name="categoryMode" value="file" checked={mode === 'file'} onChange={() => setMode('file')} /> Iz
              kolona „Kategorija” i „Podkategorija” (nedostajuće kategorije se prave same, sa srpskim nazivima)
            </label>
            <label>
              <input type="radio" name="categoryMode" value="fixed" checked={mode === 'fixed'} onChange={() => setMode('fixed')} /> Sve
              u jednu kategoriju:
            </label>
            {mode === 'fixed' && (
              <select name="categoryId" required style={{ padding: 8, maxWidth: 480 }}>
                <option value="">— izaberite kategoriju —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
            <label>
              <input type="radio" name="categoryMode" value="none" checked={mode === 'none'} onChange={() => setMode('none')} /> Bez
              kategorije – uvezi u „Nerazvrstano”, pa ću ih sam rasporediti
            </label>
          </div>
          <p style={hint}>
            Kasnije više proizvoda prebacujete u kategoriju odjednom: u listi Proizvodi štiklirajte ih, kliknite <b>Izmeni</b> i
            izaberite polje <b>Kategorija</b>.
          </p>
        </div>

        <div style={box}>
          <label style={{ display: 'block' }}>
            <input type="checkbox" name="updateExisting" defaultChecked /> Ažuriraj proizvode koji već postoje (prepoznaju se po šifri)
          </label>
          <label style={{ display: 'block', marginTop: 8 }}>
            <input type="checkbox" name="keepCategory" defaultChecked /> Pri ažuriranju zadrži kategoriju koju sam već izabrao
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={busy}
            style={{
              padding: '12px 22px',
              borderRadius: 6,
              border: 0,
              background: 'var(--theme-elevation-800)',
              color: 'var(--theme-elevation-0)',
              fontWeight: 600,
              cursor: busy ? 'wait' : 'pointer',
            }}
          >
            {busy ? 'Uvozim… (može potrajati minut)' : 'Uvezi proizvode'}
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'var(--theme-error-500)', marginTop: 16, fontWeight: 600 }}>{error}</p>}

      {result && (
        <div style={{ ...box, marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>Uvoz je završen</h3>
          <ul style={{ lineHeight: 1.8 }}>
            <li>Redova u tabeli: {result.rows}</li>
            <li>Novih proizvoda: {result.created}</li>
            <li>Ažuriranih: {result.updated}</li>
            <li>Preskočenih: {result.skipped}</li>
            <li>Povezanih slika: {result.imagesAdded}</li>
            {result.categoriesCreated.length > 0 && <li>Nove kategorije: {result.categoriesCreated.join(', ')}</li>}
          </ul>
          {result.missingImages.length > 0 && (
            <p style={hint}>Slike koje nisu pronađene u ZIP-u: {result.missingImages.join(', ')}</p>
          )}
          {result.errors.length > 0 && (
            <details style={{ marginTop: 8 }}>
              <summary>Greške ({result.errors.length})</summary>
              <ul>
                {result.errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </details>
          )}
          <p style={{ marginTop: 12 }}>
            <a href="/admin/collections/products" style={{ textDecoration: 'underline', fontWeight: 600 }}>
              Otvori listu proizvoda
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
