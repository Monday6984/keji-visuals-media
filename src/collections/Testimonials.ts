import type { CollectionConfig } from 'payload'

import { loggedIn, whereOrLoggedIn } from '@/access'
import { featuredField, orderField } from '@/fields'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'names',
    group: 'Bookings',
    defaultColumns: ['names', 'category', 'consent', 'featured'],
  },
  defaultSort: 'order',
  access: {
    // Only shown publicly once the client has agreed to it being published.
    read: whereOrLoggedIn('consent'),
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'names', type: 'text', required: true, admin: { description: 'e.g. "Ada & Tunde"' } },
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'consent',
      label: 'Client has agreed to this being published',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Testimonials stay hidden from the site until this is ticked.' },
    },
    { name: 'category', type: 'relationship', relationTo: 'categories', admin: { position: 'sidebar' } },
    { name: 'story', type: 'relationship', relationTo: 'stories', admin: { position: 'sidebar' } },
    featuredField,
    orderField,
  ],
}
