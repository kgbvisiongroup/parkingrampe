import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { LoginScreen } from '@/components/admin/LoginScreen'

/** Only paths on this site are allowed after login (no open redirects). */
function safeRedirect(value: string | string[] | undefined) {
  const v = Array.isArray(value) ? value[0] : value
  return v && v.startsWith('/') && !v.startsWith('//') ? v : '/admin'
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const to = safeRedirect(params.redirect)

  // Already signed in: go straight to the admin panel.
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (user) redirect(to)

  return <LoginScreen redirectTo={to} />
}
