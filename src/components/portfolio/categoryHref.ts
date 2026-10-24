import { FILMS_CATEGORY_SLUG } from '@/lib/site'

/** The Films category lives at /films (the Films collection); others under /portfolio. */
export const categoryHref = (category: { slug: string }) =>
  category.slug === FILMS_CATEGORY_SLUG ? '/films' : `/portfolio/${category.slug}`
