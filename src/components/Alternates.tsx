'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'

type Paths = Partial<Record<Locale, string>>
type Ctx = { paths: Paths; setPaths: (p: Paths) => void }

const AlternatesContext = createContext<Ctx>({ paths: {}, setPaths: () => {} })

export function AlternatesProvider({ children }: { children: ReactNode }) {
  const [paths, setPaths] = useState<Paths>({})
  return <AlternatesContext.Provider value={{ paths, setPaths }}>{children}</AlternatesContext.Provider>
}

/** Rendered by each page so the language switch links to the same page in the other language. */
export function SetAlternates({ paths }: { paths: Paths }) {
  const { setPaths } = useContext(AlternatesContext)
  const key = JSON.stringify(paths)
  useEffect(() => {
    setPaths(JSON.parse(key))
  }, [key, setPaths])
  return null
}

export function useAlternates() {
  return useContext(AlternatesContext).paths
}
