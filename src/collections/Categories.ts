import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'
import { orderField, slugField } from '@/fields'

// Seeded: Weddings, Pre-Weddings, Events, Portraits, Films. The Films category page
// redirects to /films, which lists the Films collection, so stories can't be filed under it.
export const FILMS_CATEGORY_SLUG = 'films'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Portfolio',
    defaultColumns: ['name', 'slug', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'line',
      type: 'text',
      admin: { description: 'One sentence shown in the category index, e.g. "Natural, romantic and uniquely yours."' },
    },
    { name: 'intro', type: 'textarea', admin: { description: 'Opening paragraph on the category page.' } },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    orderField,
  ],
}
