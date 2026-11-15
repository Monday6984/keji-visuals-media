import Link from 'next/link'

import { Photo } from '@/components/Photo'
import { isMedia } from '@/lib/about'
import { frameNo } from '@/lib/format'
import { BOOK_HREF } from '@/lib/site'
import type { About } from '@/payload-types'

type Hero = NonNullable<About['hero']>
type ButtonLink = NonNullable<NonNullable<Hero['primaryButton']>['link']>

const HREFS: Record<Exclude<ButtonLink, 'whatsapp'>, string> = { portfolio: '/portfolio', book: BOOK_HREF, packages: '/packages' }

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M2 10 L10 2 M4 2 H10 V8" />
  </svg>
)
const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M8 1.8a6.2 6.2 0 0 0-5.4 9.3L1.8 14.2l3.2-.8A6.2 6.2 0 1 0 8 1.8z" />
  </svg>
)

function HeroButton({ button, solid, whatsapp }: { button: Hero['primaryButton']; solid: boolean; whatsapp: string | null }) {
  if (!button?.label || !button.link) return null
  const href = button.link === 'whatsapp' ? whatsapp : HREFS[button.link]
  if (!href) return null
  const className = `btn gap-3 ${solid ? 'btn-ink shadow-[0_10px_24px_rgba(22,20,15,0.18)]' : 'btn-line bg-paper/60'}`
  const icon = button.link === 'whatsapp' ? <ChatIcon /> : <ArrowIcon />
  return button.link === 'whatsapp' ? (
    <a href={href} className={className}>
      {button.label} {icon}
    </a>
  ) : (
    <Link href={href} className={className}>
      {button.label} {icon}
    </Link>
  )
}

// About hero, option B (docs/mockup/AboutHeroB.dc.html): text on the left, a cut-out
// portrait on the right that bleeds off the edge, fades out at the bottom and sits on an
// olive glow, with viewfinder corners over the face. Below 1000px the portrait goes on top.
export function AboutHero({ hero, number, whatsapp }: { hero: Hero; number: number | null; whatsapp: string | null }) {
  const portrait = isMedia(hero.portrait) ? hero.portrait : null
  const lines = hero.headlineLines?.length ? hero.headlineLines : [{ text: 'Behind the lens', accent: false }]
  const frame = hero.faceFrame ?? {}
  const pill = hero.statusPill?.show !== false && hero.statusPill?.text ? hero.statusPill.text : null

  return (
    <section aria-labelledby="about-h" className="relative overflow-hidden">
      <div className="kv-glow" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-[1360px] flex-col-reverse px-4 sm:px-6 min-[1000px]:min-h-[820px] min-[1000px]:flex-row min-[1000px]:items-stretch lg:px-10">
        <div className="relative z-10 min-w-0 pt-8 pb-20 min-[1000px]:flex-[1_1_520px] min-[1000px]:self-center min-[1000px]:py-18 min-[1000px]:pb-24">
          {pill && (
            <p className="kv-fadeup m-0 mb-7.5" style={{ animationDelay: '0.1s' }}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-olive-deep/25 bg-olive/18 px-4 py-2.25 text-xs font-medium text-body">
                <span className="kv-dot" aria-hidden="true" />
                {pill}
              </span>
            </p>
          )}
          {hero.kicker && (
            <p className="cap kv-fadeup m-0 mb-4.5 font-semibold text-muted" style={{ animationDelay: '0.15s' }}>
              {hero.kicker}
            </p>
          )}
          <h1
            id="about-h"
            className="m-0 max-w-[680px] font-display text-[clamp(36px,5.6vw,84px)] leading-[1.04] font-medium tracking-[0.005em] text-ink"
          >
            {lines.map((l, i) => (
              <span key={i} className="kv-mask">
                <span className={`kv-rise ${l.accent ? 'text-olive-display' : ''}`} style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
                  {l.text}
                </span>
              </span>
            ))}
          </h1>
          {hero.intro && (
            <p className="kv-fadeup m-0 mt-8 max-w-[470px] text-lg leading-[1.75]" style={{ animationDelay: '0.9s' }}>
              {hero.intro}
            </p>
          )}
          <div className="kv-fadeup mt-10 flex flex-wrap gap-3.5" style={{ animationDelay: '1.05s' }}>
            <HeroButton button={hero.primaryButton} solid whatsapp={whatsapp} />
            <HeroButton button={hero.secondaryButton} solid={false} whatsapp={whatsapp} />
          </div>
        </div>

        {portrait && (
          <figure className="relative z-0 m-0 -mx-4 min-w-0 pt-8 sm:mx-auto sm:w-full sm:max-w-[620px] min-[1000px]:mr-[-24px] min-[1000px]:ml-auto min-[1000px]:max-w-[680px] min-[1000px]:flex-[1_1_460px] min-[1000px]:self-end min-[1000px]:pt-10 lg:mr-[-40px]">
            <div className="relative">
              <Photo
                media={portrait}
                priority
                placeholder={false}
                sizes="(min-width: 1000px) 680px, (min-width: 640px) 620px, 100vw"
                className={`kv-cutout ${hero.portraitMono !== false ? 'brightness-[1.02] contrast-[1.06] grayscale' : ''}`}
              />
              <div
                aria-hidden="true"
                className="absolute"
                style={{
                  left: `${frame.left ?? 29}%`,
                  top: `${frame.top ?? 8}%`,
                  width: `${frame.width ?? 33}%`,
                  height: `${frame.height ?? 39.5}%`,
                }}
              >
                {(['tl', 'tr', 'bl', 'br'] as const).map((c, i) => (
                  <span key={c} className={`kv-corner ${c}`} style={{ animationDelay: `${1.4 + i * 0.05}s` }} />
                ))}
              </div>
            </div>
            <figcaption className="cap kv-fadeup absolute right-6 bottom-6 text-muted sm:right-10 min-[1000px]:right-16 min-[1000px]:bottom-7" style={{ animationDelay: '1.6s' }}>
              No. {frameNo(number ?? 1)}
              {hero.caption ? ` · ${hero.caption}` : ''}
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  )
}
