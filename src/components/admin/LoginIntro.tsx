'use client'

import { useEffect } from 'react'

/** Shown on the login page above the form: label, title and hints in the empty fields. */
export function LoginIntro() {
  useEffect(() => {
    const set = (selector: string, text: string) => {
      const el = document.querySelector<HTMLInputElement>(selector)
      if (el && !el.placeholder) el.placeholder = text
    }
    // The fields mount together with this component; one frame later they exist.
    const id = requestAnimationFrame(() => {
      set('.login__form input[name="email"]', 'vi@kgb.co.rs')
      set('.login__form input[name="password"]', 'Vaša lozinka')
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="kgb-login-intro">
      <div className="kgb-login-intro__eyebrow">KGB Vision Group</div>
      <h1 className="kgb-login-intro__title">Admin Panel</h1>
      <p className="kgb-login-intro__sub">Prijavite se za upravljanje sadržajem sajta.</p>
    </div>
  )
}
