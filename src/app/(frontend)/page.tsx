import Link from 'next/link'

import { BusinessJsonLd } from '@/components/BusinessJsonLd'
import { HeroSlideshow, type HeroPair } from '@/components/home/HeroSlideshow'
import { Photo } from '@/components/Photo'
import { categoryHref } from '@/components/portfolio/categoryHref'
import { getAbout, getCategories, getFilmCount, getSiteSettings, getStories } from '@/lib/data'
import { monthYear } from '@/lib/format'
import { displayPrice } from '@/lib/price'
import { BOOK_HREF, FILMS_CATEGORY_SLUG, whatsappHref } from '@/lib/site'
import type { Category, Media, Package, Testimonial } from '@/payload-types'

const isMedia = (m: unknown): m is Media => Boolean(m && typeof m === 'object' && 'id' in m)
const asObject = <T extends { id: number }>(v: number | T | null | undefined): T | null =>
  v && typeof v === 'object' ? v : null

// Keji's own "Behind the lens" copy (from his Instagram, used in the approved mockup),
// shown until the About global has his final text.
const BEHIND_THE_LENS = [
  'There’s a moment right before the vows are said, the toast is raised, the deal is sealed — and then it’s gone. Unless someone’s there to hold onto it.',
  'That’s what we do. We follow the big scenes — weddings, traditional ceremonies, corporate milestones — and we notice the small ones too: a glance, a laugh, a hand held a little tighter.',
  'Then we take it further, shaping films that don’t just show your story, but let people feel it.',
]

const DEFAULT_VALUES = [
  { name: 'Authentic', line: 'Real moments over forced poses.' },
  { name: 'Timeless', line: 'Images you’ll still love years from now.' },
  { name: 'Intentional', line: 'Every frame has a purpose.' },
  { name: 'Personal', line: 'Your story. Your personality. Your way.' },
]

export default async function HomePage() {
  const [settings, about, categories, stories, filmCount] = await Promise.all([
    getSiteSettings(),
    getAbout(),
    getCategories(),
    getStories(),
    getFilmCount(),
  ])

  const pairs: HeroPair[] = (settings.heroSlides ?? []).flatMap((s) =>
    isMedia(s.left) && isMedia(s.right) ? [{ left: s.left, right: s.right }] : [],
  )
  const featured = stories.filter((s) => s.featured).slice(0, 3)
  const homePackages = (settings.homePackages ?? []).map((p) => asObject<Package>(p)).filter((p): p is Package => Boolean(p))
  const testimonial = asObject<Testimonial>(settings.homeTestimonial)
  const portrait = isMedia(about.portrait) ? about.portrait : null
  const values = about.values?.length ? about.values : DEFAULT_VALUES
  const wa = whatsappHref(settings.whatsapp)

  const countLabel = (c: Category) => {
    if (c.slug === FILMS_CATEGORY_SLUG) return `${filmCount} ${filmCount === 1 ? 'film' : 'films'}`
    const n = stories.filter((s) => (typeof s.category === 'object' ? s.category?.id : s.category) === c.id).length
    const unit = c.slug === 'portraits' ? (n === 1 ? 'session' : 'sessions') : n === 1 ? 'story' : 'stories'
    return `${n} ${unit}`
  }

  const steps = [
    { name: 'Enquire', line: 'Tell us your date, location and the kind of day you’re planning.' },
    { name: 'Let’s talk', line: 'A short call to understand your story and what coverage it needs.' },
    {
      name: 'Secure your date',
      line: settings.depositPercent
        ? `Your ${settings.depositPercent}% deposit and signed agreement hold the date.`
        : 'Your deposit and signed agreement hold the date.',
    },
    {
      name: 'Your gallery',
      line: settings.turnaround
        ? `Edited images delivered within ${settings.turnaround}.`
        : 'Edited images delivered to your private gallery, with your film to follow.',
    },
  ]

  return (
    <>
      <BusinessJsonLd settings={settings} />
      {/* Hero */}
      <section className="mx-auto flex max-w-[1360px] flex-wrap items-end gap-12 px-4 pt-10 pb-10 sm:px-6 lg:px-10 lg:pt-16">
        <div className="min-w-0 flex-[1_1_380px] lg:pb-8">
          <p className="cap kv-fadeup m-0 mb-7 font-semibold text-muted" style={{ animationDelay: '0.1s' }}>
            Wedding photography &amp; film{settings.city ? ` · ${settings.city}` : ''}
          </p>
          <h1 className="m-0 font-display text-[clamp(48px,6.4vw,96px)] leading-[1.02] font-medium tracking-[0.01em] text-ink">
            <span className="kv-mask">
              <span className="kv-rise" style={{ animationDelay: '0.25s' }}>
                Your moment.
              </span>
            </span>
            <span className="kv-mask">
              <span className="kv-rise text-olive" style={{ animationDelay: '0.45s' }}>
                Your story.
              </span>
            </span>
          </h1>
          <p className="kv-fadeup m-0 mt-8 max-w-[440px] text-lg leading-[1.7]" style={{ animationDelay: '0.8s' }}>
            Timeless. Genuine. Beautiful. Weddings, pre-weddings, events and portraits — documented from beginning to end,
            and the small moments in between.
          </p>
          <div className="kv-fadeup mt-10 flex flex-wrap gap-3.5" style={{ animationDelay: '0.95s' }}>
            <Link href={BOOK_HREF} className="btn btn-ink">
              Check your date
            </Link>
            <Link href="/portfolio" className="btn btn-line">
              View the work
            </Link>
          </div>
        </div>
        {pairs.length > 0 && <HeroSlideshow pairs={pairs} />}
      </section>

      {/* Marquee (desktop only, decorative) */}
      <div className="mx-auto hidden max-w-[1360px] px-10 md:block" aria-hidden="true">
        <div className="overflow-hidden border-y border-olive py-3.5 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="kv-marquee-track">
              {[...categories.map((c) => c.name), 'Timeless', 'Genuine', 'Beautiful'].map((word) => (
                <span key={word} className="flex gap-12 font-display text-lg tracking-[0.2em] text-olive-deep">
                  {word} <span>·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Category index */}
      <section aria-labelledby="work-h" className="mx-auto max-w-[1360px] px-4 pt-20 pb-16 sm:px-6 lg:px-10 lg:pt-28 lg:pb-20">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 id="work-h" className="m-0 font-display text-[clamp(36px,4vw,56px)] leading-[1.05] font-medium text-ink">
            More than
            <br />
            <span className="text-olive">a photograph</span>
          </h2>
          <p className="m-0 max-w-[380px] leading-[1.7]">
            Explore by occasion. Every story is shown the way it happened — not just the highlights.
          </p>
        </div>
        <ul className="m-0 list-none border-t border-ink/18 p-0">
          {categories.map((c, i) => (
            <li key={c.id} className="border-b border-ink/18">
              <Link href={categoryHref(c)} className="group flex flex-wrap items-center gap-x-6 gap-y-2 py-6.5 text-ink no-underline">
                <span className="cap w-10 font-semibold text-olive-deep">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-[1_1_280px] font-display text-[clamp(30px,3.6vw,52px)] leading-[1.1] group-hover:text-olive-deep">
                  {c.name}
                </span>
                {c.line && <span className="flex-[1_1_300px] text-[15px] leading-relaxed text-body">{c.line}</span>}
                <span className="cap w-28 text-right text-muted">{countLabel(c)}</span>
                <span aria-hidden="true" className="hidden size-12 items-center justify-center rounded-full border border-ink text-lg sm:flex">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Selected stories */}
      {featured.length > 0 && (
        <section aria-labelledby="stories-h" className="mx-auto max-w-[1360px] px-4 pt-10 pb-24 sm:px-6 lg:px-10 lg:pb-30">
          <div className="mb-9 flex flex-wrap items-baseline justify-between gap-6">
            <h2 id="stories-h" className="m-0 font-display text-4xl font-medium text-ink sm:text-[40px]">
              Selected <span className="text-olive">stories</span>
            </h2>
            <Link href="/portfolio" className="cap font-semibold">
              All stories →
            </Link>
          </div>
          <div className="flex flex-wrap gap-7">
            {featured.map((s, i) => {
              const cat = asObject<Category>(s.category)
              const cover = isMedia(s.cover) ? s.cover : null
              if (!cat) return null
              const meta = [cat.name, s.location, monthYear(s.date)].filter(Boolean).join(' · ')
              const big = i === 0
              return (
                <Link
                  key={s.id}
                  href={`/portfolio/${cat.slug}/${s.slug}`}
                  className={`group min-w-0 text-ink no-underline ${big ? 'flex-[1.4_1_520px]' : 'flex-[1_1_360px]'}`}
                >
                  <div className={`relative overflow-hidden bg-paper ${big ? 'aspect-[4/3.2]' : 'aspect-[16/10]'}`}>
                    {cover && (
                      <Photo
                        media={cover}
                        fill
                        alt=""
                        sizes={big ? '(min-width: 1360px) 740px, (min-width: 1024px) 55vw, 100vw' : '(min-width: 1360px) 520px, (min-width: 1024px) 40vw, 100vw'}
                        className="transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
                      />
                    )}
                  </div>
                  <p className="cap m-0 mt-4 mb-1.5 text-muted">{meta}</p>
                  <p className={`m-0 font-display group-hover:text-olive-deep ${big ? 'text-3xl' : 'text-2xl'}`}>{s.title}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Behind the lens */}
      <section id="behind" aria-labelledby="behind-h" className="border-y border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-12 px-4 py-20 sm:px-6 lg:gap-18 lg:px-10 lg:py-28">
          {portrait && (
            <figure className="m-0 max-w-[480px] min-w-0 flex-[1_1_340px]">
              <Photo media={portrait} sizes="(min-width: 1024px) 480px, 100vw" className="aspect-[4/5] object-cover" />
              <figcaption className="cap mt-3 text-muted">Ayomideji “Keji” Omolegan · Photographer &amp; filmmaker</figcaption>
            </figure>
          )}
          <div className="min-w-0 flex-[1.2_1_420px]">
            <h2 id="behind-h" className="m-0 mb-8 font-display text-[clamp(36px,4vw,56px)] font-medium text-ink">
              Behind <span className="text-olive">the</span> lens
            </h2>
            {(about.intro && !about.intro.startsWith('[DEV]') ? [about.intro] : BEHIND_THE_LENS).map((p) => (
              <p key={p} className="m-0 mb-5 text-lg leading-[1.8] last:mb-0">
                {p}
              </p>
            ))}
            <Link href="/about" className="cap mt-8 inline-block font-semibold">
              More about Keji →
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-[1360px] px-4 pb-20 sm:px-6 lg:px-10 lg:pb-24">
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] border-t border-olive p-0">
            {values.map((v) => (
              <li key={v.name} className="pt-7 pr-7 pb-2">
                <p className="m-0 mb-2.5 font-display text-2xl text-ink">{v.name}</p>
                <p className="m-0 text-[15px] leading-relaxed">{v.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Packages teaser */}
      {homePackages.length > 0 && (
        <section aria-labelledby="pk-h" className="mx-auto max-w-[1360px] px-4 pt-20 pb-20 sm:px-6 lg:px-10 lg:pt-28 lg:pb-24">
          <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
            <h2 id="pk-h" className="m-0 font-display text-[clamp(36px,4vw,56px)] font-medium text-ink">
              Packages
            </h2>
            <Link href="/packages" className="btn btn-line">
              See all packages &amp; rates
            </Link>
          </div>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 p-0">
            {homePackages.map((p) => {
              const cat = asObject<Category>(p.category)
              const price = displayPrice(p)
              const details = [p.duration, p.imageCount, p.turnaround].filter(Boolean).join(' · ')
              return (
                <li key={p.id}>
                  <Link
                    href={`/packages${cat ? `?tab=${cat.slug}` : ''}`}
                    className="flex h-full min-h-55 flex-col gap-3.5 border border-ink/20 bg-paper p-8 text-ink no-underline"
                  >
                    {cat && <span className="cap font-semibold text-olive-deep">{cat.name}</span>}
                    <span className="font-display text-[28px] leading-[1.15]">{p.name}</span>
                    <span className="text-[15px] leading-relaxed text-body">{details || p.tagline}</span>
                    <span className="mt-auto text-[15px]">
                      {price.prefix && <span className="text-muted">{price.prefix} </span>}
                      {price.amount ? (
                        <strong className="font-display text-2xl font-medium">{price.amount}</strong>
                      ) : (
                        <span className="text-muted">{price.label}</span>
                      )}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Testimonial */}
      {testimonial && (
        <section aria-label="Testimonial" className="mx-auto max-w-[1100px] px-4 pt-12 pb-24 text-center sm:px-6 lg:px-10 lg:pb-28">
          <div className="strip mx-auto mb-12 max-w-55" aria-hidden="true" />
          <figure className="m-0">
            <blockquote className="m-0 font-display text-[clamp(26px,3vw,40px)] leading-[1.35] text-ink">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="cap mt-7 text-muted">{testimonial.names}</figcaption>
          </figure>
        </section>
      )}

      {/* How booking works */}
      <section aria-labelledby="how-h" className="mx-auto max-w-[1360px] px-4 pb-24 sm:px-6 lg:px-10 lg:pb-28">
        <h2 id="how-h" className="m-0 mb-10 font-display text-4xl font-medium text-ink sm:text-[40px]">
          How booking <span className="text-olive">works</span>
        </h2>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 p-0">
          {steps.map((s, i) => (
            <li key={s.name} className="border-t border-ink pt-5.5">
              <p className="cap m-0 mb-3.5 font-semibold text-olive-deep">{String(i + 1).padStart(2, '0')}</p>
              <p className="m-0 mb-2.5 font-display text-[22px] text-ink">{s.name}</p>
              <p className="m-0 text-[15px] leading-relaxed">{s.line}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Closing CTA */}
      <section aria-labelledby="cta-h" className="bg-ink text-cream">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-12 px-4 py-24 sm:px-6 lg:px-10 lg:py-30">
          <div className="min-w-0 flex-[1_1_520px]">
            <h2 id="cta-h" className="m-0 font-display text-[clamp(40px,5vw,76px)] leading-[1.05] font-medium">
              Ready to tell
              <br />
              <span className="text-olive-light">your story?</span>
            </h2>
            <p className="m-0 mt-7 text-lg leading-[1.7] text-mist">Let’s create photographs you’ll be proud to keep forever.</p>
          </div>
          <div className="flex flex-[0_1_380px] flex-col gap-3.5">
            <Link href={BOOK_HREF} className="btn btn-cream">
              Enquire about your date
            </Link>
            {wa && (
              <a href={wa} className="btn btn-line-cream">
                WhatsApp{settings.phone ? ` ${settings.phone}` : ''}
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="mt-1.5 text-center text-[15px] text-mist hover:text-cream">
                {settings.email}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
