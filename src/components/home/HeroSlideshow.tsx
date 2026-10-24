'use client'

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react'

import { Photo } from '@/components/Photo'
import { frameNo } from '@/lib/format'
import type { Media } from '@/payload-types'

export type HeroPair = { left: Media; right: Media }

const INTERVAL = 5200

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(reducedMotionQuery)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const prefersReducedMotion = () => window.matchMedia(reducedMotionQuery).matches

const caption = (m: Media) => `No. ${frameNo(m.id)} · ${m.caption || 'Keji Visuals'}`

// Photo pairs change every ~5 s with clickable progress segments and a pause/play button
// (required for auto-moving content). Starts paused for visitors who prefer reduced motion.
export function HeroSlideshow({ pairs }: { pairs: HeroPair[] }) {
  const [index, setIndex] = useState(0)
  const [tick, setTick] = useState(0) // restarts the progress animation
  const [userPaused, setUserPaused] = useState<boolean | null>(null)
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false)
  const paused = userPaused ?? reduceMotion
  const count = pairs.length

  useEffect(() => {
    if (paused || count < 2) return
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % count)
      setTick((t) => t + 1)
    }, INTERVAL)
    return () => window.clearTimeout(id)
  }, [paused, count, index, tick])

  const go = (i: number) => {
    setIndex(i)
    setTick((t) => t + 1)
  }

  const current = pairs[index]

  return (
    <div className="flex min-w-0 flex-[1.5_1_560px] flex-col gap-4.5">
      <div className="flex items-end gap-3 sm:gap-5">
        {(['left', 'right'] as const).map((side) => (
          <figure key={side} className={`m-0 min-w-0 ${side === 'left' ? 'flex-1' : 'mb-10 flex-[0.8_1_0] sm:mb-16'}`}>
            <div
              className={`kv-frame ${side === 'left' ? 'aspect-[4/5.4]' : 'aspect-[4/5]'}`}
              style={{ animationDelay: side === 'left' ? '0.2s' : '0.45s' }}
            >
              {pairs.map((pair, i) => (
                <div
                  key={pair[side].id}
                  className="kv-layer"
                  data-active={i === index}
                  aria-hidden={i !== index}
                  style={side === 'right' ? { transitionDelay: '0.25s' } : undefined}
                >
                  <Photo
                    media={pair[side]}
                    fill
                    priority={i === 0}
                    sizes={side === 'left' ? '(min-width: 1360px) 440px, (min-width: 1024px) 33vw, 55vw' : '(min-width: 1360px) 350px, (min-width: 1024px) 26vw, 45vw'}
                  />
                </div>
              ))}
              {side === 'left' &&
                (['tl', 'tr', 'bl', 'brr'] as const).map((corner, k) => (
                  <span key={corner} className={`kv-br ${corner}`} aria-hidden="true" style={{ animationDelay: `${1.3 + k * 0.05}s` }} />
                ))}
            </div>
            <figcaption className="cap mt-3 text-muted" aria-live={paused ? 'polite' : 'off'}>
              {caption(current[side])}
            </figcaption>
          </figure>
        ))}
      </div>

      {count > 1 && (
        <div className="kv-fadeup flex items-center gap-3" style={{ animationDelay: '1.2s' }}>
          <button
            type="button"
            onClick={() => setUserPaused(!paused)}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/30"
          >
            <span className="sr-only">{paused ? 'Play slideshow' : 'Pause slideshow'}</span>
            <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" fill="currentColor">
              {paused ? <path d="M1 1 L11 7 L1 13 Z" /> : <path d="M1 1h3.5v12H1zM7.5 1H11v12H7.5z" />}
            </svg>
          </button>
          <div role="group" aria-label="Hero photo pairs" className="flex flex-auto gap-2">
            {pairs.map((pair, i) => (
              <button
                key={pair.left.id}
                type="button"
                onClick={() => go(i)}
                aria-current={i === index}
                className="flex h-11 flex-1 items-center"
              >
                <span className="sr-only">Show pair {i + 1}</span>
                <span className="relative block h-0.5 w-full overflow-hidden bg-ink/18">
                  <i
                    key={i === index ? tick : undefined}
                    className="kv-seg-fill"
                    data-state={i === index && !paused ? 'playing' : 'static'}
                    style={{ width: i < index || (i === index && paused) ? '100%' : i > index ? 0 : undefined, '--kv-interval': `${INTERVAL}ms` } as CSSProperties}
                  />
                </span>
              </button>
            ))}
          </div>
          <span className="cap min-w-14 text-right text-muted">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  )
}
