// Pure helpers shared by collection fields. Kept free of Payload imports so they are easy to test.

export const slugify = (input: string): string =>
  input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const EMBED_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
  'player.vimeo.com',
])

/** True for https YouTube or Vimeo links; we only ever embed from these two hosts. */
export const isEmbedURL = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && EMBED_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

/** WhatsApp click-to-chat numbers: country code and number, digits only (e.g. 2349034917020). */
export const isWhatsAppNumber = (value: string): boolean => /^[1-9]\d{9,14}$/.test(value)

export type PriceDisplay = 'exact' | 'from' | 'enquire'

/** A naira price is required unless the package is shown as "price on enquiry". */
export const needsNairaPrice = (display: PriceDisplay | undefined, value: unknown): boolean =>
  display !== 'enquire' && !(typeof value === 'number' && Number.isFinite(value) && value >= 0)

type Ref = number | string | { id: number | string } | null | undefined

const refID = (ref: Ref) => (ref && typeof ref === 'object' ? ref.id : ref)

/** Returns the breathers that are not among the chapter's images. */
export const breathersOutsideImages = (breathers: Ref[] = [], images: Ref[] = []): Ref[] => {
  const ids = new Set(images.map(refID).map(String))
  return breathers.filter((b) => !ids.has(String(refID(b))))
}
