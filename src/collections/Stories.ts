import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '@/access'
import { featuredField, orderField, slugField } from '@/fields'
import { breathersOutsideImages, isEmbedURL } from '@/lib/validation'

import { FILMS_CATEGORY_SLUG } from './Categories'

// A gallery told in chapters. Rows are laid out on the site from each photo's aspect
// ratio; "breathers" are shown full width between rows.
export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    group: 'Portfolio',
    defaultColumns: ['title', 'category', 'date', 'featured', '_status'],
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
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Tolu & Femi"' } },
    slugField('title'),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      filterOptions: { slug: { not_equals: FILMS_CATEGORY_SLUG } },
      admin: { position: 'sidebar', description: 'Films are managed in the Films collection.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    { name: 'excerpt', type: 'textarea', admin: { description: 'One or two sentences for story cards.' } },
    {
      type: 'row',
      fields: [
        { name: 'date', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'location', type: 'text', admin: { description: 'e.g. "Ibadan"' } },
      ],
    },
    {
      name: 'chapters',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Chapter', plural: 'Chapters' },
      admin: { initCollapsed: false },
      fields: [
        { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Getting ready"' } },
        slugField('title', { unique: false }),
        {
          name: 'images',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          required: true,
          admin: { description: 'In the order they should appear. You can select or upload several at once.' },
        },
        {
          name: 'breathers',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          admin: { description: 'Optional: photos from this chapter to show full width, usually wide landscapes.' },
          validate: (value: unknown, { siblingData }: { siblingData: { images?: unknown[] } }) => {
            const outside = breathersOutsideImages(
              (value as Parameters<typeof breathersOutsideImages>[0]) ?? [],
              (siblingData?.images as Parameters<typeof breathersOutsideImages>[1]) ?? [],
            )
            return outside.length === 0 || 'Full-width photos must also be in this chapter’s images.'
          },
        },
      ],
    },
    {
      name: 'filmUrl',
      type: 'text',
      admin: { description: 'Optional YouTube or Vimeo link for this story’s film.' },
      validate: (value: unknown) =>
        !value || (typeof value === 'string' && isEmbedURL(value)) || 'Use a YouTube or Vimeo link (https).',
    },
    featuredField,
    orderField,
  ],
}
