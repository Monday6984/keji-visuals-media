import type { Field, TextField } from 'payload'

import { slugify } from '@/lib/validation'

/** URL slug generated from `source` when left blank; always normalised. */
export const slugField = (source = 'title', { unique = true } = {}): TextField => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique,
  index: unique,
  admin: {
    position: unique ? 'sidebar' : undefined,
    description: 'Used in the web address. Leave blank to create it from the title.',
  },
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) => {
        const raw = typeof value === 'string' && value.trim() ? value : siblingData?.[source]
        return typeof raw === 'string' ? slugify(raw) : value
      },
    ],
  },
})

/** Manual sort order: lower numbers come first. */
export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 0,
  admin: {
    position: 'sidebar',
    description: 'Lower numbers appear first.',
  },
}

export const featuredField: Field = {
  name: 'featured',
  type: 'checkbox',
  defaultValue: false,
  admin: { position: 'sidebar' },
}
