import '@fontsource-variable/plus-jakarta-sans'
import './login.css'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Prijava – KGB Admin Panel',
  description: 'Prijava u administraciju sajta parkingrampe.rs.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.png' },
}

export const viewport: Viewport = { themeColor: '#0a0d0c' }

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sr-Latn">
      <body className="kgb-login-body">{children}</body>
    </html>
  )
}
