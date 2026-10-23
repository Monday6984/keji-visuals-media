// @vitest-environment node
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import type { Story } from '@/payload-types'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Runs against the configured database (Neon). Everything created here is tagged with
// TAG and deleted in afterAll.
const TAG = `vitest-${Date.now()}`

let payload: Payload
let mediaID: number
let otherMediaID: number
let categoryID: number

// Payload puts each field's own validation message in error.data.errors.
const rejectsWith = async (promise: Promise<unknown>, message: string) => {
  const err = await promise.then(
    () => undefined,
    (e: unknown) => e,
  )
  expect(err, 'expected the save to be rejected').toBeDefined()
  expect(JSON.stringify((err as { data?: unknown }).data ?? err)).toContain(message)
}
const created: { collection: 'stories' | 'packages' | 'testimonials' | 'enquiries'; id: number }[] = []

const track = <T extends { id: number }>(collection: (typeof created)[number]['collection'], doc: T) => {
  created.push({ collection, id: doc.id })
  return doc
}

describe('content model: public visibility and validation', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const media = await payload.find({ collection: 'media', limit: 2 })
    if (media.docs.length < 2) throw new Error('needs at least two Media documents')
    mediaID = media.docs[0].id
    otherMediaID = media.docs[1].id
    const weddings = await payload.find({ collection: 'categories', where: { slug: { equals: 'weddings' } } })
    categoryID = weddings.docs[0].id
  })

  afterAll(async () => {
    for (const { collection, id } of created.reverse()) {
      await payload.delete({ collection, id }).catch(() => undefined)
    }
    // Sweep anything tagged that an unexpectedly successful save may have left behind.
    await payload.delete({ collection: 'stories', where: { title: { like: 'vitest-' } } })
    await payload.delete({ collection: 'packages', where: { name: { like: 'vitest-' } } })
    await payload.delete({ collection: 'testimonials', where: { names: { like: 'vitest-' } } })
    await payload.delete({ collection: 'enquiries', where: { names: { like: 'vitest-' } } })
  })

  let storyCount = 0
  // Blank slugs are generated from the title by the slug field's hook.
  const story = (extra: Partial<Story> = {}): Omit<Story, 'id' | 'createdAt' | 'updatedAt'> => ({
    title: `${TAG} story ${++storyCount}`,
    slug: '',
    category: categoryID,
    cover: mediaID,
    chapters: [{ title: 'Getting ready', slug: '', images: [mediaID] }],
    ...extra,
  })

  it('hides draft stories from the public', async () => {
    const draft = track('stories', await payload.create({ collection: 'stories', data: story(), draft: true }))
    expect(draft.slug).toBe(`${TAG}-story-1`)
    expect(draft.chapters[0].slug).toBe('getting-ready')

    const publicRead = await payload.find({
      collection: 'stories',
      where: { id: { equals: draft.id } },
      overrideAccess: false,
    })
    expect(publicRead.totalDocs).toBe(0)

    await payload.update({ collection: 'stories', id: draft.id, data: { _status: 'published' } })
    const afterPublish = await payload.find({
      collection: 'stories',
      where: { id: { equals: draft.id } },
      overrideAccess: false,
    })
    expect(afterPublish.totalDocs).toBe(1)
  })

  // Payload skips field validation for drafts (Keji can save work in progress); the
  // checks apply when a story is published.
  it('on publish, rejects breathers outside the chapter and non-YouTube/Vimeo films', async () => {
    await rejectsWith(
      payload.create({
        collection: 'stories',
        data: story({
          _status: 'published',
          chapters: [{ title: 'Portraits', slug: '', images: [mediaID], breathers: [otherMediaID] }],
        }),
      }),
      'Full-width photos must also be in this chapter',
    )

    await rejectsWith(
      payload.create({
        collection: 'stories',
        data: story({ _status: 'published', filmUrl: 'https://example.com/film' }),
      }),
      'Use a YouTube or Vimeo link',
    )
  })

  it('requires a naira price unless priced on enquiry, and hides invisible packages', async () => {
    const base = { name: `${TAG} package`, category: categoryID }
    await rejectsWith(
      payload.create({ collection: 'packages', data: { ...base, priceDisplay: 'from' } }),
      'Enter a naira price',
    )

    const hidden = track(
      'packages',
      await payload.create({ collection: 'packages', data: { ...base, priceDisplay: 'enquire', visible: false } }),
    )
    const publicRead = await payload.find({
      collection: 'packages',
      where: { id: { equals: hidden.id } },
      overrideAccess: false,
    })
    expect(publicRead.totalDocs).toBe(0)
  })

  it('only shows testimonials with consent', async () => {
    const t = track(
      'testimonials',
      await payload.create({ collection: 'testimonials', data: { names: `${TAG} couple`, quote: 'Lovely.' } }),
    )
    const publicRead = await payload.find({
      collection: 'testimonials',
      where: { id: { equals: t.id } },
      overrideAccess: false,
    })
    expect(publicRead.totalDocs).toBe(0)
  })

  it('blocks public enquiry creation; the server endpoint path (overrideAccess) works', async () => {
    const data = { names: `${TAG} enquiry`, email: 'test@example.com', shootType: 'event' as const, status: 'new' as const }
    await expect(payload.create({ collection: 'enquiries', data, overrideAccess: false })).rejects.toThrow(
      /not allowed/i,
    )

    const e = track('enquiries', await payload.create({ collection: 'enquiries', data }))
    expect(e.status).toBe('new')
  })
})
