import { describe, expect, it } from 'vitest'

import { type AboutChapter, layoutAbout, placesToShow, publishedChapters, splitOlive } from '@/lib/about'
import type { Media } from '@/payload-types'

const m = (id: number) => ({ id, alt: `photo ${id}` }) as Media

const chapter = (frameNumber: string, extra: Partial<AboutChapter> = {}): AboutChapter => ({
  frameNumber,
  title: `Chapter ${frameNumber}`,
  slug: `chapter-${frameNumber}`,
  layout: 'text',
  published: true,
  ...extra,
})

describe('splitOlive', () => {
  it('splits around the olive phrase', () => {
    expect(splitOlive('Behind the lens', 'lens')).toEqual(['Behind the ', 'lens', ''])
  })
  it('returns the whole text when the phrase is missing or absent', () => {
    expect(splitOlive('Behind the lens', 'camera')).toEqual(['Behind the lens', '', ''])
    expect(splitOlive('Behind the lens', null)).toEqual(['Behind the lens', '', ''])
  })
})

describe('publishedChapters', () => {
  it('drops unpublished chapters and keeps the order', () => {
    const list = [chapter('01'), chapter('06', { published: false }), chapter('02')]
    expect(publishedChapters(list).map((c) => c.frameNumber)).toEqual(['01', '02'])
  })
})

describe('layoutAbout', () => {
  it('places reels after their chapter and numbers photos in reading order', () => {
    const { heroNumber, blocks, closingNumber } = layoutAbout({
      hero: { image: m(1) },
      chapters: [
        chapter('01', { layout: 'image-right', image: m(2) }),
        chapter('02'),
        chapter('05', { layout: 'diptych', image: m(3), image2: m(4) }),
      ],
      reels: [{ label: 'Reel 01', afterFrame: '02', frames: [{ image: m(10) }, { image: m(11) }] }],
      closing: { image: m(5) },
    })

    expect(heroNumber).toBe(1)
    expect(blocks.map((b) => (b.kind === 'chapter' ? b.chapter.frameNumber : 'reel'))).toEqual(['01', '02', 'reel', '05'])
    expect(blocks.map((b) => (b.kind === 'chapter' ? b.numbers : b.frames.map((f) => f.number)))).toEqual([[2], [], [3, 4], [5, 6]])
    expect(closingNumber).toBe(7)
  })

  it('hides reels placed after an unpublished chapter', () => {
    const { blocks } = layoutAbout({
      chapters: [chapter('01'), chapter('07', { published: false })],
      reels: [{ label: 'Behind the scenes', afterFrame: '07', frames: [{ image: m(9) }] }],
    })
    expect(blocks.filter((b) => b.kind === 'reel')).toHaveLength(0)
  })

  it('ignores an image-layout chapter whose image is missing', () => {
    const { blocks } = layoutAbout({ chapters: [chapter('03', { layout: 'image-left', image: null })] })
    expect(blocks[0]).toMatchObject({ kind: 'chapter', numbers: [] })
  })
})

describe('placesToShow', () => {
  it('needs at least two places', () => {
    expect(placesToShow([{ name: 'Lagos' }])).toEqual([])
    expect(placesToShow([{ name: 'Lagos' }, { name: ' Ibadan ' }])).toEqual(['Lagos', 'Ibadan'])
  })
})
