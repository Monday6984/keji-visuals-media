import { categoryHref } from '@/components/portfolio/categoryHref'
import { isMedia } from '@/lib/about'
import type { Category, Home, SiteSetting } from '@/payload-types'

import { Intro } from './Intro'
import { type LandingItem, LandingStage } from './LandingStage'

// Decides before first paint whether the intro plays: once per session, never with
// reduced motion, never when sessionStorage is unavailable.
const INTRO_SCRIPT = `(function(){try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var k='kv-intro-played';if(window.sessionStorage.getItem(k))return;window.sessionStorage.setItem(k,'1');document.documentElement.setAttribute('data-intro','play')}catch(e){}})()`

// Full-screen first section of the homepage (docs/mockup/HomeLanding.dc.html).
export function Landing({ landing, settings }: { landing: Home['landing']; settings: SiteSetting }) {
  const items: LandingItem[] = (landing?.items ?? []).flatMap((item, i) => {
    const category = item.category && typeof item.category === 'object' ? (item.category as Category) : null
    if (!category || !isMedia(item.background)) return []
    return [
      {
        id: item.id ?? String(i),
        label: item.label || category.name,
        description: item.description ?? null,
        href: categoryHref(category),
        background: item.background,
        poster: isMedia(item.poster) ? item.poster : null,
        videoUrl: item.videoUrl || null,
      },
    ]
  })
  if (!items.length) return null

  const instagram = settings.socials?.find((s) => s.platform === 'instagram')

  return (
    <section data-landing aria-label="Keji Visuals — explore the work" className="kv-landing relative overflow-hidden bg-film text-cream">
      {landing?.introEnabled !== false && (
        <>
          <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
          <Intro />
        </>
      )}

      <LandingStage kicker={landing?.kicker ?? null} items={items} />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 pb-28 sm:px-6 md:px-10 md:pb-7">
          {landing?.footerLeft && <span className="cap text-mist">{landing.footerLeft}</span>}
          <a href="#continue" className="cap flex min-h-11 items-center gap-2.5 text-cream no-underline hover:text-cream focus-visible:outline-olive-light">
            Scroll <span className="kv-cue" aria-hidden="true">↓</span>
          </a>
          <span className="cap hidden items-center gap-5.5 text-mist md:flex">
            {instagram && (
              <>
                <a href={instagram.url} rel="me noopener" className="text-mist no-underline hover:text-cream focus-visible:outline-olive-light">
                  Instagram
                </a>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>Timeless. Genuine. Beautiful.</span>
          </span>
        </div>
      </div>
    </section>
  )
}
