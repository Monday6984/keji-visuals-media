import Link from 'next/link'

import { Photo } from '@/components/Photo'
import { monthYear } from '@/lib/format'
import type { Category, Media, Story } from '@/payload-types'

type CardStory = Pick<Story, 'title' | 'slug' | 'category' | 'cover' | 'location' | 'date'>

export function StoryCard({ story, priority = false }: { story: CardStory; priority?: boolean }) {
  const category = typeof story.category === 'object' ? (story.category as Category) : null
  const cover = typeof story.cover === 'object' ? (story.cover as Media) : null
  if (!category) return null
  const meta = [category.name, story.location, monthYear(story.date)].filter(Boolean).join(' · ')

  return (
    <Link href={`/portfolio/${category.slug}/${story.slug}`} className="group block text-ink no-underline">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-paper">
        {cover && (
          <Photo
            media={cover}
            fill
            priority={priority}
            alt=""
            sizes="(min-width: 1360px) 420px, (min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
          />
        )}
      </div>
      <p className="cap m-0 mt-3.5 text-muted">{meta}</p>
      <h3 className="m-0 mt-1.5 font-display text-2xl font-medium group-hover:text-olive-deep">{story.title}</h3>
    </Link>
  )
}

export function StoryGrid({ stories }: { stories: CardStory[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((story, i) => (
        <li key={story.slug}>
          <StoryCard story={story} priority={i < 3} />
        </li>
      ))}
    </ul>
  )
}
