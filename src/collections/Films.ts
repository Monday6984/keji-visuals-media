import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '@/access'
import { featuredField, orderField, slugField } from '@/fields'
import { isEmbedURL } from '@/lib/validation'

export const Films: CollectionConfig = {
  slug: 'films',
  admin: {
    useAsTitle: 'title',
    group: 'Portfolio',
    defaultColumns: ['title', 'type', 'featured', '_status'],
  },
  defaultSort: 'order',
  versions: { drafts: true },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'wedding',
      options: [
        { label: 'Wedding film', value: 'wedding' },
        { label: 'Brand film', value: 'brand' },
        { label: 'Documentary', value: 'documentary' },
        { label: 'Corporate milestone', value: 'corporate' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'embedUrl',
      type: 'text',
      required: true,
      admin: { description: 'YouTube or Vimeo link.' },
      validate: (value: unknown) =>
        (typeof value === 'string' && isEmbedURL(value)) || 'Use a YouTube or Vimeo link (https).',
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Still shown before the film plays.' },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'story',
      type: 'relationship',
      relationTo: 'stories',
      admin: { position: 'sidebar', description: 'Optional: the photo story from the same day.' },
    },
    featuredField,
    orderField,
  ],
}
