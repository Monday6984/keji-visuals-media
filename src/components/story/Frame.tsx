import type { CSSProperties } from 'react'

import { Photo } from '@/components/Photo'
import { frameNo } from '@/lib/format'
import { photoSources, srcSet } from '@/lib/photo'
import type { Media } from '@/payload-types'

type Props = {
  media: Media
  n: number
  chapter: string
  sizes: string
  priority?: boolean
  /** Fill a fixed-shape box (hero opener) instead of the photo's own aspect ratio. */
  fill?: boolean
  className?: string
  style?: CSSProperties
}

// One photo in a story: links to its largest generated size (never the original) and
// carries the data PhotoSwipe needs, plus the contact-sheet caption.
export function Frame({ media, n, chapter, sizes, priority, fill, className = '', style }: Props) {
  const sources = photoSources(media)
  const largest = sources[sources.length - 1]
  if (!largest || !media.width || !media.height) return null

  const caption = `No. ${frameNo(n)} · ${media.caption || chapter}`
  // Dimensions of the largest size we link to, keeping the original's proportions.
  const w = largest.width
  const h = Math.round((media.height / media.width) * largest.width)

  return (
    <figure className={`m-0 min-w-0 ${className}`} style={style}>
      <a
        href={largest.url}
        data-pswp-width={w}
        data-pswp-height={h}
        data-pswp-srcset={srcSet(sources)}
        data-caption={caption}
        className={`group block cursor-zoom-in overflow-hidden rounded-[2px] focus-visible:outline-3 focus-visible:outline-offset-3 ${fill ? 'relative size-full' : ''}`}
      >
        <Photo
          media={media}
          sizes={sizes}
          priority={priority}
          fill={fill}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
        />
        <span className="sr-only">Open {caption} full screen</span>
      </a>
      <figcaption className="cap mt-2 text-muted" aria-hidden="true">
        No. {frameNo(n)}
      </figcaption>
    </figure>
  )
}
