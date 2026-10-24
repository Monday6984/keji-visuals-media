import Link from 'next/link'

import { BOOK_HREF, whatsappHref } from '@/lib/site'

// Sticky Book + WhatsApp bar on phones (hidden from md up, where the header has both).
export function MobileBar({ whatsapp }: { whatsapp?: string | null }) {
  const wa = whatsappHref(whatsapp)

  return (
    <div className="fixed inset-x-3 bottom-3.5 z-20 md:hidden">
      <div className="flex gap-2.5 rounded-full bg-ink/92 p-2 shadow-[0_8px_24px_rgba(22,20,15,0.25)]">
        <Link href={BOOK_HREF} className="btn btn-cream min-h-12 flex-1 px-4 text-xs">
          Book
        </Link>
        {wa && (
          <a href={wa} className="btn btn-line-cream min-h-12 flex-1 px-4 text-xs">
            WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
