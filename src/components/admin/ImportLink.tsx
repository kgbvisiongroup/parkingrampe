/** Shown above the product list. */
export function ImportLink() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '0 0 16px', padding: '12px 16px', borderRadius: 8, background: 'var(--theme-elevation-50)' }}>
      <span style={{ flex: 1 }}>Imate listu proizvoda u Excelu? Uvezite sve odjednom, zajedno sa slikama.</span>
      <a href="/admin/uvoz-proizvoda" style={{ fontWeight: 700, textDecoration: 'underline' }}>
        Uvoz iz Excela
      </a>
    </div>
  )
}
