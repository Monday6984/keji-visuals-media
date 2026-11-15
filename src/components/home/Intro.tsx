'use client'

import type { CSSProperties } from 'react'

import { MARK, MARK_VIEWBOX } from '@/components/site/logoPaths'

const done = () => document.documentElement.setAttribute('data-intro', 'done')

// Once-per-session intro over the landing. Hidden unless the inline script in Landing set
// data-intro="play" before first paint; the landing renders underneath straight away.
export function Intro() {
  return (
    <div
      className="kv-intro"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) done()
      }}
    >
      <svg viewBox={MARK_VIEWBOX} aria-hidden="true" className="kv-intro-in h-9 w-auto fill-olive-light">
        <path d={MARK} />
      </svg>
      <span className="kv-intro-in font-display text-[26px] font-medium tracking-[0.22em]" style={{ '--d': '0.15s' } as CSSProperties}>
        KEJI VISUALS
      </span>
      <span className="cap kv-intro-in text-stone" style={{ '--d': '0.35s' } as CSSProperties}>
        Timeless. Genuine. Beautiful.
      </span>
      <button type="button" onClick={done} className="cap absolute right-8 bottom-7 min-h-11 px-4 text-stone focus-visible:outline-olive-light">
        Skip
      </button>
    </div>
  )
}
