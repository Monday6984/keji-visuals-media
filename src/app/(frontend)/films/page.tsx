import type { Metadata } from 'next'
import Link from 'next/link'

import { FilmEmbed } from '@/components/FilmEmbed'
import { Photo } from '@/components/Photo'
import { getFilms } from '@/lib/data'
import { BOOK_HREF } from '@/lib/site'
import type { Category, Film, Media, Story } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Films',
  description: 'Wedding films, brand films, documentaries and corporate milestones by Keji Visuals.',
}

const GROUPS: { type: Film['type']; title: [string, string] }[] = [
  { type: 'wedding', title: ['Wedding', 'films'] },
  { type: 'brand', title: ['Brand', 'films'] },
  { type: 'documentary', title: ['Documentary', 'films'] },
  { type: 'corporate', title: ['Corporate', 'milestones'] },
]

export default async function FilmsPage() {
  const films = await getFilms()
  const groups = GROUPS.map((g) => ({ ...g, films: films.filter((f) => f.type === g.type) })).filter((g) => g.films.length)

  return (
    <>
      <header className="mx-auto max-w-[1360px] px-4 pt-14 pb-10 sm:px-6 lg:px-10 lg:pt-18">
        <p className="cap m-0 mb-5 font-semibold text-olive-deep">Films</p>
        <h1 className="m-0 font-display text-[clamp(48px,6vw,88px)] leading-[1.02] font-medium text-ink">
          Let people <span className="text-olive">feel it</span>
        </h1>
        <p className="m-0 mt-7 max-w-[560px] text-lg leading-[1.75]">
          Films that don’t just show your story, but let people feel it — weddings, brands, documentaries and milestones.
        </p>
        {groups.length > 1 && (
          <nav aria-label="Film types" className="mt-10">
            <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
              {groups.map((g) => (
                <li key={g.type}>
                  <a href={`#${g.type}`} className="cap flex min-h-11 items-center rounded-full border border-ink/30 px-4.5 font-semibold text-ink no-underline">
                    {g.title.join(' ')}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {groups.length === 0 && (
        <p className="mx-auto max-w-[1360px] px-4 pb-24 text-lg sm:px-6 lg:px-10">New films are on their way.</p>
      )}

      {groups.map((g) => (
        <section key={g.type} id={g.type} aria-labelledby={`${g.type}-h`} className="mx-auto max-w-[1360px] scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-10">
          <h2 id={`${g.type}-h`} className="m-0 mb-8 border-t border-ink/18 pt-8 font-display text-4xl font-medium text-ink">
            {g.title[0]} <span className="text-olive">{g.title[1]}</span>
          </h2>
          <div className="grid gap-x-8 gap-y-14 lg:grid-cols-2">
            {g.films.map((film) => {
              const poster = typeof film.poster === 'object' ? (film.poster as Media) : null
              const story = typeof film.story === 'object' && film.story ? (film.story as Story) : null
              const storyCategory = story && typeof story.category === 'object' ? (story.category as Category) : null
              return (
                <article key={film.id} aria-labelledby={`film-${film.id}`}>
                  <FilmEmbed
                    url={film.embedUrl}
                    title={film.title}
                    poster={poster ? <Photo media={poster} fill alt="" sizes="(min-width: 1360px) 640px, (min-width: 1024px) 48vw, 100vw" /> : null}
                  />
                  <h3 id={`film-${film.id}`} className="m-0 mt-5 font-display text-[28px] font-medium text-ink">
                    {film.title}
                  </h3>
                  {film.description && <p className="m-0 mt-2 max-w-prose leading-relaxed">{film.description}</p>}
                  {story && storyCategory && (
                    <Link href={`/portfolio/${storyCategory.slug}/${story.slug}`} className="cap mt-4 inline-block font-semibold">
                      See the photographs →
                    </Link>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      ))}

      <section className="bg-ink text-cream">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-10 px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
          <h2 className="m-0 font-display text-[clamp(36px,4.4vw,64px)] leading-[1.05] font-medium">
            A film for <span className="text-olive-light">your story?</span>
          </h2>
          <Link href={`${BOOK_HREF}?type=films`} className="btn btn-cream">
            Enquire about a film
          </Link>
        </div>
      </section>
    </>
  )
}
