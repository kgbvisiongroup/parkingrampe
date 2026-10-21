/**
 * HTML e-mail for notifications to the office (new inquiry, new chat message).
 * Dark card in the KGB style; inline styles and tables so it looks the same in Gmail, Outlook and phones.
 */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export type EmailRow = { label: string; value: string; href?: string }

export type NotificationEmail = {
  eyebrow: string
  title: string
  intro: string
  rows: EmailRow[]
  messageLabel: string
  message: string
  button?: { label: string; href: string }
}

const C = {
  page: '#070a09',
  card: '#111816',
  line: '#26302c',
  box: '#0b100e',
  text: '#f2f5f4',
  muted: '#8b9691',
  soft: '#b9c2be',
  accent: '#19b67c',
  accentText: '#3ed39a',
  link: '#3b82f6',
}

export function siteAddress() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://parkingrampe.rs').replace(/\/$/, '')
}

/** "21. okt 2026. 06:36" in Belgrade time. */
export function receivedAt(date = new Date()) {
  const d = new Intl.DateTimeFormat('sr-Latn-RS', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Belgrade' }).format(date)
  const t = new Intl.DateTimeFormat('sr-Latn-RS', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Belgrade' }).format(date)
  return `${d} ${t}`
}

export function renderNotification(e: NotificationEmail): { html: string; text: string } {
  const font = "font-family:Roboto,'Segoe UI',Helvetica,Arial,sans-serif"
  const rows = e.rows
    .filter((r) => r.value)
    .map(
      (r) => `
        <tr>
          <td style="${font};padding:18px 0;border-bottom:1px solid ${C.line};width:34%;vertical-align:top;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted}">${esc(r.label)}</td>
          <td style="${font};padding:16px 0;border-bottom:1px solid ${C.line};vertical-align:top;font-size:17px;color:${C.text}">${
            r.href ? `<a href="${esc(r.href)}" style="color:${C.link};text-decoration:underline">${esc(r.value)}</a>` : esc(r.value)
          }</td>
        </tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html lang="sr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>${esc(e.title)}</title></head>
<body style="margin:0;padding:0;background:${C.page}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}">
    <tr><td align="center" style="padding:28px 14px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
        <tr><td style="${font};padding:0 8px 22px;font-size:26px;font-weight:700;color:#ffffff">KGB <span style="color:${C.accent}">Vision Group</span></td></tr>
        <tr><td style="background:${C.card};border:1px solid ${C.line};border-top:6px solid ${C.accent};border-radius:16px;padding:34px 30px">
          <div style="${font};font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${C.accentText}">${esc(e.eyebrow)}</div>
          <h1 style="${font};margin:14px 0 0;font-size:28px;line-height:1.25;font-weight:700;color:#ffffff">${esc(e.title)}</h1>
          <p style="${font};margin:14px 0 26px;font-size:16px;line-height:1.5;color:${C.soft}">${esc(e.intro)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          <div style="${font};margin:30px 0 12px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted}">${esc(e.messageLabel)}</div>
          <div style="${font};background:${C.box};border:1px solid ${C.line};border-left:4px solid ${C.accent};border-radius:12px;padding:20px 22px;font-size:17px;line-height:1.55;color:${C.text};white-space:pre-wrap">${esc(e.message)}</div>
          ${
            e.button
              ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:30px"><tr><td style="background:${C.accent};border-radius:12px">
              <a href="${esc(e.button.href)}" style="${font};display:inline-block;padding:15px 26px;font-size:16px;font-weight:700;color:#06130d;text-decoration:none">${esc(e.button.label)}</a>
            </td></tr></table>`
              : ''
          }
        </td></tr>
        <tr><td style="${font};padding:18px 8px 0;font-size:12px;line-height:1.5;color:${C.muted}">Automatsko obaveštenje sa sajta parkingrampe.rs. Kliknite „Odgovori“ da odgovorite pošiljaocu.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = [
    e.title,
    e.intro,
    '',
    ...e.rows.filter((r) => r.value).map((r) => `${r.label}: ${r.value}`),
    '',
    `${e.messageLabel}:`,
    e.message,
    ...(e.button ? ['', `${e.button.label}: ${e.button.href}`] : []),
  ].join('\n')

  return { html, text }
}
