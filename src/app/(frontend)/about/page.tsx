import type { Metadata } from 'next'
import Link from 'next/link'

import { AboutChapter } from '@/components/about/AboutChapter'
import { ChapterIndex } from '@/components/about/ChapterIndex'
import { FilmReel } from '@/components/about/FilmReel'
import { Olive } from '@/components/about/Olive'
import { Photo } from '@/components/Photo'
import { type AboutBlock, isMedia, layoutAbout, placesToShow } from '@/lib/about'
import { getAbout, getSiteSettings } from '@/lib/data'
import { frameNo } from '@/lib/format'
import { BOOK_HREF, whatsappHref } from '@/lib/site'

const DESCRIPTION = 'Ayomideji “Keji” Omolegan, wedding-led photographer and filmmaker in Lagos.'

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout()
  const share = isMedia(about.hero?.shareImage) ? about.hero.shareImage.sizes?.md : null
  return {
    title: 'About',
    description: about.hero?.intro || DESCRIPTION,
    openGraph: share?.url ? { images: [{ url: share.url, width: share.width ?? undefined, height: share.height ?? undefined }] } : undefined,
  }
}

const LINKS = { book: BOOK_HREF, portfolio: '/portfolio', packages: '/packages' } as const

// About page from docs/mockup/About.dc.html: hero, sticky chapter index ("the reel"),
// chapters with film-strip reels between them, and a closing call to action. All content
// comes from the About global; unpublished chapters never render.
export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSiteSettings()])
  const hero = about.hero ?? {}
  const lines = hero.lines?.length ? hero.lines : [{ text: 'Behind', olive: null }, { text: 'the lens', olive: 'lens' }]
  const heroImage = isMedia(hero.image) ? hero.image : null
  const thumb = isMedia(hero.indexThumbnail) ? hero.indexThumbnail : null
  const closing = about.closing ?? {}
  const closingImage = isMedia(closing.image) ? closing.image : null

  const { heroNumber, blocks, closingNumber } = layoutAbout(about)
  const places = placesToShow(about.places)

  // Reels are rendered inside the chapter they follow.
  const sections = blocks.reduce<{ chapter: Extract<AboutBlock, { kind: 'chapter' }>; reels: Extract<AboutBlock, { kind: 'reel' }>[] }[]>(
    (acc, b) => {
      if (b.kind === 'chapter') acc.push({ chapter: b, reels: [] })
      else acc.at(-1)?.reels.push(b)
      return acc
    },
    [],
  )

  const wa = whatsappHref(settings.whatsapp)
  const buttons = (closing.buttons ?? []).flatMap((b) => {
    const href = b.link === 'whatsapp' ? wa : LINKS[b.link]
    return href ? [{ ...b, href }] : []
  })

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="about-h" className="mx-auto max-w-[1360px] px-4 pt-12 pb-20 sm:px-6 lg:px-10 lg:pt-16 lg:pb-24">
        <div className="flex flex-wrap items-start gap-y-10">
          <div className="relative z-10 min-w-0 flex-[1_1_520px] lg:mr-[calc(-1*clamp(0px,8vw,150px))] lg:pt-10">
            {hero.kicker && (
              <p className="cap kv-fadeup m-0 mb-6 font-semibold text-muted" style={{ animationDelay: '0.1s' }}>
                {hero.kicker}
              </p>
            )}
            <h1
              id="about-h"
              className="m-0 font-display text-[clamp(44px,7.4vw,108px)] leading-[0.98] font-medium tracking-[0.005em] text-ink"
            >
              {lines.map((l, i) => (
                <span key={i} className="kv-mask">
                  <span className="kv-rise" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                    <Olive text={l.text} olive={l.olive} />
                  </span>
                </span>
              ))}
            </h1>
            {(hero.intro || hero.signature) && (
              <div className="kv-fadeup mt-10 max-w-[460px]" style={{ animationDelay: '0.9s' }}>
                {hero.intro && <p className="m-0 mb-6 text-xl leading-[1.7]">{hero.intro}</p>}
                {hero.signature && (
                  <p className="m-0 border-t border-olive pt-4.5 font-display text-[22px] tracking-[0.08em] text-ink">
                    {hero.signature}
                  </p>
                )}
              </div>
            )}
          </div>
          {heroImage && (
            <figure className="m-0 w-full min-w-0 flex-[0_1_470px]">
              <div className="kv-frame aspect-[4/5]" style={{ animationDelay: '0.15s' }}>
                <Photo media={heroImage} fill priority sizes="(min-width: 1024px) 470px, 100vw" />
              </div>
              <figcaption className="cap mt-3 text-muted">
                No. {frameNo(heroNumber ?? 1)}
                {hero.caption ? ` · ${hero.caption}` : ''}
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {/* Chapters */}
      {sections.length > 0 && (
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 lg:px-10">
          <ChapterIndex
            items={sections.map((s) => ({ id: s.chapter.chapter.slug, no: s.chapter.chapter.frameNumber, title: s.chapter.chapter.title }))}
            thumbnail={
              thumb ? (
                <div className="relative mb-4.5 aspect-[4/5] w-28 overflow-hidden rounded-[2px] bg-paper">
                  <Photo media={thumb} fill sizes="112px" alt="" />
                </div>
              ) : null
            }
          />
          <div className="min-w-0">
            {sections.map(({ chapter, reels }) => (
              <AboutChapter
                key={chapter.chapter.id ?? chapter.chapter.slug}
                chapter={chapter.chapter}
                numbers={chapter.numbers}
                values={about.values ?? []}
                timeline={about.timeline ?? []}
                places={places}
              >
                {reels.map((r) => (
                  <FilmReel key={r.reel.id ?? r.reel.label} label={r.reel.label} frames={r.frames} />
                ))}
              </AboutChapter>
            ))}
          </div>
        </div>
      )}

      {/* Closing */}
      {closing.heading && (
        <section aria-labelledby="about-cta-h" className="border-t border-ink/14 bg-paper">
          <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
            {closingImage && (
              <figure className="m-0 w-[200px] min-w-0 sm:w-[240px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-cream">
                  <Photo media={closingImage} fill sizes="240px" />
                </div>
                <figcaption className="sr-only">No. {frameNo(closingNumber ?? 0)}</figcaption>
              </figure>
            )}
            <div className="min-w-0 flex-[1_1_420px]">
              {closing.kicker && <p className="cap m-0 mb-5 text-muted">{closing.kicker}</p>}
              <h2 id="about-cta-h" className="m-0 font-display text-[clamp(30px,3.6vw,54px)] leading-[1.05] font-medium text-ink">
                <Olive text={closing.heading} olive={closing.olive} />
              </h2>
            </div>
            {buttons.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {buttons.map((b) =>
                  b.link === 'whatsapp' ? (
                    <a key={b.id ?? b.label} href={b.href} className={`btn ${b.style === 'solid' ? 'btn-ink' : 'btn-line'}`}>
                      {b.label}
                    </a>
                  ) : (
                    <Link key={b.id ?? b.label} href={b.href} className={`btn ${b.style === 'solid' ? 'btn-ink' : 'btn-line'}`}>
                      {b.label}
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
