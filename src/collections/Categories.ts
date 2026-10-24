import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'
import { orderField, slugField } from '@/fields'
import { revalidateHooks } from '@/lib/revalidate'
import { FILMS_CATEGORY_SLUG } from '@/lib/site'

export { FILMS_CATEGORY_SLUG }

// Seeded: Weddings, Pre-Weddings, Events, Portraits, Films.

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Portfolio',
    defaultColumns: ['name', 'slug', 'order'],
  },
  defaultSort: 'order',
  hooks: revalidateHooks,
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
