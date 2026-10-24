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
