'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export type IndexItem = { id: string; no: string; title: string }

// "The reel": sticky chapter list beside the text on desktop, a swipeable chip row under
// the header on phones. Highlights the chapter currently being read.
export function ChapterIndex({ items, thumbnail }: { items: IndexItem[]; thumbnail?: ReactNode }) {
  const [active, setActive] = useState<string | null>(null)
  const chips = useRef<HTMLUListElement>(null)

  // Keep the current chapter's chip in view in the phone chip row (scrolls the row only).
  useEffect(() => {
    const row = chips.current
    const chip = row?.querySelector<HTMLElement>(`a[href="#${active}"]`)?.parentElement
    if (!row || !chip) return
    const left = chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.scrollTo({ left: Math.max(0, left), behavior: smooth ? 'smooth' : 'auto' })
  }, [active])

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((s): s is HTMLElement => Boolean(s))
    if (!sections.length) return
    // A chapter counts as current once its top passes the upper third of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <>
      {/* Phones and tablets: chips under the sticky header */}
      <nav
        aria-label="On this page"
        className="sticky top-[73px] z-20 -mx-4 mb-10 border-b border-ink/10 bg-cream/95 backdrop-blur-sm sm:-mx-6 lg:hidden"
      >
        <ul ref={chips} className="m-0 flex list-none gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6">
          {items.map((i) => (
            <li key={i.id} className="shrink-0">
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? 'location' : undefined}
                className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-[13px] no-underline ${
                  active === i.id ? 'border-ink bg-ink text-cream hover:text-cream' : 'border-ink/25 text-ink'
                }`}
              >
                <span className="cap font-semibold opacity-70">{i.no}</span>
                {i.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop: sticky column */}
      <aside aria-label="On this page" className="sticky top-28 hidden self-start lg:block">
        {thumbnail}
        <p className="cap m-0 mb-2.5 text-muted">The reel</p>
        <ul className="m-0 list-none p-0">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? 'location' : undefined}
                className={`flex items-baseline gap-3 border-b border-ink/14 py-2.5 text-[15px] no-underline ${
                  active === i.id ? 'text-olive-deep' : 'text-ink'
                }`}
              >
                <span className="cap font-semibold text-olive-deep">{i.no}</span>
                {i.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
