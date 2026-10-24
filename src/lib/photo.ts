import type { Media } from '@/payload-types'

export type PhotoSource = { url: string; width: number }

/**
 * The pre-generated WebP sizes of a photo, narrowest first. Originals are never served,
 * except for uploads too small to have any sizes (they are already small).
 */
export const photoSources = (media: Pick<Media, 'sizes' | 'url' | 'width'>): PhotoSource[] => {
  const sizes = Object.values(media.sizes ?? {})
    .filter((s): s is { url: string; width: number } => Boolean(s?.url && s.width))
    .map(({ url, width }) => ({ url, width }))
    .sort((a, b) => a.width - b.width)

  if (sizes.length) return sizes
  return media.url && media.width ? [{ url: media.url, width: media.width }] : []
}

export const srcSet = (sources: PhotoSource[]) => sources.map((s) => `${s.url} ${s.width}w`).join(', ')

/** Fallback `src` for browsers without srcset support: the first size at least 1024 wide. */
export const fallbackSrc = (sources: PhotoSource[]) =>
  (sources.find((s) => s.width >= 1024) ?? sources[sources.length - 1])?.url

/** Width ÷ height, defaulting to portrait 4:5 (Keji's usual crop) when unknown. */
export const aspectRatio = (media: Pick<Media, 'width' | 'height'>) =>
  media.width && media.height ? media.width / media.height : 0.8

/** CSS object-position from the focal point set in the admin (defaults to centre). */
export const focalPosition = (media: Pick<Media, 'focalX' | 'focalY'>) =>
  `${media.focalX ?? 50}% ${media.focalY ?? 50}%`
