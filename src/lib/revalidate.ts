import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

// Cache tags shared by the data layer (src/lib/data.ts) and these hooks: pages are static
// and Payload edits invalidate exactly the tags they affect.
export const collectionTag = (slug: string) => `collection:${slug}`
export const globalTag = (slug: string) => `global:${slug}`

const safeRevalidate = (tag: string) => {
  try {
    revalidateTag(tag, 'max')
  } catch {
    // Outside a Next.js request (migrations, seed scripts, tests) there is no cache to clear.
  }
}

export const revalidateCollectionAfterChange: CollectionAfterChangeHook = ({ collection, doc }) => {
  safeRevalidate(collectionTag(collection.slug))
  return doc
}

export const revalidateCollectionAfterDelete: CollectionAfterDeleteHook = ({ collection, doc }) => {
  safeRevalidate(collectionTag(collection.slug))
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ global, doc }) => {
  safeRevalidate(globalTag(global.slug))
  return doc
}

/** Hooks to add to every public collection. */
export const revalidateHooks = {
  afterChange: [revalidateCollectionAfterChange],
  afterDelete: [revalidateCollectionAfterDelete],
}
