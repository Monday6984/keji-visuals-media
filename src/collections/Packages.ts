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
      label: 'Highlight this package',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Dark, raised card that stands out on its tab. Use for one package per tab.' },
    },
    {
      name: 'badge',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Small label on a highlighted card, e.g. "Recommended". Only make claims Keji can stand behind.',
        condition: (_, sibling) => Boolean(sibling?.mostBooked),
      },
    },
    {
      name: 'accent',
      label: 'Tier colour',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Bronze', value: 'bronze' },
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' },
      ],
      admin: { position: 'sidebar', description: 'Metallic accent along the top of the card.' },
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
