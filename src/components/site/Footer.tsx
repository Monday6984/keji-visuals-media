import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  facebook: 'Facebook',
  x: 'X',
}

export function Footer({ socials }: { socials?: SiteSetting['socials'] }) {
  return (
    <footer className="border-t border-cream/15 bg-ink pb-24 text-stone md:pb-0">
      <div className="mx-auto flex max-w-[1360px] flex-wrap justify-between gap-4 px-4 py-8 sm:px-6 lg:px-10">
        <p className="cap m-0">© {new Date().getFullYear()} Keji Visuals · Timeless. Genuine. Beautiful.</p>
        <ul className="cap m-0 flex list-none flex-wrap gap-6 p-0">
          {socials?.map((s) => (
            <li key={s.id ?? s.url}>
              <a href={s.url} className="text-stone hover:text-cream" rel="me noopener">
                {PLATFORM_LABELS[s.platform] ?? s.platform}
              </a>
            </li>
          ))}
          <li>
            <Link href="/privacy" className="text-stone hover:text-cream">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/booking-terms" className="text-stone hover:text-cream">
              Booking terms
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
