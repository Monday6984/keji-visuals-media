import type { CSSProperties } from 'react'
import { preload } from 'react-dom'

import type { Media } from '@/payload-types'
import { aspectRatio, fallbackSrc, focalPosition, photoSources, srcSet } from '@/lib/photo'

type Props = {
  media: Media | number | null | undefined
  /** The `sizes` attribute: how wide the photo is shown, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes: string
  /** Hero / first-row photos: load immediately with high priority. Everything else is lazy. */
  priority?: boolean
  /** Fill the parent box (which sets the shape), cropping around the focal point. */
  fill?: boolean
  className?: string
  alt?: string
}

// Serves the pre-generated WebP sizes straight from R2 (no Vercel image optimisation).
// Width/height reserve the space and the blur placeholder shows until the photo loads.
export function Photo({ media, sizes, priority = false, fill = false, className = '', alt }: Props) {
  if (!media || typeof media === 'number') return null
  const sources = photoSources(media)
  if (!sources.length) return null

  // Priority photos (usually the LCP) are preloaded in <head>, so the download starts
  // before the browser reaches the <img> in the markup.
  if (priority) {
    preload(fallbackSrc(sources)!, { as: 'image', imageSrcSet: srcSet(sources), imageSizes: sizes, fetchPriority: 'high' })
  }

  const style: CSSProperties = {
    backgroundImage: media.blurDataURL ? `url(${media.blurDataURL})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: focalPosition(media),
    ...(fill
      ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: focalPosition(media) }
      : { aspectRatio: aspectRatio(media), width: '100%', height: 'auto' }),
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional: pre-generated sizes, no Vercel optimisation
    <img
      src={fallbackSrc(sources)}
      srcSet={srcSet(sources)}
      sizes={sizes}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      alt={alt ?? media.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`block ${className}`}
      style={style}
    />
  )
}
