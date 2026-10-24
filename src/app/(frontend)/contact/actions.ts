'use server'

import { createHash } from 'crypto'
import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/data'
import { escapeHTML, SHOOT_TYPES, validateEnquiry, type FieldErrors } from '@/lib/enquiry'

export type EnquiryState =
  | { status: 'idle' }
  | { status: 'success'; emailed: boolean }
  // `values` echoes what was typed: React resets the form after every action, so the form
  // uses these as its defaults and nothing the visitor typed is lost.
  | { status: 'error'; message: string; fieldErrors?: FieldErrors; values: Record<string, string> }

const FIELDS = ['names', 'email', 'phone', 'shootType', 'date', 'location', 'package', 'message'] as const
const submittedValues = (form: FormData) =>
  Object.fromEntries(FIELDS.map((k) => [k, String(form.get(k) ?? '').slice(0, 5000)]))

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_PER_WINDOW = 5
const MIN_FILL_MS = 3000 // humans take longer than this to fill the form

const GENERIC_ERROR = 'Sorry, something went wrong sending your enquiry. Please try again, or message us on WhatsApp.'

/** Returns false when this visitor has sent too many enquiries in the last hour. */
async function withinRateLimit() {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  const key = createHash('sha256').update(`${ip}|${process.env.PAYLOAD_SECRET}`).digest('hex').slice(0, 40)
  const payload = await getPayloadClient()
  const now = Date.now()

  await payload.delete({ collection: 'rate-limits', where: { windowStart: { less_than: new Date(now - WINDOW_MS).toISOString() } } })
  const { docs } = await payload.find({ collection: 'rate-limits', where: { key: { equals: key } }, limit: 1 })
  const row = docs[0]
  if (row && row.count >= MAX_PER_WINDOW) return false
  if (row) await payload.update({ collection: 'rate-limits', id: row.id, data: { count: row.count + 1 } })
  else await payload.create({ collection: 'rate-limits', data: { key, count: 1, windowStart: new Date(now).toISOString() } })
  return true
}

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Spam traps: a hidden field people never fill, and a minimum time on the form. Bots get
  // a normal-looking success so they don't retry.
  const startedAt = Number(form.get('startedAt'))
  if (form.get('website') || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: 'success', emailed: false }
  }

  const { data, errors } = validateEnquiry(form)
  if (!data) return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors: errors, values: submittedValues(form) }

  try {
    if (!(await withinRateLimit())) {
      return {
        status: 'error',
        message: 'You’ve sent several enquiries in a short time. Please wait a while, or message us on WhatsApp.',
        values: submittedValues(form),
      }
    }

    const payload = await getPayloadClient()
    const enquiry = await payload.create({ collection: 'enquiries', data: { ...data, status: 'new' } })

    // Email the studio. The enquiry is already saved, so a failed email is logged, not shown.
    let emailed = false
    try {
      const settings = await payload.findGlobal({ slug: 'site-settings' })
      const to = settings.enquiryRecipient || settings.email
      if (to && process.env.RESEND_API_KEY) {
        const type = SHOOT_TYPES.find((t) => t.value === data.shootType)?.label ?? data.shootType
        const rows: [string, string | undefined][] = [
          ['Names', data.names],
          ['Email', data.email],
          ['Phone / WhatsApp', data.phone],
          ['Type of shoot', type],
          ['Date', data.date],
          ['Location', data.location],
          ['Package', data.package],
          ['Message', data.message],
        ]
        const filled = rows.filter(([, v]) => v)
        await payload.sendEmail({
          to,
          replyTo: data.email,
          subject: `New enquiry: ${data.names} — ${type}${data.date ? ` (${data.date})` : ''}`,
          text: `${filled.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nOpen in the admin: ${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/collections/enquiries/${enquiry.id}`,
          html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${filled
            .map(([k, v]) => `<tr><th align="left" valign="top">${k}</th><td style="white-space:pre-wrap">${escapeHTML(v!)}</td></tr>`)
            .join('')}</table><p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/collections/enquiries/${enquiry.id}">Open in the admin</a></p>`,
        })
        emailed = true
      }
    } catch (err) {
      payload.logger.error({ err, msg: `enquiry ${enquiry.id}: notification email failed` })
    }

    return { status: 'success', emailed }
  } catch (err) {
    const payload = await getPayloadClient()
    payload.logger.error({ err, msg: 'enquiry: could not save' })
    return { status: 'error', message: GENERIC_ERROR, values: submittedValues(form) }
  }
}
