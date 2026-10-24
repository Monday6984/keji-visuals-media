import Link from 'next/link'

import type { Category } from '@/payload-types'

import { categoryHref } from './categoryHref'

// Category filter: wraps on wide screens, swipes sideways on phones.
export function CategoryChips({ categories, current }: { categories: Category[]; current?: string }) {
  const chips = [{ slug: '', name: 'All', href: '/portfolio' }, ...categories.map((c) => ({ slug: c.slug, name: c.name, href: categoryHref(c) }))]

  return (
    // min-w-0 + max-w-full: inside a flex row the chips must scroll, not widen the page.
    <nav aria-label="Categories" className="max-w-full min-w-0">
      <ul className="m-0 flex list-none gap-2.5 overflow-x-auto p-0 pb-1 [scrollbar-width:none] max-sm:-mx-4 max-sm:px-4 sm:flex-wrap">
        {chips.map((c) => {
          const active = (current ?? '') === c.slug
          return (
            <li key={c.href} className="shrink-0">
              <Link
                href={c.href}
                aria-current={active ? 'page' : undefined}
                className={`cap flex min-h-11 items-center rounded-full border px-4.5 font-semibold no-underline ${
                  active ? 'border-ink bg-ink text-cream hover:text-cream' : 'border-ink/30 text-ink'
                }`}
              >
                {c.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
