import Link from 'next/link'

import { BOOK_HREF, NAV, whatsappHref } from '@/lib/site'

import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'

export function Header({ whatsapp }: { whatsapp?: string | null }) {
  const wa = whatsappHref(whatsapp)

  return (
    <header className="sticky top-0 z-30 border-b border-ink/12 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-10 lg:py-4.5">
        <Link href="/" aria-label="Keji Visuals home" className="no-underline">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="cap font-semibold text-ink no-underline">
              {item.label}
            </Link>
          ))}
          {wa && (
            <a href={wa} className="btn btn-line min-h-11 px-5">
              WhatsApp
            </a>
          )}
          <Link href={BOOK_HREF} className="btn btn-ink min-h-11 px-5.5">
            Book a session
          </Link>
        </nav>

        <MobileMenu whatsapp={wa} />
      </div>
    </header>
  )
}
