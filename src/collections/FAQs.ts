import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'
import { orderField } from '@/fields'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'question',
    group: 'Bookings',
    defaultColumns: ['question', 'group', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    {
      name: 'group',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Before you book', value: 'beforeYouBook' },
        { label: 'Packages', value: 'packages' },
        { label: 'General', value: 'general' },
      ],
      admin: { position: 'sidebar' },
    },
    orderField,
  ],
}
