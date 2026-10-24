import type { Metadata } from 'next'
import Link from 'next/link'

import { Photo } from '@/components/Photo'
import { RichText } from '@/components/RichText'
import { getAbout } from '@/lib/data'
import { BOOK_HREF } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: 'Ayomideji “Keji” Omolegan — wedding-led photographer and filmmaker.',
}

// Keji's own words from his Instagram (used in the approved mockup), shown until the
// About global has his final bio.
const FALLBACK_BIO = [
  'There’s a moment right before the vows are said, the toast is raised, the deal is sealed — and then it’s gone. Unless someone’s there to hold onto it.',
  'That’s what we do. We follow the big scenes — weddings, traditional ceremonies, corporate milestones — and we notice the small ones too: a glance, a laugh, a hand held a little tighter.',
  'Then we take it further, shaping films that don’t just show your story, but let people feel it.',
]

export default async function AboutPage() {
  const about = await getAbout()
  const portrait = typeof about.portrait === 'object' ? about.portrait : null
  const headline = about.headline || 'Behind the lens'
  const words = headline.split(' ')
  const hasBio = Boolean(about.bio && JSON.stringify(about.bio).includes('"text"'))

  return (
    <>
      <section className="mx-auto flex max-w-[1360px] flex-wrap items-start gap-12 px-4 pt-14 pb-20 sm:px-6 lg:gap-18 lg:px-10 lg:pt-18 lg:pb-28">
        <div className="min-w-0 flex-[1.2_1_460px]">
          <p className="cap m-0 mb-5 font-semibold text-olive-deep">About</p>
          <h1 className="m-0 font-display text-[clamp(48px,6vw,88px)] leading-[1.02] font-medium text-ink">
            {words.slice(0, -1).join(' ')} <span className="text-olive-display">{words.at(-1)}</span>
          </h1>
          <div className="mt-9 max-w-[620px] text-lg leading-[1.8]">
            {hasBio ? (
              <RichText data={about.bio} />
            ) : (
              FALLBACK_BIO.map((p) => (
                <p key={p} className="m-0 mb-5 last:mb-0">
                  {p}
                </p>
              ))
            )}
          </div>
        </div>
        {portrait && (
          <figure className="m-0 w-full max-w-[480px] min-w-0 flex-[1_1_340px]">
            <Photo media={portrait} priority sizes="(min-width: 1024px) 480px, 100vw" className="aspect-[4/5] object-cover" />
            <figcaption className="cap mt-3 text-muted">Ayomideji “Keji” Omolegan · Photographer &amp; filmmaker</figcaption>
          </figure>
        )}
      </section>

      {(about.values?.length ?? 0) > 0 && (
        <section aria-labelledby="values-h" className="border-y border-ink/10 bg-paper">
          <div className="mx-auto max-w-[1360px] px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            <h2 id="values-h" className="m-0 mb-10 font-display text-4xl font-medium text-ink">
              What we <span className="text-olive-display">believe</span>
            </h2>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] border-t border-olive p-0">
              {about.values!.map((v) => (
                <li key={v.id ?? v.name} className="pt-7 pr-7 pb-2">
                  <p className="m-0 mb-2.5 font-display text-2xl text-ink">{v.name}</p>
                  <p className="m-0 text-[15px] leading-relaxed">{v.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-10 px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
        <h2 className="m-0 font-display text-[clamp(36px,4.4vw,64px)] leading-[1.05] font-medium text-ink">
          Let’s tell <span className="text-olive-display">your story</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href={BOOK_HREF} className="btn btn-ink">
            Check your date
          </Link>
          <Link href="/portfolio" className="btn btn-line">
            View the work
          </Link>
        </div>
      </section>
    </>
  )
}
