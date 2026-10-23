import { describe, expect, it } from 'vitest'

import { isAdminUser, publishedOrLoggedIn, whereOrLoggedIn } from '@/access'
import {
  breathersOutsideImages,
  isEmbedURL,
  isWhatsAppNumber,
  needsNairaPrice,
  slugify,
} from '@/lib/validation'

describe('slugify', () => {
  it('makes readable URL slugs', () => {
    expect(slugify('Tolu & Femi — Wedding, Ibadan')).toBe('tolu-and-femi-wedding-ibadan')
    expect(slugify('  Pre-Weddings  ')).toBe('pre-weddings')
    expect(slugify('Adébáyọ̀')).toBe('adebayo')
  })
})

describe('isEmbedURL', () => {
  it('accepts https YouTube and Vimeo links', () => {
    expect(isEmbedURL('https://www.youtube.com/watch?v=abc123')).toBe(true)
    expect(isEmbedURL('https://youtu.be/abc123')).toBe(true)
    expect(isEmbedURL('https://vimeo.com/123456')).toBe(true)
  })

  it('rejects other hosts, http and junk', () => {
    expect(isEmbedURL('http://www.youtube.com/watch?v=abc123')).toBe(false)
    expect(isEmbedURL('https://youtube.com.evil.example/watch')).toBe(false)
    expect(isEmbedURL('javascript:alert(1)')).toBe(false)
    expect(isEmbedURL('not a url')).toBe(false)
  })
})

describe('isWhatsAppNumber', () => {
  it('needs country code and digits only', () => {
    expect(isWhatsAppNumber('2349034917020')).toBe(true)
    expect(isWhatsAppNumber('+2349034917020')).toBe(false)
    expect(isWhatsAppNumber('09034917020')).toBe(false)
    expect(isWhatsAppNumber('234 903 491 7020')).toBe(false)
  })
})

describe('needsNairaPrice', () => {
  it('requires a naira price unless priced on enquiry', () => {
    expect(needsNairaPrice('from', undefined)).toBe(true)
    expect(needsNairaPrice('exact', -1)).toBe(true)
    expect(needsNairaPrice('exact', 450000)).toBe(false)
    expect(needsNairaPrice('enquire', undefined)).toBe(false)
  })
})

describe('breathersOutsideImages', () => {
  it('finds breathers that are not in the chapter, by id or populated doc', () => {
    expect(breathersOutsideImages([2, { id: 3 }], [1, 2, { id: 3 }])).toEqual([])
    expect(breathersOutsideImages([4], [1, 2])).toEqual([4])
    expect(breathersOutsideImages(undefined, [1])).toEqual([])
  })
})

describe('access', () => {
  const req = (user: unknown) => ({ req: { user } }) as unknown as Parameters<typeof publishedOrLoggedIn>[0]

  it('shows the public only published documents', () => {
    expect(publishedOrLoggedIn(req(null))).toEqual({ _status: { equals: 'published' } })
    expect(publishedOrLoggedIn(req({ id: 1, role: 'editor' }))).toBe(true)
  })

  it('filters checkbox-controlled collections for the public', () => {
    expect(whereOrLoggedIn('consent')(req(null))).toEqual({ consent: { equals: true } })
    expect(whereOrLoggedIn('visible')(req({ id: 1 }))).toBe(true)
  })

  it('recognises admins only by role', () => {
    expect(isAdminUser({ role: 'admin' })).toBe(true)
    expect(isAdminUser({ role: 'editor' })).toBe(false)
    expect(isAdminUser(null)).toBe(false)
  })
})
