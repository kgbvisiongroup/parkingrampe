/** Small helpers for Lexical rich text stored by the CMS. */

type Node = { type?: string; text?: string; tag?: string; children?: Node[] }
type State = { root?: Node }

export function plainText(node?: Node | null): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(plainText).join(node.type === 'root' ? '\n' : '')
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()

/**
 * The product description without what the page already shows:
 * paragraphs that repeat the short text (shown under the name) and the
 * "Sadržaj kompleta" heading + list when the spec table already has that row.
 * Returns null when nothing is left.
 */
export function descriptionWithoutRepeats(data: unknown, excerpt?: string | null, specLabels: string[] = []): State | null {
  const state = data as State | null
  const children = state?.root?.children
  if (!children?.length) return null
  const ex = norm(excerpt ?? '')
  const kitInSpecs = specLabels.some((l) => /sadržaj kompleta|kit contents/i.test(l))
  const out: Node[] = []
  for (let i = 0; i < children.length; i++) {
    const n = children[i]
    const txt = norm(plainText(n))
    if (!txt) continue
    // Same sentence as the short text (the short text is the first 300 characters of it).
    if (ex && (txt === ex || txt.startsWith(ex.slice(0, 120)) || ex.startsWith(txt))) continue
    if (kitInSpecs && n.type === 'heading' && /^(sadržaj kompleta|kit contents)$/.test(txt)) {
      if (children[i + 1]?.type === 'list') i++
      continue
    }
    out.push(n)
  }
  return out.length ? { ...state, root: { ...state!.root, children: out } } : null
}
