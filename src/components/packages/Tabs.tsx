'use client'

import { useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react'

export type TabDef = { id: string; label: string; panel: ReactNode }

// ARIA tabs (arrow keys, Home/End). All panels are server-rendered into the HTML; this only
// chooses which one shows. ?tab=<slug> in the URL picks the starting tab.
const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb)
  return () => window.removeEventListener('popstate', cb)
}
const tabFromURL = () => new URLSearchParams(window.location.search).get('tab')

export function Tabs({ tabs, label }: { tabs: TabDef[]; label: string }) {
  const urlTab = useSyncExternalStore(subscribe, tabFromURL, () => null)
  const [chosen, setChosen] = useState<string | null>(null)
  const active = [chosen, urlTab].find((t) => t && tabs.some((x) => x.id === t)) ?? tabs[0]?.id
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const select = (id: string) => {
    setChosen(id)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', id)
    window.history.replaceState(null, '', url)
  }

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = tabs.length - 1
    const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    select(tabs[next].id)
    refs.current[tabs[next].id]?.focus()
  }

  return (
    <>
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <div role="tablist" aria-label={label} className="flex gap-2.5 overflow-x-auto border-y border-ink/18 py-4.5 [scrollbar-width:none] max-sm:-mx-4 max-sm:px-4 sm:flex-wrap">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el
              }}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={active === t.id ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`cap min-h-11 shrink-0 rounded-full border px-4.5 font-semibold ${
                active === t.id ? 'border-ink bg-ink text-cream' : 'border-ink/30 text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((t) => (
        <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} tabIndex={0} hidden={active !== t.id}>
          {t.panel}
        </div>
      ))}
    </>
  )
}
