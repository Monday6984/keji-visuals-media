import type { GlobalConfig } from 'payload'

import { anyone, loggedIn } from '@/access'

export const About: GlobalConfig = {
  slug: 'about',
  admin: { group: 'Settings' },
  access: { read: anyone, update: loggedIn },
  fields: [
    { name: 'headline', type: 'text', admin: { description: 'e.g. "Behind the lens"' } },
    { name: 'intro', type: 'textarea', admin: { description: 'Short version, used on the homepage.' } },
    { name: 'bio', type: 'richText' },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    {
      name: 'values',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'line', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
