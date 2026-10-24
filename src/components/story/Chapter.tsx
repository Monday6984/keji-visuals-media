import type { CSSProperties } from 'react'

import { aspectRatio } from '@/lib/photo'
import { buildRows } from '@/lib/rows'
import type { Media } from '@/payload-types'

import { Frame } from './Frame'

export type ChapterPhoto = { media: Media; n: number; breather: boolean }

const CONTAINER = 1360 - 80 // max content width in px (container minus side padding)

// A chapter's photos in justified rows (one column on phones). Each photo grows with its
// aspect ratio, so a row's photos share a height; breathers get a full row.
export function Chapter({ id, no, title, photos }: { id: string; no: string; title: string; photos: ChapterPhoto[] }) {
  const rows = buildRows(photos.map((p) => ({ ...p, ar: aspectRatio(p.media) })))

  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mx-auto max-w-[1360px] scroll-mt-24 px-4 pt-16 sm:px-6 lg:px-10 lg:pt-22">
      <div className="mb-7 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <span className="cap font-semibold text-olive-deep">Chapter {no}</span>
        <h2 id={`${id}-h`} className="m-0 font-display text-3xl font-medium text-ink sm:text-[40px]">
          {title}
        </h2>
      </div>

      <div className="flex flex-col gap-6 md:gap-3.5">
        {rows.map((row, i) => {
          const total = row.items.reduce((s, p) => s + p.ar, 0) + row.spacer
          return (
            <div key={i} className={`flex flex-col gap-6 md:flex-row md:gap-3.5 ${row.breather ? 'md:my-6' : ''}`}>
              {row.items.map((p) => {
                const share = p.ar / total
                return (
                  <Frame
                    key={p.n}
                    media={p.media}
                    n={p.n}
                    chapter={title}
                    className="md:[flex:var(--ar)_1_0]"
                    sizes={`(min-width: 1360px) ${Math.round(share * CONTAINER)}px, (min-width: 768px) ${Math.round(share * 100)}vw, 100vw`}
                    // A grow factor proportional to aspect ratio keeps heights equal in a row.
                    style={{ '--ar': p.ar } as CSSProperties}
                  />
                )
              })}
              {row.spacer > 0 && <div aria-hidden="true" className="hidden md:block" style={{ flex: `${row.spacer} 1 0` }} />}
            </div>
          )
        })}
      </div>
    </section>
  )
}
