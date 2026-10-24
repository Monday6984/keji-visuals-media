import type { Metadata } from 'next'
import Link from 'next/link'

import { CategoryChips } from '@/components/portfolio/CategoryChips'
import { categoryHref } from '@/components/portfolio/categoryHref'
import { StoryGrid } from '@/components/portfolio/StoryCard'
import { getCategories, getFilmCount, getStories } from '@/lib/data'
import { FILMS_CATEGORY_SLUG } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Weddings, pre-weddings, events, portraits and films by Keji Visuals.',
}

export default async function PortfolioPage() {
  const [categories, stories, filmCount] = await Promise.all([getCategories(), getStories(), getFilmCount()])

  const countFor = (slug: string, id: number) =>
    slug === FILMS_CATEGORY_SLUG
      ? { n: filmCount, unit: filmCount === 1 ? 'film' : 'films' }
      : (() => {
          const n = stories.filter((s) => (typeof s.category === 'object' ? s.category?.id : s.category) === id).length
          return { n, unit: n === 1 ? 'story' : 'stories' }
        })()

  return (
    <>
      <header className="mx-auto max-w-[1360px] px-4 pt-14 pb-10 sm:px-6 lg:px-10 lg:pt-18">
        <p className="cap m-0 mb-5 font-semibold text-olive-deep">The work</p>
        <h1 className="m-0 font-display text-5xl leading-[1.02] font-medium text-ink sm:text-7xl">
          Every story, <span className="text-olive">as it happened.</span>
        </h1>
        <p className="m-0 mt-6 max-w-[560px] text-lg leading-[1.7]">
          Explore by occasion. Every story is shown the way it happened — not just the highlights.
        </p>
      </header>

      <section aria-labelledby="index-h" className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <h2 id="index-h" className="sr-only">
          Categories
        </h2>
        <ol className="m-0 list-none border-t border-ink/18 p-0">
          {categories.map((c, i) => {
            const { n, unit } = countFor(c.slug, c.id)
            return (
              <li key={c.id} className="border-b border-ink/18">
                <Link href={categoryHref(c)} className="group flex flex-wrap items-center gap-x-6 gap-y-2 py-6.5 text-ink no-underline">
                  <span className="cap w-8 font-semibold text-olive-deep">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-[200px] flex-[0_0_260px] font-display text-3xl group-hover:text-olive-deep sm:text-4xl">{c.name}</span>
                  {c.line && <span className="flex-[1_1_320px] text-[15px] leading-relaxed text-body">{c.line}</span>}
                  <span className="cap ml-auto text-muted">
                    {n} {unit} →
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="stories-h" className="mx-auto max-w-[1360px] px-4 pt-20 pb-24 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 id="stories-h" className="m-0 font-display text-3xl font-medium text-ink sm:text-[40px]">
            All <span className="text-olive">stories</span>
          </h2>
          <CategoryChips categories={categories} />
        </div>
        {stories.length ? (
          <StoryGrid stories={stories} />
        ) : (
          <p className="m-0 text-lg">New stories are on their way. In the meantime, see recent work on Instagram.</p>
        )}
      </section>
    </>
  )
}
