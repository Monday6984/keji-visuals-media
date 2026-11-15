import { Photo } from '@/components/Photo'
import { frameNo } from '@/lib/format'
import type { Media } from '@/payload-types'

type Frame = { media: Media; caption: string | null; number: number }

// Film strip of recent work: scrolls sideways with snap points and sprocket-hole edges
// (.kv-strip). Native swipe on phones; focusable so arrow keys scroll it on desktop.
export function FilmReel({ label, frames }: { label: string; frames: Frame[] }) {
  return (
    <div className="mt-10">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-4">
        <p className="cap m-0 text-muted">{label}</p>
        <p className="cap m-0 text-muted" aria-hidden="true">
          Scroll sideways →
        </p>
      </div>
      <div className="kv-strip" tabIndex={0} role="region" aria-label={`${label}. Film strip of photos, scrolls sideways.`}>
        <ul className="m-0 flex w-max list-none gap-4.5 px-6 py-4">
          {frames.map((f) => (
            <li key={f.number} className="kv-strip-cell w-[170px] sm:w-[220px]">
              <figure className="m-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1px] bg-ink">
                  <Photo media={f.media} fill sizes="220px" />
                </div>
                <figcaption className="cap mt-2.5 text-mist">
                  No. {frameNo(f.number)}
                  {f.caption ? ` · ${f.caption}` : ''}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
