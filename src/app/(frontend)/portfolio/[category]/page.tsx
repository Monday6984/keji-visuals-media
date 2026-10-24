import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

import { CategoryChips } from '@/components/portfolio/CategoryChips'
import { StoryGrid } from '@/components/portfolio/StoryCard'
import { getCategories, getStories } from '@/lib/data'
import { twoTone } from '@/lib/format'
import { FILMS_CATEGORY_SLUG } from '@/lib/site'

type Params = { category: string }

export async function generateStaticParams(): Promise<Params[]> {
  return (await getCategories()).filter((c) => c.slug !== FILMS_CATEGORY_SLUG).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category: slug } = await params
  const category = (await getCategories()).find((c) => c.slug === slug)
  return category ? { title: category.name, description: category.line ?? undefined } : {}
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params
  if (slug === FILMS_CATEGORY_SLUG) permanentRedirect('/films')

  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const stories = await getStories(category.id)
  const [ink, olive] = twoTone(category.name)

  return (
    <>
      <header className="mx-auto max-w-[1360px] px-4 pt-14 pb-10 sm:px-6 lg:px-10 lg:pt-18">
        <p className="cap m-0 mb-5 font-semibold text-olive-deep">The work</p>
        <h1 className="m-0 font-display text-5xl leading-[1.02] font-medium text-ink sm:text-7xl">
          {ink ? (
            <>
              {ink} <span className="text-olive-display">{olive}</span>
            </>
          ) : (
            category.name
          )}
        </h1>
        {(category.intro || category.line) && (
          <p className="m-0 mt-6 max-w-[620px] text-lg leading-[1.7]">{category.intro || category.line}</p>
        )}
        <div className="mt-10">
          <CategoryChips categories={categories} current={category.slug} />
        </div>
      </header>

      <section aria-label={`${category.name} stories`} className="mx-auto max-w-[1360px] px-4 pt-6 pb-24 sm:px-6 lg:px-10">
        {stories.length ? (
          <StoryGrid stories={stories} />
        ) : (
          <p className="m-0 text-lg">New {category.name.toLowerCase()} stories are on their way.</p>
        )}
      </section>
    </>
  )
}
