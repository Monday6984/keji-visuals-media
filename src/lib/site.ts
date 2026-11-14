// Site-wide navigation and contact helpers.

export const NAV = [
  { href: '/portfolio', label: 'Work' },
  { href: '/films', label: 'Films' },
  { href: '/packages', label: 'Packages' },
  { href: '/about', label: 'About' },
] as const

export const BOOK_HREF = '/contact'

// The Films category page redirects to /films (the Films collection); stories can't be
// filed under it.
export const FILMS_CATEGORY_SLUG = 'films'

/** WhatsApp click-to-chat link; `number` is digits only with country code. */
export const whatsappHref = (number?: string | null, message?: string) => {
  if (!number) return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${text}`
}

/** "2349034917020" → "+234 903 491 7020" (Nigerian numbers); other numbers just get a "+". */
export const formatIntlNumber = (digits?: string | null) => {
  if (!digits) return null
  const m = digits.match(/^234(\d{3})(\d{3})(\d{4})$/)
  return m ? `+234 ${m[1]} ${m[2]} ${m[3]}` : `+${digits}`
}

/** tel: link from a displayed number such as "+234 915 510 8428" or "0915 510 8428". */
export const telHref = (display?: string | null) => {
  if (!display) return null
  const digits = display.replace(/[^\d+]/g, '')
  return `tel:${digits.startsWith('0') ? `+234${digits.slice(1)}` : digits}`
}
