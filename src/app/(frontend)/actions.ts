'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

export type InquiryState = { status: 'idle' | 'success' | 'error'; fieldErrors?: Record<string, string> }

const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? '').trim().slice(0, max)

export async function submitInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  // Spam checks: hidden field must stay empty, and a human takes more than 3 seconds to fill the form.
  if (clean(form.get('company_website'), 200)) return { status: 'success' }
  const started = Number(form.get('started') || 0)
  if (started && Date.now() - started < 3000) return { status: 'success' }

  const h = await headers()
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || 'local'
  if (rateLimited(ip)) return { status: 'error' }

  const name = clean(form.get('name'), 120)
  const email = clean(form.get('email'), 160)
  const phone = clean(form.get('phone'), 40)
  const service = clean(form.get('service'), 120)
  const message = clean(form.get('message'), 4000)
  const locale = clean(form.get('locale'), 5)
  const pageUrl = clean(form.get('pageUrl'), 300)

  const fieldErrors: Record<string, string> = {}
  if (!name) fieldErrors.name = 'required'
  if (!message) fieldErrors.message = 'required'
  if (!email && !phone) fieldErrors.phone = 'required'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'invalidEmail'
  if (Object.keys(fieldErrors).length) return { status: 'error', fieldErrors }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: { name, email: email || undefined, phone, service, message, locale, pageUrl, status: 'new' },
    })
    return { status: 'success' }
  } catch (err) {
    console.error('Inquiry failed', err)
    return { status: 'error' }
  }
}
