'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

export type Quote = { id: number; names: string; quote: string }

const INTERVAL = 7000

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(reducedMotionQuery)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const prefersReducedMotion = () => window.matchMedia(reducedMotionQuery).matches

// Testimonials that slide every ~7 s, with previous/next, dots, swipe and a pause/play button
// (required for auto-moving content). Pauses while hovered or focused, and starts paused for
// visitors who prefer reduced motion.
export function TestimonialSlider({ quotes }: { quotes: Quote[] }) {
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState<boolean | null>(null)
  const [holding, setHolding] = useState(false)
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false)
  const paused = userPaused ?? reduceMotion
  const count = quotes.length
  const touchX = useRef<number | null>(null)

  useEffect(() => {
    if (paused || holding || count < 2) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => window.clearTimeout(id)
  }, [paused, holding, count, index])

  const go = (i: number) => setIndex((i + count) % count)

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="What couples say"
      onMouseEnter={() => setHolding(true)}
      onMouseLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={() => setHolding(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live={paused || holding ? 'polite' : 'off'}
        >
          {quotes.map((q, i) => (
            <figure
              key={q.id}
              className="m-0 w-full shrink-0 px-1"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <blockquote className="m-0 mx-auto max-w-[760px] text-[clamp(19px,1.9vw,24px)] leading-[1.65] font-light text-ink">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-6 font-display text-lg text-olive-deep">{q.names}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-9 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setUserPaused(!paused)}
            className="flex size-11 items-center justify-center rounded-full border border-ink/30"
          >
            <span className="sr-only">{paused ? 'Play testimonials' : 'Pause testimonials'}</span>
            <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" fill="currentColor">
              {paused ? <path d="M1 1 L11 7 L1 13 Z" /> : <path d="M1 1h3.5v12H1zM7.5 1H11v12H7.5z" />}
            </svg>
          </button>
          <button type="button" onClick={() => go(index - 1)} className="flex size-11 items-center justify-center text-xl">
            <span aria-hidden="true">←</span>
            <span className="sr-only">Previous testimonial</span>
          </button>
          <div role="group" aria-label="Choose a testimonial" className="flex">
            {quotes.map((q, i) => (
              <button
                key={q.id}
                type="button"
                onClick={() => go(i)}
                aria-current={i === index}
                className="flex size-11 items-center justify-center"
              >
                <span className="sr-only">Testimonial {i + 1}: {q.names}</span>
                <span
                  aria-hidden="true"
                  className={`block size-2 rounded-full transition-colors ${i === index ? 'bg-ink' : 'bg-ink/25'}`}
                />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(index + 1)} className="flex size-11 items-center justify-center text-xl">
            <span aria-hidden="true">→</span>
            <span className="sr-only">Next testimonial</span>
          </button>
        </div>
      )}
    </div>
  )
}
