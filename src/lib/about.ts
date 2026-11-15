import type { About, Media } from '@/payload-types'

// Pure helpers for the About page: which chapters show, where reels go, and the
// contact-sheet numbering ("No. 001"…) that runs through the page in reading order.

export type AboutChapter = NonNullable<About['chapters']>[number]
export type AboutReel = NonNullable<About['reels']>[number]

export const isMedia = (m: unknown): m is Media => Boolean(m && typeof m === 'object' && 'id' in m)

/** Splits text around its olive phrase: ["Behind the ", "lens", ""]. No match → whole text first. */
export const splitOlive = (text: string, olive?: string | null): [string, string, string] => {
  const i = olive ? text.indexOf(olive) : -1
  return i < 0 || !olive ? [text, '', ''] : [text.slice(0, i), olive, text.slice(i + olive.length)]
}

/** Published chapters only, in order. Unpublished ones are drafts and never render. */
export const publishedChapters = (chapters: About['chapters']): AboutChapter[] =>
  (chapters ?? []).filter((c) => c.published !== false)

/** The chapter's photos, as its layout shows them. */
export const chapterImages = (c: AboutChapter): { media: Media; caption: string | null }[] => {
  if (c.layout === 'text') return []
  const list = [{ media: c.image, caption: c.caption ?? null }]
  if (c.layout === 'diptych') list.push({ media: c.image2, caption: c.caption2 ?? null })
  return list.flatMap((i) => (isMedia(i.media) ? [{ media: i.media, caption: i.caption }] : []))
}

export type AboutBlock =
  | { kind: 'chapter'; chapter: AboutChapter; numbers: number[] }
  | { kind: 'reel'; reel: AboutReel; frames: { media: Media; caption: string | null; number: number }[] }

/**
 * Orders the page body: each published chapter, followed by any reels placed after its
 * frame number (reels after an unpublished chapter stay hidden with it). Photo numbers
 * count up from the hero through the chapters, reels and closing image.
 */
export const layoutAbout = (about: Pick<About, 'hero' | 'chapters' | 'reels' | 'closing'>) => {
  let n = 0
  const next = () => ++n
  const heroNumber = isMedia(about.hero?.image) ? next() : null

  const blocks: AboutBlock[] = []
  for (const chapter of publishedChapters(about.chapters)) {
    blocks.push({ kind: 'chapter', chapter, numbers: chapterImages(chapter).map(() => next()) })
    for (const reel of (about.reels ?? []).filter((r) => r.afterFrame === chapter.frameNumber)) {
      const frames = (reel.frames ?? []).flatMap((f) =>
        isMedia(f.image) ? [{ media: f.image, caption: f.caption ?? null, number: next() }] : [],
      )
      if (frames.length) blocks.push({ kind: 'reel', reel, frames })
    }
  }

  const closingNumber = isMedia(about.closing?.image) ? next() : null
  return { heroNumber, blocks, closingNumber }
}

/** The places line only appears once there's more than one place to list. */
export const placesToShow = (places: About['places']) => {
  const names = (places ?? []).map((p) => p.name.trim()).filter(Boolean)
  return names.length >= 2 ? names : []
}
