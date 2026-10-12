'use client'

import type { ReactNode } from 'react'

/** Opens the chat bubble from anywhere on the page. */
export function OpenChatButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event('kgb:open-chat'))}>
      {children}
    </button>
  )
}
