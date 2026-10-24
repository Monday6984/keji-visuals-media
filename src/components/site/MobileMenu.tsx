'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import { BOOK_HREF, NAV } from '@/lib/site'

// Disclosure menu for small screens: Escape closes it and returns focus to the button,
// and it closes itself on navigation.
export function MobileMenu({ whatsapp }: { whatsapp: string | null }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [lastPath, setLastPath] = useState(pathname)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  // Close on navigation (adjusting state during render, not in an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex size-11 items-center justify-center rounded-full border border-ink/30"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true" stroke="currentColor" strokeWidth="1.6">
          {open ? <path d="M3 0l12 12M15 0L3 12" /> : <path d="M0 1h18M0 6h18M0 11h18" />}
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-ink/12 bg-cream px-4 pb-6 shadow-[0_12px_24px_rgba(22,20,15,0.08)] sm:px-6"
      >
        <nav aria-label="Main">
          <ul className="divide-y divide-ink/12">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
                  className="block py-4 font-display text-2xl text-ink no-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Link href={BOOK_HREF} className="btn btn-ink">
              Book a session
            </Link>
            {whatsapp && (
              <a href={whatsapp} className="btn btn-line">
                WhatsApp
              </a>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}
