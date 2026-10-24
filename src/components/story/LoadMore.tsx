'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

// Long galleries show the first ~30 photos and reveal the rest on request. Following a
// link to a hidden chapter (e.g. from the chapter nav) reveals it too.
export function LoadMore({ remaining, children }: { remaining: number; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const revealForHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!id || !ref.current?.querySelector(`[id="${CSS.escape(id)}"]`)) return
      setOpen(true)
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    }
    revealForHash()
    window.addEventListener('hashchange', revealForHash)
    return () => window.removeEventListener('hashchange', revealForHash)
  }, [])

  return (
    <>
      <div ref={ref} hidden={!open}>
        {children}
      </div>
      {!open && (
        <div className="mx-auto max-w-[1360px] px-4 pt-14 text-center sm:px-6 lg:px-10">
          <button type="button" className="btn btn-line" onClick={() => setOpen(true)}>
            Show {remaining} more photos
          </button>
        </div>
      )}
    </>
  )
}
