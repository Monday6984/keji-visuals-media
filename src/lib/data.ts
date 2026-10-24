import 'server-only'

import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { collectionTag, globalTag } from './revalidate'

// Public reads only: overrideAccess is false so drafts, hidden packages, unconsented
// testimonials and admin-only fields (e.g. the enquiry recipient) never reach a page.

export const getPayloadClient = () => getPayload({ config })

const STORY_TAGS = [collectionTag('stories'), collectionTag('categories'), collectionTag('media')]

/** A published story by slug, with category, cover and chapter photos populated. */
export const getStory = unstable_cache(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'stories',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
      overrideAccess: false,
    })
    return docs[0] ?? null
  },
  ['story'],
  { tags: STORY_TAGS },
)

/** Published stories, optionally in one category, in display order (covers populated). */
export const getStories = unstable_cache(
  async (categoryID?: number) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'stories',
      where: categoryID ? { category: { equals: categoryID } } : {},
      sort: ['order', '-date'],
      depth: 1,
      limit: 200,
      overrideAccess: false,
      select: { title: true, slug: true, category: true, cover: true, excerpt: true, date: true, location: true, featured: true },
    })
    return docs
  },
  ['stories'],
  { tags: STORY_TAGS },
)

/** Categories in display order (covers populated). */
export const getCategories = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'categories', sort: 'order', depth: 1, limit: 50, overrideAccess: false })
    return docs
  },
  ['categories'],
  { tags: [collectionTag('categories'), collectionTag('media')] },
)

/** Number of published films (shown as the Films category's count). */
export const getFilmCount = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return (await payload.count({ collection: 'films', overrideAccess: false })).totalDocs
  },
  ['film-count'],
  { tags: [collectionTag('films')] },
)

export const getSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: false })
  },
  ['site-settings'],
  {
    tags: [
      globalTag('site-settings'),
      collectionTag('media'),
      collectionTag('packages'),
      collectionTag('testimonials'),
    ],
  },
)
