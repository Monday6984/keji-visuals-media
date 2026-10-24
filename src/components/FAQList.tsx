import type { Faq } from '@/payload-types'

import { RichText } from './RichText'

// Native <details> accordions: keyboard and screen-reader support for free.
export function FAQList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="border-t border-ink/18">
      {faqs.map((f) => (
        <details key={f.id} className="group border-b border-ink/18 py-5.5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-[22px] text-ink [&::-webkit-details-marker]:hidden">
            {f.question}
            <span aria-hidden="true" className="mt-1 text-lg text-olive-deep transition-transform group-open:rotate-45 motion-reduce:transition-none">
              +
            </span>
          </summary>
          <RichText data={f.answer} className="mt-3.5 leading-[1.7]" />
        </details>
      ))}
    </div>
  )
}
