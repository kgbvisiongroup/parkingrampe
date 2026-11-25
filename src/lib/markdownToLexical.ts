/**
 * Small Markdown → Lexical converter for the content drafts in /content-drafts.
 * Supports: ### / #### headings, paragraphs, "- " and "1. " lists, **bold**, [links](/path).
 */

const base = { direction: 'ltr', format: '', indent: 0, version: 1 }
const textNode = (text: string, bold = false) => ({ type: 'text', text, format: bold ? 1 : 0, detail: 0, mode: 'normal', style: '', version: 1 })

/** Inline text with **bold** and [links](url). */
function inline(src: string): unknown[] {
  const out: unknown[] = []
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(textNode(src.slice(last, m.index)))
    if (m[1] !== undefined) {
      // Bold text may contain a link: [x](y) inside ** **.
      const inner = inline(m[1]) as { type: string; format?: number; children?: { format?: number }[] }[]
      for (const n of inner) {
        if (n.type === 'text') n.format = 1
        else n.children?.forEach((c) => (c.format = 1))
      }
      out.push(...inner)
    } else {
      out.push({ type: 'link', fields: { linkType: 'custom', url: m[3], newTab: false }, children: [textNode(m[2])], ...base, version: 3 })
    }
    last = m.index + m[0].length
  }
  if (last < src.length) out.push(textNode(src.slice(last)))
  return out
}

export function markdownToLexical(md: string) {
  const lines = md.replace(/\r/g, '').split('\n')
  const children: unknown[] = []
  let para: string[] = []
  let list: { type: 'bullet' | 'number'; items: string[] } | null = null

  const flushPara = () => {
    if (para.length) children.push({ type: 'paragraph', textFormat: 0, children: inline(para.join(' ')), ...base })
    para = []
  }
  const flushList = () => {
    if (list) {
      children.push({
        type: 'list',
        listType: list.type,
        tag: list.type === 'bullet' ? 'ul' : 'ol',
        start: 1,
        children: list.items.map((t, i) => ({ type: 'listitem', value: i + 1, children: inline(t), ...base })),
        ...base,
      })
    }
    list = null
  }

  for (const raw of lines) {
    const line = raw.trim()
    const h = line.match(/^(#{3,4})\s+(.*)$/)
    const bullet = line.match(/^[-*]\s+(.*)$/)
    const num = line.match(/^\d+\.\s+(.*)$/)
    if (!line) {
      flushPara()
      flushList()
    } else if (h) {
      flushPara()
      flushList()
      children.push({ type: 'heading', tag: h[1].length === 3 ? 'h3' : 'h4', children: inline(h[2]), ...base })
    } else if (bullet || num) {
      flushPara()
      const type = bullet ? 'bullet' : 'number'
      if (list && list.type !== type) flushList()
      list ??= { type, items: [] }
      list.items.push((bullet ?? num)![1])
    } else {
      flushList()
      para.push(line)
    }
  }
  flushPara()
  flushList()
  return { root: { type: 'root', children, ...base } }
}
