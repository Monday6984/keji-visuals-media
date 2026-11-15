import type { ReactNode } from 'react'

import { Photo } from '@/components/Photo'
import { RichText } from '@/components/RichText'
import { type AboutChapter as Chapter, chapterImages } from '@/lib/about'
import { frameNo } from '@/lib/format'
import type { About, Media } from '@/payload-types'

import { Olive } from './Olive'

type Props = {
  chapter: Chapter
  numbers: number[]
  values: NonNullable<About['values']>
  timeline: NonNullable<About['timeline']>
  places: string[]
  /** Reels placed after this chapter. */
  children?: ReactNode
}

function Figure({ media, caption, number, sizes }: { media: Media; caption: string | null; number?: number; sizes: string }) {
  return (
    <figure className="m-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-paper">
        <Photo media={media} fill sizes={sizes} />
      </div>
      <figcaption className="cap mt-2.5 text-muted">
        {number != null && `No. ${frameNo(number)}`}
        {caption ? ` · ${caption}` : ''}
      </figcaption>
    </figure>
  )
}

// One "frame" of the About page: label row, optional pull quote, body, photos by layout,
// then an optional values list / timeline / places line.
export function AboutChapter({ chapter: c, numbers, values, timeline, places, children }: Props) {
  const images = chapterImages(c)
  const quote = c.pullQuote?.text ? (
    <p
      className={`m-0 mb-7 font-display text-ink ${
        c.pullQuote.size === 'large' ? 'text-[clamp(32px,4.2vw,60px)] leading-[1.06]' : 'text-[clamp(25px,2.7vw,38px)] leading-[1.28]'
      }`}
    >
      <Olive text={c.pullQuote.text} olive={c.pullQuote.olive} />
    </p>
  ) : null
  const body = c.body ? <RichText data={c.body} className="max-w-[680px] text-lg leading-[1.8]" /> : null
  const text = (
    <>
      {quote}
      {body}
    </>
  )

  return (
    <section id={c.slug} aria-labelledby={`${c.slug}-h`} className="scroll-mt-40 pb-24 lg:scroll-mt-32 lg:pb-30">
      <div className="mb-7 flex flex-wrap items-baseline gap-4.5 border-t border-ink/14 pt-5.5">
        <span className="cap font-semibold text-olive-deep">Frame {c.frameNumber}</span>
        <h2 id={`${c.slug}-h`} className="cap m-0 font-semibold text-muted">
          {c.title}
        </h2>
      </div>

      {(c.layout === 'image-right' || c.layout === 'image-left') && images[0] ? (
        <div className={`flex flex-wrap gap-12 ${c.layout === 'image-left' ? 'flex-wrap-reverse items-center' : 'items-end'}`}>
          {c.layout === 'image-left' && (
            <div className="min-w-0 flex-[0_1_340px]">
              <Figure media={images[0].media} caption={images[0].caption} number={numbers[0]} sizes="(min-width: 1024px) 340px, 100vw" />
            </div>
          )}
          <div className="min-w-0 flex-[1_1_380px]">{text}</div>
          {c.layout === 'image-right' && (
            <div className="min-w-0 flex-[0_1_300px]">
              <Figure media={images[0].media} caption={images[0].caption} number={numbers[0]} sizes="(min-width: 1024px) 300px, 100vw" />
            </div>
          )}
        </div>
      ) : (
        text
      )}

      {c.layout === 'diptych' && images.length > 0 && (
        <div className="mt-9 flex gap-3 sm:gap-4">
          {images.map((img, i) => (
            <div key={img.media.id} className={`min-w-0 flex-1 ${i === 1 ? 'pt-10 sm:pt-16' : ''}`}>
              <Figure media={img.media} caption={img.caption} number={numbers[i]} sizes="(min-width: 1024px) 480px, 50vw" />
            </div>
          ))}
        </div>
      )}

      {c.extra === 'values' && values.length > 0 && (
        <dl className="m-0 mt-10 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-10">
          {values.map((v) => (
            <div key={v.id ?? v.name} className="flex items-baseline gap-4 border-t border-ink/14 py-4">
              <dt className="min-w-32 font-display text-xl text-ink">{v.name}</dt>
              <dd className="m-0 text-[15px] leading-relaxed">{v.line}</dd>
            </div>
          ))}
        </dl>
      )}

      {c.extra === 'timeline' && timeline.length > 0 && (
        <ol className="kv-timeline m-0 mt-11 grid list-none grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-y-8 p-0">
          {timeline.map((t) => (
            <li key={t.id ?? t.title} data-on={Boolean(t.highlight)}>
              <p className="cap m-0 mb-2.5 text-muted">{t.when}</p>
              <p className="m-0 mb-2 font-display text-[24px] leading-[1.1] text-ink">{t.title}</p>
              <p className="m-0 text-sm leading-relaxed">{t.line}</p>
            </li>
          ))}
        </ol>
      )}

      {c.extra === 'places' && places.length > 0 && (
        <p className="cap m-0 mt-7 leading-[2.2] text-muted">{places.join(' · ')}</p>
      )}

      {children}
    </section>
  )
}
