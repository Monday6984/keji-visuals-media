import type { MetadataRoute } from 'next'

import { getCategories, getStories } from '@/lib/data'
import { FILMS_CATEGORY_SLUG } from '@/lib/site'

// Empty until launch (ALLOW_INDEXING=true in Production), like robots.txt.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (process.env.ALLOW_INDEXING !== 'true' || !base) return []

  const [categories, stories] = await Promise.all([getCategories(), getStories()])
  const page = (path: string, priority = 0.6, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path}`,
    priority,
    ...(lastModified ? { lastModified } : {}),
  })

  return [
    page('/', 1),
    page('/portfolio', 0.9),
    page('/packages', 0.9),
    page('/films', 0.8),
    page('/about', 0.7),
    page('/contact', 0.8),
    page('/privacy', 0.2),
    page('/booking-terms', 0.2),
    ...categories.filter((c) => c.slug !== FILMS_CATEGORY_SLUG).map((c) => page(`/portfolio/${c.slug}`, 0.8, c.updatedAt)),
    ...stories.flatMap((s) =>
      typeof s.category === 'object' && s.category ? [page(`/portfolio/${s.category.slug}/${s.slug}`, 0.7, s.updatedAt)] : [],
    ),
  ]
}
