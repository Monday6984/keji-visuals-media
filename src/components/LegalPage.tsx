import type { ReactNode } from 'react'

// Shared layout for /privacy and /booking-terms. `draft` shows a visible notice until
// the text has been reviewed (privacy: by a lawyer; booking terms: by Keji).
export function LegalPage({ title, updated, draft, children }: { title: [string, string]; updated?: string; draft?: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-[860px] px-4 pt-14 pb-24 sm:px-6 lg:pt-18">
      <h1 className="m-0 font-display text-[clamp(40px,5vw,72px)] leading-[1.05] font-medium text-ink">
        {title[0]} <span className="text-olive-display">{title[1]}</span>
      </h1>
      {updated && <p className="cap m-0 mt-5 text-muted">Last updated {updated}</p>}
      {draft && (
        <p role="note" className="m-0 mt-8 border-l-2 border-olive-deep bg-paper px-5 py-4 text-[15px] leading-relaxed">
          <strong>Draft.</strong> {draft}
        </p>
      )}
      <div className="mt-10 text-[17px] leading-[1.75] [&_a]:text-olive-deep [&_a]:underline [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-[28px] [&_h2]:font-medium [&_h2]:text-ink [&_li]:mb-2 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </article>
  )
}
