import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FilmEmbed } from '@/components/FilmEmbed'
import { Photo } from '@/components/Photo'
import { Chapter, type ChapterPhoto } from '@/components/story/Chapter'
import { Frame } from '@/components/story/Frame'
import { Lightbox } from '@/components/story/Lightbox'
import { LoadMore } from '@/components/story/LoadMore'
import { getSiteSettings, getStories, getStory } from '@/lib/data'
import { monthYear, twoTone } from '@/lib/format'
import { BOOK_HREF, whatsappHref } from '@/lib/site'
import type { Category, Media } from '@/payload-types'

type Params = { category: string; story: string }

const INITIAL_PHOTOS = 30
const isMedia = (m: unknown): m is Media => Boolean(m && typeof m === 'object' && 'id' in m)

type StoryChapters = NonNullable<Awaited<ReturnType<typeof getStory>>>['chapters']

/**
 * Numbers every frame across the story (the opener is No. 001) and splits the chapters
 * into those shown straight away (up to ~30 photos) and those behind "Show more".
 */
function layoutChapters(source: StoryChapters, hasCover: boolean) {
  let n = hasCover ? 1 : 0
  const chapters = source.map((chapter, i) => {
    const breathers = new Set((chapter.breathers ?? []).map((b) => (isMedia(b) ? b.id : b)))
    const photos: ChapterPhoto[] = chapter.images.filter(isMedia).map((media) => ({
      media,
      n: ++n,
      breather: breathers.has(media.id),
    }))
    return { id: chapter.slug || `chapter-${i + 1}`, no: String(i + 1).padStart(2, '0'), title: chapter.title, photos }
  })

  let shown = hasCover ? 1 : 0
  let split = chapters.length
  for (let i = 0; i < chapters.length; i++) {
    shown += chapters[i].photos.length
    if (shown > INITIAL_PHOTOS) {
      split = Math.max(i, 1)
      break
    }
  }
  const later = chapters.slice(split)
  return {
    chapters,
    totalFrames: n,
    visible: chapters.slice(0, split),
    later,
    laterCount: later.reduce((s, c) => s + c.photos.length, 0),
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  const stories = await getStories()
  return stories.flatMap((s) =>
    typeof s.category === 'object' && s.category ? [{ category: s.category.slug, story: s.slug }] : [],
  )
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { story: slug } = await params
  const story = await getStory(slug)
  if (!story) return {}
  const cover = isMedia(story.cover) ? story.cover : null
  const share = cover?.sizes?.md?.url ? cover.sizes.md : null
  return {
    title: story.title,
    description: story.excerpt ?? undefined,
    openGraph: share?.url
      ? { images: [{ url: share.url, width: share.width ?? undefined, height: share.height ?? undefined, alt: cover?.alt }] }
      : undefined,
  }
}

export default async function StoryPage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, story: slug } = await params
  const [story, settings] = await Promise.all([getStory(slug), getSiteSettings()])
  const category = story && typeof story.category === 'object' ? (story.category as Category) : null
  if (!story || !category || category.slug !== categorySlug) notFound()

  const cover = isMedia(story.cover) ? story.cover : null

  const { chapters, totalFrames, visible, later, laterCount } = layoutChapters(story.chapters, Boolean(cover))

  const siblings = await getStories(category.id)
  const index = siblings.findIndex((s) => s.id === story.id)
  const next = siblings.length > 1 ? siblings[(index + 1) % siblings.length] : null
  const nextCover = next && isMedia(next.cover) ? next.cover : null

  const [titleInk, titleOlive] = twoTone(story.title)
  const when = monthYear(story.date)
  const wa = whatsappHref(settings.whatsapp, `Hi Keji, I'm planning something like "${story.title}".`)

  return (
    <article id="story-gallery">
      <Lightbox galleryId="story-gallery" />

      <header className="mx-auto max-w-[1360px] px-4 pt-14 pb-10 sm:px-6 lg:px-10 lg:pt-18 lg:pb-12">
        <p className="cap m-0 mb-5 font-semibold text-muted">
          <Link href={`/portfolio/${category.slug}`} className="text-muted">
            {category.name}
          </Link>
          {story.location && ` · ${story.location}`}
          {when && ` · ${when}`}
        </p>
        <h1 className="m-0 font-display text-5xl leading-[1.02] font-medium text-ink sm:text-6xl lg:text-[clamp(48px,6vw,92px)]">
          {titleInk} <span className="text-olive-display">{titleOlive}</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-start justify-between gap-10">
          {story.excerpt && <p className="m-0 max-w-[620px] flex-[1_1_460px] text-lg leading-[1.8]">{story.excerpt}</p>}
          <dl className="m-0 grid flex-[0_1_360px] grid-cols-2 gap-x-7 gap-y-4.5">
            {story.location && (
              <div>
                <dt className="cap text-muted">Location</dt>
                <dd className="m-0 mt-1.5 text-[15px]">{story.location}</dd>
              </div>
            )}
            <div>
              <dt className="cap text-muted">Coverage</dt>
              <dd className="m-0 mt-1.5 text-[15px]">{story.filmUrl ? 'Photo + film' : 'Photography'}</dd>
            </div>
            <div>
              <dt className="cap text-muted">Chapters</dt>
              <dd className="m-0 mt-1.5 text-[15px]">{chapters.length}</dd>
            </div>
            <div>
              <dt className="cap text-muted">Frames</dt>
              <dd className="m-0 mt-1.5 text-[15px]">{totalFrames} shown</dd>
            </div>
          </dl>
        </div>
      </header>

      {cover && (
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
          <Frame
            media={cover}
            n={1}
            chapter="Opener"
            fill
            priority
            sizes="(min-width: 1360px) 1280px, 100vw"
            className="aspect-[4/5] sm:aspect-[21/9]"
          />
        </div>
      )}

      {(chapters.length > 1 || story.filmUrl) && (
        <nav aria-label="Chapters" className="mx-auto mt-12 max-w-[1360px] px-4 sm:px-6 lg:px-10">
          <ul className="m-0 flex list-none gap-2.5 overflow-x-auto border-y border-ink/18 p-0 py-4 [scrollbar-width:none] max-md:-mx-4 max-md:px-4">
            {chapters.map((c) => (
              <li key={c.id} className="shrink-0">
                <a href={`#${c.id}`} className="cap flex min-h-11 items-center rounded-full border border-ink/25 px-4.5 font-semibold text-ink no-underline">
                  {c.no} · {c.title}
                </a>
              </li>
            ))}
            {story.filmUrl && (
              <li className="shrink-0">
                <a href="#film" className="cap flex min-h-11 items-center rounded-full bg-ink px-4.5 font-semibold text-cream no-underline hover:text-cream">
                  ▶ The film
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}

      {visible.map((c) => (
        <Chapter key={c.id} {...c} />
      ))}
      {later.length > 0 && (
        <LoadMore remaining={laterCount}>
          {later.map((c) => (
            <Chapter key={c.id} {...c} />
          ))}
        </LoadMore>
      )}

      {story.filmUrl && (
        <section id="film" aria-labelledby="film-h" className="mx-auto max-w-[1360px] scroll-mt-24 px-4 pt-20 sm:px-6 lg:px-10 lg:pt-28">
          <div className="mb-7 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="cap font-semibold text-olive-deep">The film</span>
            <h2 id="film-h" className="m-0 font-display text-3xl font-medium text-ink sm:text-[40px]">
              Let people <span className="text-olive-display">feel it</span>
            </h2>
          </div>
          <FilmEmbed
            url={story.filmUrl}
            title={`${story.title} — film`}
            poster={cover ? <Photo media={cover} fill sizes="(min-width: 1360px) 1280px, 100vw" alt="" /> : null}
          />
        </section>
      )}

      <section className="mx-auto max-w-[1360px] px-4 py-20 sm:px-6 lg:px-10 lg:py-30">
        <div className="strip mb-16 lg:mb-18" aria-hidden="true" />
        <div className="flex flex-wrap items-stretch gap-12">
          <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5.5 bg-ink p-8 text-cream sm:p-14">
            <h2 className="m-0 font-display text-4xl leading-[1.08] font-medium sm:text-[44px]">
              Planning a day
              <br />
              <span className="text-olive-light">like this?</span>
            </h2>
            <p className="m-0 text-[17px] leading-[1.7] text-mist">Tell us about your date and what you have in mind.</p>
            <div className="mt-auto flex flex-wrap gap-3">
              <Link href={`${BOOK_HREF}?type=${encodeURIComponent(category.slug)}`} className="btn btn-cream">
                Book a similar session
              </Link>
              {wa && (
                <a href={wa} className="btn btn-line-cream">
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {next && typeof next.category === 'object' && next.category && (
            <Link href={`/portfolio/${next.category.slug}/${next.slug}`} className="flex min-w-0 flex-[1_1_440px] flex-col text-ink no-underline">
              <span className="cap mb-3.5 text-muted">Next story →</span>
              <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                {nextCover && <Photo media={nextCover} fill sizes="(min-width: 1024px) 640px, 100vw" alt="" />}
              </div>
              <span className="mt-4 font-display text-[28px]">{next.title}</span>
            </Link>
          )}
        </div>
      </section>
    </article>
  )
}
