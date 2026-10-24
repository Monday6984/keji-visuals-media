import { describe, expect, it } from 'vitest'

import { aspectRatio, fallbackSrc, focalPosition, photoSources, srcSet } from '@/lib/photo'

const size = (width: number) => ({ url: `https://media.example/p-${width}.webp`, width, height: width })

describe('photo sources', () => {
  it('uses generated sizes narrowest first and never the original', () => {
    const sources = photoSources({
      url: 'https://media.example/original.jpg',
      width: 3000,
      sizes: { xl: size(2400), sm: size(640), md: size(1024), lg: size(1600) },
    })
    expect(sources.map((s) => s.width)).toEqual([640, 1024, 1600, 2400])
    expect(srcSet(sources)).not.toContain('original')
    expect(fallbackSrc(sources)).toBe('https://media.example/p-1024.webp')
  })

  it('skips sizes that were not generated (narrow uploads)', () => {
    const sources = photoSources({
      url: 'https://media.example/original.jpg',
      width: 1080,
      sizes: { sm: size(640), md: size(1024), lg: { url: null, width: null }, xl: {} },
    })
    expect(sources.map((s) => s.width)).toEqual([640, 1024])
  })

  it('falls back to the original only when there are no sizes at all', () => {
    expect(photoSources({ url: 'https://media.example/tiny.jpg', width: 400, sizes: {} })).toEqual([
      { url: 'https://media.example/tiny.jpg', width: 400 },
    ])
    expect(photoSources({ url: null, width: null, sizes: {} })).toEqual([])
  })

  it('derives aspect ratio and focal position with sensible defaults', () => {
    expect(aspectRatio({ width: 3000, height: 4000 })).toBe(0.75)
    expect(aspectRatio({ width: null, height: null })).toBe(0.8)
    expect(focalPosition({ focalX: 30, focalY: 70 })).toBe('30% 70%')
    expect(focalPosition({ focalX: null, focalY: null })).toBe('50% 50%')
  })
})
