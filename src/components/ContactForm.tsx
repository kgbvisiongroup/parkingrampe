'use client'

import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
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
    'mt-1.5 w-full border border-line bg-white px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-dark'

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
        <span className="label-caps text-ink">{labels.name} *</span>
        <input name="name" required autoComplete="name" className={input} aria-invalid={!!state.fieldErrors?.name} aria-describedby="name-error" />
        {err('name')}
      </label>
      <label className="block">
        <span className="label-caps text-ink">{labels.phone} *</span>
        <input name="phone" type="tel" autoComplete="tel" className={input} aria-invalid={!!state.fieldErrors?.phone} aria-describedby="phone-error" />
        {err('phone')}
      </label>
      <label className="block">
        <span className="label-caps text-ink">{labels.email}</span>
        <input name="email" type="email" autoComplete="email" className={input} aria-invalid={!!state.fieldErrors?.email} aria-describedby="email-error" />
        {err('email')}
      </label>
      <label className="block sm:col-span-2">
        <span className="label-caps text-ink">{labels.service}</span>
        <select name="service" defaultValue={defaultService || ''} className={`${input} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%2359656a%22 stroke-width=%222%22><path d=%22m4 6 4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`}>
          <option value="">{labels.chooseService}</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value={labels.other}>{labels.other}</option>
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="label-caps text-ink">{labels.message} *</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={labels.messagePlaceholder}
          className={`${input} resize-y`}
          aria-invalid={!!state.fieldErrors?.message}
          aria-describedby="message-error"
        />
        {err('message')}
      </label>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={pending} className="btn-dark px-6 py-3 disabled:opacity-60">
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
