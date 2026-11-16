'use client'

import { useEffect, useSyncExternalStore } from 'react'

const KEY = 'kv-theme'
type Theme = 'light' | 'dark'

const themeStore = {
  subscribe: (cb: () => void) => {
    const mo = new MutationObserver(cb)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  },
  get: () => document.documentElement.dataset.theme === 'dark',
}

/** Switch in one step: colour transitions are off for the two frames the change takes. */
const apply = (theme: Theme) => {
  const root = document.documentElement
  root.classList.add('kv-theme-switching')
  root.setAttribute('data-theme', theme)
  requestAnimationFrame(() =>
    requestAnimationFrame(() => root.classList.remove('kv-theme-switching')),
  )
}

const saved = (): Theme | null => {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'dark' || t === 'light' ? t : null
  } catch {
    return null
  }
}

// Light/dark switch for the header. Until the visitor chooses, the site follows the device
// setting (and keeps following it if that changes); a choice is remembered on this device.
export function ThemeToggle({ className = '' }: { className?: string }) {
  const dark = useSyncExternalStore(themeStore.subscribe, themeStore.get, () => false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    // Pages React renders entirely in the browser (e.g. the 404) drop the attribute the
    // inline script set; put it back.
    if (!document.documentElement.dataset.theme) apply(saved() ?? (mq.matches ? 'dark' : 'light'))
    const follow = () => {
      if (!saved()) apply(mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', follow)
    return () => mq.removeEventListener('change', follow)
  }, [])

  const toggle = () => {
    const next: Theme = dark ? 'light' : 'dark'
    apply(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Private mode or blocked storage: the switch still works for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/30 text-ink ${className}`}
    >
      {/* Label and icon are both picked by CSS from data-theme, so they're right from first
          paint, before hydration (display:none text is left out of the accessible name). */}
      <span className="kv-icon-moon sr-only">Switch to dark theme</span>
      <span className="kv-icon-sun sr-only">Switch to light theme</span>
      {/* Both icons render; CSS shows the right one from data-theme, so the icon is correct
          from first paint (before hydration). Sun in dark mode, moon in light mode. */}
      <svg
        className="kv-icon-sun"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
      </svg>
      <svg
        className="kv-icon-moon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      >
        <path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8z" />
      </svg>
    </button>
  )
}
