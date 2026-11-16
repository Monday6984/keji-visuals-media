import Link from 'next/link'

import { BusinessJsonLd } from '@/components/BusinessJsonLd'
import { Landing } from '@/components/home/Landing'
import { TestimonialSlider } from '@/components/home/TestimonialSlider'
import { Photo } from '@/components/Photo'
import { getAbout, getHome, getSiteSettings, getStories, getTestimonials } from '@/lib/data'
import { monthYear } from '@/lib/format'
import { displayPrice } from '@/lib/price'
import { BOOK_HREF, formatIntlNumber, telHref, whatsappHref } from '@/lib/site'
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
  const [settings, home, about, stories, testimonials] = await Promise.all([
    getSiteSettings(),
    getHome(),
    getAbout(),
    getStories(),
    getTestimonials(),
  ])

  const featured = stories.filter((s) => s.featured).slice(0, 3)
  const homePackages = (settings.homePackages ?? []).map((p) => asObject<Package>(p)).filter((p): p is Package => Boolean(p))
  // The testimonial chosen in Site Settings leads; the rest follow in their own order.
  const leadId = asObject<Testimonial>(settings.homeTestimonial)?.id
  const quotes = [...testimonials]
    .sort((a, b) => Number(b.id === leadId) - Number(a.id === leadId))
    .map(({ id, names, quote }) => ({ id, names, quote }))
  const portrait = isMedia(about.portrait) ? about.portrait : null
  const values = about.values?.length ? about.values : DEFAULT_VALUES
  const wa = whatsappHref(settings.whatsapp)

  const steps = [
    { name: 'Enquire', line: 'Tell us your date, location and the kind of day you’re planning.' },
    { name: 'Let’s talk', line: 'A short call to understand your story and what coverage it needs.' },
    {
      name: 'Secure your date',
      line: settings.depositPercent
        ? `A ${settings.depositPercent}% booking payment holds your date.`
        : 'Your booking payment holds the date.',
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
      <h1 className="sr-only">Keji Visuals — wedding photography and film</h1>
      <Landing landing={home.landing} settings={settings} />
      {/* Target of the landing's "Scroll" link, clear of the sticky header. */}
      <div id="continue" className="scroll-mt-24" />

      {/* Selected stories */}
      {featured.length > 0 && (
        <section aria-labelledby="stories-h" className="mx-auto max-w-[1360px] px-4 pt-10 pb-24 sm:px-6 lg:px-10 lg:pb-30">
          <div className="mb-9 flex flex-wrap items-baseline justify-between gap-6">
            <h2 id="stories-h" className="m-0 font-display text-[28px] font-medium text-ink sm:text-[34px]">
              Selected <span className="text-olive-display">stories</span>
            </h2>
            <Link href="/portfolio" className="cap font-semibold">
              All stories →
            </Link>
          </div>
          <div className="grid gap-x-7 gap-y-10 md:grid-cols-3">
            {featured.map((s) => {
              const cat = asObject<Category>(s.category)
              const cover = isMedia(s.cover) ? s.cover : null
              if (!cat) return null
              const meta = [cat.name, s.location, monthYear(s.date)].filter(Boolean).join(' · ')
              return (
                <Link
                  key={s.id}
                  href={`/portfolio/${cat.slug}/${s.slug}`}
                  className="group min-w-0 text-ink no-underline"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                    {cover && (
                      <Photo
                        media={cover}
                        fill
                        alt=""
                        sizes="(min-width: 1360px) 420px, (min-width: 768px) 31vw, 100vw"
                        className="transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
                      />
                    )}
                  </div>
                  <p className="cap m-0 mt-4 mb-1.5 text-muted">{meta}</p>
                  <p className="m-0 font-display text-2xl group-hover:text-olive-deep">{s.title}</p>
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
            <h2 id="behind-h" className="m-0 mb-8 font-display text-[clamp(28px,3vw,42px)] font-medium text-ink">
              Behind <span className="text-olive-display">the</span> lens
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
            <h2 id="pk-h" className="m-0 font-display text-[clamp(28px,3vw,42px)] font-medium text-ink">
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

      {/* Testimonials */}
      {quotes.length > 0 && (
        <section aria-labelledby="words-h" className="mx-auto max-w-[1100px] px-4 pt-12 pb-24 text-center sm:px-6 lg:px-10 lg:pb-28">
          <div className="strip mx-auto mb-10 max-w-55" aria-hidden="true" />
          <h2 id="words-h" className="cap m-0 mb-8 font-semibold text-olive-deep">
            Kind words
          </h2>
          <TestimonialSlider quotes={quotes} />
        </section>
      )}

      {/* How booking works */}
      <section aria-labelledby="how-h" className="mx-auto max-w-[1360px] px-4 pb-24 sm:px-6 lg:px-10 lg:pb-28">
        <h2 id="how-h" className="m-0 mb-10 font-display text-[28px] font-medium text-ink sm:text-[34px]">
          How booking <span className="text-olive-display">works</span>
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
      <section aria-labelledby="cta-h" className="kv-dark-section bg-ink text-cream">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-12 px-4 py-24 sm:px-6 lg:px-10 lg:py-30">
          <div className="min-w-0 flex-[1_1_520px]">
            <h2 id="cta-h" className="m-0 font-display text-[clamp(30px,3.6vw,54px)] leading-[1.05] font-medium">
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
                WhatsApp {formatIntlNumber(settings.whatsapp)}
              </a>
            )}
            {(settings.email || settings.phone) && (
              <p className="m-0 mt-1.5 flex flex-wrap justify-center gap-x-5 gap-y-1 text-center text-[15px]">
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="text-mist hover:text-cream">
                    {settings.email}
                  </a>
                )}
                {settings.phone && (
                  <a href={telHref(settings.phone)!} className="text-mist hover:text-cream">
                    Call {settings.phone}
                  </a>
                )}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
