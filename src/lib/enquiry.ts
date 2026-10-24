// Enquiry form validation (server-side source of truth; the form mirrors it for UX).

export const SHOOT_TYPES = [
  { label: 'Traditional wedding', value: 'traditional' },
  { label: 'White wedding', value: 'white' },
  { label: 'Traditional + white', value: 'traditional-white' },
  { label: 'Pre-wedding', value: 'pre-wedding' },
  { label: 'Event', value: 'event' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Film', value: 'film' },
] as const
export type ShootType = (typeof SHOOT_TYPES)[number]['value']
const SHOOT_TYPE_VALUES: readonly string[] = SHOOT_TYPES.map((t) => t.value)

/** Category slug (from "Book a similar session" / package links) → default shoot type. */
export const shootTypeForCategory: Record<string, ShootType> = {
  weddings: 'traditional-white',
  'pre-weddings': 'pre-wedding',
  events: 'event',
  portraits: 'portrait',
  films: 'film',
}

export type EnquiryInput = {
  names: string
  email: string
  phone?: string
  shootType: ShootType
  date?: string
  location?: string
  package?: string
  message?: string
}

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>

const LIMITS = { names: 200, phone: 40, location: 200, package: 200, message: 5000 } as const
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const text = (v: FormDataEntryValue | null | undefined) => (typeof v === 'string' ? v.trim() : '')

export function validateEnquiry(form: { get(name: string): FormDataEntryValue | null }): {
  data?: EnquiryInput
  errors: FieldErrors
} {
  const errors: FieldErrors = {}
  const names = text(form.get('names'))
  const email = text(form.get('email'))
  const phone = text(form.get('phone'))
  const shootType = text(form.get('shootType'))
  const date = text(form.get('date'))
  const location = text(form.get('location'))
  const pkg = text(form.get('package'))
  const message = text(form.get('message'))

  if (!names) errors.names = 'Please tell us your name(s).'
  else if (names.length > LIMITS.names) errors.names = 'Please keep this under 200 characters.'
  if (!email) errors.email = 'Please enter your email address.'
  else if (!EMAIL.test(email) || email.length > 254) errors.email = 'Please enter a valid email address, like name@example.com.'
  if (phone && (phone.length > LIMITS.phone || !/^[+\d\s().-]{6,}$/.test(phone)))
    errors.phone = 'Please enter a phone number using digits, spaces or +.'
  if (!SHOOT_TYPE_VALUES.includes(shootType)) errors.shootType = 'Please choose the type of shoot.'
  if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)))) errors.date = 'Please choose a valid date.'
  if (location.length > LIMITS.location) errors.location = 'Please keep this under 200 characters.'
  if (pkg.length > LIMITS.package) errors.package = 'Please keep this under 200 characters.'
  if (message.length > LIMITS.message) errors.message = 'Please keep your message under 5,000 characters.'

  if (Object.keys(errors).length) return { errors }
  return {
    errors,
    data: {
      names,
      email,
      phone: phone || undefined,
      shootType: shootType as ShootType,
      date: date || undefined,
      location: location || undefined,
      package: pkg || undefined,
      message: message || undefined,
    },
  }
}

/** Minimal HTML escaping for user input placed in the notification email. */
export const escapeHTML = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** "Keji Visuals <onboarding@resend.dev>" → { name, address }. */
export const parseFrom = (value: string | undefined) => {
  const match = value?.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  if (match) return { name: match[1] || 'Keji Visuals', address: match[2] }
  return { name: 'Keji Visuals', address: value?.trim() || 'onboarding@resend.dev' }
}
