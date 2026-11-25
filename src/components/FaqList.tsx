import { Plus } from 'lucide-react'

/**
 * Questions that open on click. Every answer is in the server HTML (<details>), so Google
 * and the FAQPage data see the same text the visitor sees.
 */
export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="border-t border-line">
      {items.map((f, i) => (
        <details key={i} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="text-[14.5px] font-bold text-ink group-hover:text-black">{f.question}</h3>
            <Plus className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-45" aria-hidden />
          </summary>
          <p className="whitespace-pre-line pb-5 pr-10 text-[14px]">{f.answer}</p>
        </details>
      ))}
    </div>
  )
}
