import { describe, expect, it } from 'vitest'

import { toEmbed } from '@/lib/embed'
import { buildRows } from '@/lib/rows'

const p = (n: number) => Array.from({ length: n }, () => ({ ar: 0.8 }))
const counts = (rows: ReturnType<typeof buildRows>) => rows.map((r) => (r.breather ? 'B' : r.items.length))

describe('buildRows', () => {
  it('puts three portraits per row', () => {
    expect(counts(buildRows(p(9)))).toEqual([3, 3, 3])
  })

  it('gives breathers their own row and closes the row before them', () => {
    const items = [...p(2), { ar: 2.33, breather: true }, ...p(3)]
    expect(counts(buildRows(items))).toEqual([2, 'B', 3])
  })

  it('merges a single leftover portrait into the previous row', () => {
    expect(counts(buildRows(p(4)))).toEqual([4])
  })

  it('keeps a short last row at normal height with a spacer', () => {
    const rows = buildRows(p(5))
    expect(counts(rows)).toEqual([3, 2])
    expect(rows[1].spacer).toBeCloseTo(0.8)
  })

  it('lets a wide photo fill a row on its own', () => {
    expect(counts(buildRows([{ ar: 2.4 }, ...p(3)]))).toEqual([1, 3])
  })
})

describe('toEmbed', () => {
  it('handles the usual YouTube link shapes', () => {
    for (const link of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=10',
      'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    ]) {
      expect(toEmbed(link)?.src).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&playsinline=1')
    }
  })

  it('handles Vimeo links', () => {
    expect(toEmbed('https://vimeo.com/76979871')?.src).toBe('https://player.vimeo.com/video/76979871?autoplay=1&dnt=1')
    expect(toEmbed('https://player.vimeo.com/video/76979871')?.id).toBe('76979871')
  })

  it('rejects anything else', () => {
    expect(toEmbed('https://example.com/watch?v=abc')).toBeNull()
    expect(toEmbed('not a url')).toBeNull()
    expect(toEmbed(null)).toBeNull()
  })
})
