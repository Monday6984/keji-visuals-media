import type { CollectionConfig } from 'payload'

import { loggedIn, whereOrLoggedIn } from '@/access'
import { orderField } from '@/fields'
import { priceFields } from '@/fields/price'
import { revalidateHooks } from '@/lib/revalidate'

// Add-ons are a single shared list in Site Settings → Booking, not per package.
export const Packages: CollectionConfig = {
  slug: 'packages',
  admin: {
    useAsTitle: 'name',
    group: 'Bookings',
    defaultColumns: ['name', 'category', 'priceDisplay', 'priceNGN', 'visible'],
  },
  defaultSort: 'order',
  hooks: revalidateHooks,
  access: {
    read: whereOrLoggedIn('visible'),
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'e.g. "The Full Story"' } },
        { name: 'tier', type: 'text', admin: { description: 'Small label above the name, e.g. "Signature"' } },
      ],
    },
    { name: 'tagline', type: 'text', admin: { description: 'e.g. "Traditional and white wedding — one story, two days."' } },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar', description: 'Which tab it appears under on the Packages page.' },
    },
    ...priceFields(),
    {
      type: 'row',
      fields: [
        { name: 'duration', type: 'text', admin: { description: 'e.g. "8 hours" or "Both days"' } },
        { name: 'imageCount', type: 'text', admin: { description: 'e.g. "300+ edited images"' } },
        { name: 'turnaround', type: 'text', admin: { description: 'e.g. "Delivered in 4 weeks"' } },
      ],
    },
    {
      name: 'inclusions',
      type: 'array',
      labels: { singular: 'Inclusion', plural: 'Inclusions' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'mostBooked',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Highlights this package on its tab.' },
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Untick to hide from the site without deleting.' },
    },
    orderField,
  ],
}
