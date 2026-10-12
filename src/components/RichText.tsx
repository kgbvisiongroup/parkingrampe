import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichText({
  data,
  className = '',
  invert,
}: {
  data: unknown
  className?: string
  invert?: boolean
}) {
  if (!data || typeof data !== 'object') return null
  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      className={`prose-kgb ${invert ? 'prose-invert' : ''} ${className}`}
    />
  )
}
