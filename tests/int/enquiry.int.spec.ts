import { describe, expect, it } from 'vitest'

import { escapeHTML, parseFrom, validateEnquiry } from '@/lib/enquiry'

const form = (fields: Record<string, string>) => {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

const valid = { names: 'Ada & Tunde', email: 'ada@example.com', shootType: 'traditional-white' }

describe('validateEnquiry', () => {
  it('accepts a minimal valid enquiry and trims values', () => {
    const { data, errors } = validateEnquiry(form({ ...valid, names: '  Ada & Tunde  ', location: ' ' }))
    expect(errors).toEqual({})
    expect(data).toMatchObject({ names: 'Ada & Tunde', email: 'ada@example.com', shootType: 'traditional-white' })
    expect(data?.location).toBeUndefined()
  })

  it('reports each missing or invalid field', () => {
    const { data, errors } = validateEnquiry(form({ names: '', email: 'not-an-email', shootType: 'skydiving' }))
    expect(data).toBeUndefined()
    expect(Object.keys(errors).sort()).toEqual(['email', 'names', 'shootType'])
  })

  it('checks optional fields only when filled', () => {
    expect(validateEnquiry(form({ ...valid, phone: '+234 903 491 7020', date: '2027-03-14' })).errors).toEqual({})
    const { errors } = validateEnquiry(form({ ...valid, phone: 'call me', date: '14/03/2027', message: 'x'.repeat(5001) }))
    expect(Object.keys(errors).sort()).toEqual(['date', 'message', 'phone'])
  })
})

describe('email helpers', () => {
  it('escapes user input for the notification email', () => {
    expect(escapeHTML(`<script>alert("x")</script> & 'y'`)).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;')
  })

  it('parses EMAIL_FROM', () => {
    expect(parseFrom('Keji Visuals <onboarding@resend.dev>')).toEqual({ name: 'Keji Visuals', address: 'onboarding@resend.dev' })
    expect(parseFrom('hello@kejivisuals.com')).toEqual({ name: 'Keji Visuals', address: 'hello@kejivisuals.com' })
    expect(parseFrom(undefined).address).toBe('onboarding@resend.dev')
  })
})
