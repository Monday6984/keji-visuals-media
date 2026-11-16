'use client'

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react'

import { Photo } from '@/components/Photo'
import { fallbackSrc, photoSources } from '@/lib/photo'
import type { Media } from '@/payload-types'

export type LandingItem = {
  id: string
  label: string
  description: string | null
  href: string
  background: Media
  poster: Media | null
  videoUrl: string | null
  /** Phones (below 768px): horizontal position of the visible slice, 0–100. */
  mobilePosition: number | null
}

const INTERVAL = 6000
// Mockup offsets: each name steps right on wide screens; phones stack them flush.
const OFFSETS = ['0%', '9%', '3%', '13%', '6%', '10%']

const media = (query: string) => ({
  subscribe: (cb: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  },
  get: () => window.matchMedia(query).matches,
})
const reducedMotion = media('(prefers-reduced-motion: reduce)')
const hoverPointer = media('(hover: hover) and (pointer: fine)')

// The intro overlay is playing (Landing's inline script set data-intro="play").
const introStore = {
  subscribe: (cb: () => void) => {
    const mo = new MutationObserver(cb)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-intro'] })
    return () => mo.disconnect()
  },
  get: () => document.documentElement.dataset.intro === 'play',
}
// The browser tab is in the foreground.
const visibleStore = {
  subscribe: (cb: () => void) => {
    document.addEventListener('visibilitychange', cb)
    return () => document.removeEventListener('visibilitychange', cb)
  },
  get: () => document.visibilityState === 'visible',
}

// Backgrounds + the category list. The background loops through the categories every 6 s
// (all devices) with a pause/play button; hovering or focusing a category shows it and holds
// the loop until the pointer/focus leaves. The loop waits for the intro, and pauses while the
// landing is off-screen or the tab is hidden. Reduced motion: instant swaps, no loop, no
// video. Also tells the header when the landing has scrolled away.
export function LandingStage({ kicker, items }: { kicker: string | null; items: LandingItem[] }) {
  const [active, setActive] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [loadRest, setLoadRest] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(true)
  const reduce = useSyncExternalStore(reducedMotion.subscribe, reducedMotion.get, () => false)
  const canHover = useSyncExternalStore(hoverPointer.subscribe, hoverPointer.get, () => false)
  const introPlaying = useSyncExternalStore(introStore.subscribe, introStore.get, () => false)
  const tabVisible = useSyncExternalStore(visibleStore.subscribe, visibleStore.get, () => true)
  const count = items.length
  const autoAdvance = !reduce && count > 1
  const running =
    autoAdvance && !userPaused && !hovering && !focused && inView && tabVisible && !introPlaying

  // The other backgrounds load once the page itself has finished loading.
  useEffect(() => {
    if (document.readyState === 'complete') {
      const id = window.setTimeout(() => setLoadRest(true), 0)
      return () => window.clearTimeout(id)
    }
    const onLoad = () => setLoadRest(true)
    window.addEventListener('load', onLoad, { once: true })
    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => setActive((i) => (i + 1) % count), INTERVAL)
    return () => window.clearTimeout(id)
  }, [running, count, active])

  // Transparent header while the landing is under it (see .kv-header in globals.css).
  useEffect(() => {
    const landing = document.querySelector('[data-landing]')
    if (!landing) return
    const root = document.documentElement
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) root.removeAttribute('data-landing-passed')
        else root.setAttribute('data-landing-passed', '')
      },
      { rootMargin: '-82px 0px 0px 0px' },
    )
    observer.observe(landing)
    return () => {
      observer.disconnect()
      root.removeAttribute('data-landing-passed')
    }
  }, [])

  return (
    <>
      {/* Backgrounds: one layer per category; only the active one is visible. */}
      {items.map((item, i) => {
        const on = i === active
        const poster = item.poster ? fallbackSrc(photoSources(item.poster)) : undefined
        const playVideo = on && item.videoUrl && canHover && !reduce
        return (
          <div
            key={item.id}
            className="kv-bg absolute inset-0"
            data-active={on}
            aria-hidden={!on}
            style={
              item.mobilePosition != null
                ? ({ '--m-pos': `${item.mobilePosition}%` } as CSSProperties)
                : undefined
            }
          >
            {(i === 0 || loadRest) && (
              <Photo
                media={item.background}
                fill
                priority={i === 0}
                sizes="100vw"
                alt={on ? undefined : ''}
                className={
                  item.mobilePosition != null ? 'max-md:[object-position:var(--m-pos)_center]!' : ''
                }
              />
            )}
            {playVideo && (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={item.videoUrl!}
                poster={poster}
                muted
                loop
                playsInline
                autoPlay
                preload="none"
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}

      {/* Legibility scrim (see .kv-landing-scrim): measured so cream text stays at 4.5:1+ on every background. */}
      <div aria-hidden="true" className="kv-landing-scrim absolute inset-0" />

      {/* The list sits centred between the header and the bottom bar, so it never runs into the bar. */}
      <div className="absolute inset-x-0 top-[var(--kv-header-h)] bottom-[184px] z-10 flex flex-col justify-center md:bottom-[96px]">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:pr-10 md:pl-[clamp(40px,12vw,200px)]">
          {kicker && (
            <p
              className="cap kv-landing-rise m-0 mb-7.5 text-mist"
              style={{ '--d': '0s' } as CSSProperties}
            >
              {kicker}
            </p>
          )}
          <nav
            aria-label="Explore the work"
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
            }}
          >
            <ul
              className="m-0 flex list-none flex-col gap-1 p-0"
              onMouseEnter={() => canHover && setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {items.map((item, i) => {
                const on = i === active
                return (
                  <li
                    key={item.id}
                    className="kv-landing-rise md:ml-[var(--off)]"
                    style={
                      { '--d': `${0.15 + i * 0.09}s`, '--off': OFFSETS[i] ?? '0%' } as CSSProperties
                    }
                  >
                    <a
                      href={item.href}
                      data-active={on}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className={`kv-landing-item flex flex-wrap items-baseline gap-x-4.5 py-0.5 text-cream no-underline hover:text-cream focus-visible:outline-olive-light ${
                        on ? '' : 'opacity-55'
                      }`}
                    >
                      <span className="cap min-w-[22px] text-olive-light">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="kv-landing-name relative font-display text-[clamp(30px,min(6vw,9svh),88px)] leading-[1.08] tracking-[0.01em]">
                        {item.label}
                      </span>
                      {item.description && (
                        <span
                          className={`cap whitespace-nowrap text-mist transition-opacity duration-500 max-md:basis-full max-md:pl-[40px] ${
                            on ? 'opacity-100' : 'opacity-0 max-md:hidden'
                          }`}
                        >
                          / {item.description}
                        </span>
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          {autoAdvance && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              className="mt-7 flex size-11 items-center justify-center rounded-full border border-cream/50 text-cream focus-visible:outline-olive-light"
            >
              <span className="sr-only">
                {userPaused ? 'Play background slideshow' : 'Pause background slideshow'}
              </span>
              <svg
                width="12"
                height="14"
                viewBox="0 0 12 14"
                aria-hidden="true"
                fill="currentColor"
              >
                {userPaused ? (
                  <path d="M1 1 L11 7 L1 13 Z" />
                ) : (
                  <path d="M1 1h3.5v12H1zM7.5 1H11v12H7.5z" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  )
}
