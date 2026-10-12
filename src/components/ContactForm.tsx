'use client'

import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Loader2, Mail, MessageSquare, Phone, Send, User } from 'lucide-react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { submitInquiry, type InquiryState } from '@/app/(frontend)/actions'
import type { Dictionary, Locale } from '@/lib/i18n'

type Props = { locale: Locale; labels: Dictionary['form']; services: string[]; defaultService?: string }

const initial: InquiryState = { status: 'idle' }

export function ContactForm({ locale, labels, services, defaultService }: Props) {
  const [state, action, pending] = useActionState(submitInquiry, initial)
  const [started, setStarted] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const [pageUrl, setPageUrl] = useState('')
  useEffect(() => {
    setStarted(String(Date.now()))
    setPageUrl(window.location.pathname)
  }, [])
  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state])

  const err = (field: string) => {
    const code = state.fieldErrors?.[field]
    if (!code) return null
    return (
      <p id={`${field}-error`} className="mt-1.5 text-[13px] font-bold text-alert">
        {code === 'invalidEmail' ? labels.invalidEmail : labels.required}
      </p>
    )
  }

  const input =
    'peer w-full rounded-xl border border-line/80 bg-[#f6f7f7] py-3 pl-11 pr-4 text-[14px] text-ink outline-none transition-all placeholder:text-muted/60 hover:border-muted/50 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-alert'
  const icon = 'pointer-events-none absolute left-4 top-[14px] size-[18px] text-muted transition-colors peer-focus:text-accent'
  const label = 'mb-1.5 block text-[12.5px] font-bold text-ink'

  return (
    <form ref={formRef} action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="started" value={started} />
      <input type="hidden" name="pageUrl" value={pageUrl} />
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="block sm:col-span-2">
        <span className={label}>{labels.name} *</span>
        <span className="relative block">
          <input name="name" required autoComplete="name" className={input} aria-invalid={!!state.fieldErrors?.name} aria-describedby="name-error" />
          <User className={icon} aria-hidden />
        </span>
        {err('name')}
      </label>
      <label className="block">
        <span className={label}>{labels.phone} *</span>
        <span className="relative block">
          <input name="phone" type="tel" autoComplete="tel" placeholder="06x xxx xxxx" className={input} aria-invalid={!!state.fieldErrors?.phone} aria-describedby="phone-error" />
          <Phone className={icon} aria-hidden />
        </span>
        {err('phone')}
      </label>
      <label className="block">
        <span className={label}>{labels.email}</span>
        <span className="relative block">
          <input name="email" type="email" autoComplete="email" placeholder="ime@primer.rs" className={input} aria-invalid={!!state.fieldErrors?.email} aria-describedby="email-error" />
          <Mail className={icon} aria-hidden />
        </span>
        {err('email')}
      </label>

      <fieldset className="sm:col-span-2">
        <legend className={label}>{labels.service}</legend>
        <div className="flex flex-wrap gap-2">
          {[...services, labels.other].map((s) => (
            <label key={s} className="cursor-pointer">
              <input type="radio" name="service" value={s} defaultChecked={s === defaultService} className="peer sr-only" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-body transition-all hover:border-muted/60 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-accent/25">
                {s}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block sm:col-span-2">
        <span className={label}>{labels.message} *</span>
        <span className="relative block">
          <textarea
            name="message"
            required
            rows={5}
            placeholder={labels.messagePlaceholder}
            className={`${input} resize-y`}
            aria-invalid={!!state.fieldErrors?.message}
            aria-describedby="message-error"
          />
          <MessageSquare className={icon} aria-hidden />
        </span>
        {err('message')}
      </label>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_24px_-10px_var(--accent)] transition-all hover:-translate-y-0.5 hover:brightness-105 disabled:translate-y-0 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          )}
          {pending ? labels.sending : labels.send}
        </button>
        <div aria-live="polite" className="min-h-6">
          <AnimatePresence mode="wait">
            {state.status === 'success' && (
              <motion.p
                key="ok"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-[14px] font-bold text-ink"
              >
                <CheckCircle2 className="size-5 text-accent" aria-hidden />
                {labels.success}
              </motion.p>
            )}
            {state.status === 'error' && !state.fieldErrors && (
              <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px] font-bold text-alert">
                {labels.error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  )
}
