'use client'

import { AlertCircle, ArrowRight, Eye, EyeOff, Inbox, Loader2, Lock, Mail, MessageCircle, Package } from 'lucide-react'
import { motion, useAnimationControls } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

const Shield = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z" fill="#2bb04a" />
    <path d="m8.5 12 2.4 2.4 4.6-4.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Logo = () => (
  <span className="lg-logo">
    <Shield />
    <span className="lg-logo__text">
      <strong>KGB</strong>
      <span>AUTOMATION</span>
    </span>
  </span>
)

/** A parking barrier whose arm goes up and down in the background. */
const Barrier = () => (
  <svg className="lg-barrier" viewBox="0 0 260 120" aria-hidden>
    <rect x="6" y="70" width="24" height="46" rx="4" fill="#cfd8d3" />
    <circle className="lg-barrier__light" cx="18" cy="80" r="4" />
    <g className="lg-barrier__arm">
      <rect x="14" y="91" width="236" height="10" rx="5" fill="#eef2f0" />
      {[50, 90, 130, 170, 210].map((x) => (
        <rect key={x} x={x} y="91" width="16" height="10" fill="#ff6b6b" />
      ))}
    </g>
  </svg>
)

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] as const } },
}

type Status = 'idle' | 'sending' | 'redirecting'

export function LoginScreen({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const shake = useAnimationControls()
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => emailRef.current?.focus(), [])

  const fail = (message: string) => {
    setError(message)
    setStatus('idle')
    void shake.start({ x: [0, -10, 10, -7, 7, -3, 0], transition: { duration: 0.45 } })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return fail('Upišite email i lozinku.')
    setError(null)
    setStatus('sending')
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const msg: string = body?.errors?.[0]?.message ?? ''
        if (/zaklju|lock/i.test(msg)) return fail('Nalog je privremeno zaključan zbog više pogrešnih pokušaja. Pokušajte za 10 minuta.')
        return fail('Pogrešan email ili lozinka.')
      }

      // The password was right. Make sure the browser kept the session cookie,
      // otherwise the admin panel would just send us back here.
      const me = await fetch('/api/users/me', { credentials: 'include', cache: 'no-store' })
      const meBody = await me.json().catch(() => null)
      if (!meBody?.user) {
        // Payload accepts the session only from the site address set on the server.
        const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
        if (site && site !== window.location.origin) {
          return fail(
            `Adresa u pregledaču (${window.location.origin}) nije ista kao adresa sajta na serveru (${site}). U fajlu .env postavite NEXT_PUBLIC_SITE_URL=${window.location.origin} ili je dodajte u ALLOWED_ORIGINS, pa pokrenite npm run build i pm2 restart parkingrampe.`,
          )
        }
        return fail(
          'Lozinka je tačna, ali pregledač nije sačuvao prijavu (kolačić). Proverite da li pregledač blokira kolačiće za ovu adresu ili da li ga uređaj između (proxy/firewall) uklanja.',
        )
      }

      setStatus('redirecting')
      window.location.assign(redirectTo)
    } catch {
      fail('Server nije dostupan. Proverite vezu i pokušajte ponovo.')
    }
  }

  const busy = status !== 'idle'

  return (
    <>
      <div className="lg-scene" aria-hidden>
        <div className="lg-blob lg-blob--1" />
        <div className="lg-blob lg-blob--2" />
        <div className="lg-blob lg-blob--3" />
        <div className="lg-grid" />
        <Barrier />
      </div>

      <main className="lg-wrap">
        <motion.section
          className="lg-brand"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        >
          <motion.div variants={item}>
            <Logo />
          </motion.div>
          <motion.h1 className="lg-headline" variants={item}>
            Rampe, kapije i kontrola pristupa – <em>sve na jednom mestu.</em>
          </motion.h1>
          <motion.p className="lg-lead" variants={item}>
            Upravljajte sadržajem sajta parkingrampe.rs: proizvodi, stranice, chat poruke i upiti kupaca.
          </motion.p>
          <motion.ul className="lg-features" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
            {[
              { icon: Package, text: 'Katalog proizvoda i uvoz iz Excela' },
              { icon: MessageCircle, text: 'Chat sa posetiocima u realnom vremenu' },
              { icon: Inbox, text: 'Upiti sa kontakt forme na jednom mestu' },
            ].map((f) => (
              <motion.li key={f.text} variants={item}>
                <i>
                  <f.icon size={16} aria-hidden />
                </i>
                {f.text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <motion.form className="lg-card" onSubmit={onSubmit} animate={shake} noValidate>
            <div className="lg-card__mobile-logo">
              <Logo />
            </div>
            <p className="lg-eyebrow">KGB Vision Group</p>
            <h2 className="lg-title">Admin Panel</h2>
            <p className="lg-sub">Prijavite se za upravljanje sadržajem sajta.</p>

            <label className="lg-field">
              <span className="lg-label">Email</span>
              <span className="lg-input-wrap">
                <Mail size={18} aria-hidden />
                <input
                  ref={emailRef}
                  className="lg-input"
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder="vi@kgb.co.rs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                />
              </span>
            </label>

            <label className="lg-field">
              <span className="lg-label">Lozinka</span>
              <span className="lg-input-wrap">
                <Lock size={18} aria-hidden />
                <input
                  className="lg-input"
                  type={show ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Vaša lozinka"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                />
                <button
                  type="button"
                  className="lg-eye"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {error && (
              <motion.div className="lg-error" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                <AlertCircle size={17} aria-hidden />
                <span>{error}</span>
              </motion.div>
            )}

            <button type="submit" className="lg-button" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 size={18} className="lg-spin" aria-hidden />
                  {status === 'redirecting' ? 'Otvaram panel…' : 'Prijavljujem…'}
                </>
              ) : (
                <>
                  Prijavi se
                  <ArrowRight size={18} aria-hidden />
                </>
              )}
            </button>

            <p className="lg-foot">
              <a href="/">← Nazad na sajt</a>
            </p>
          </motion.form>
        </motion.div>
      </main>
    </>
  )
}
