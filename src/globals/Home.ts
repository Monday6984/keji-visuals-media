import type { GlobalConfig } from 'payload'

import { anyone, loggedIn } from '@/access'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'
import { isVideoFileURL } from '@/lib/validation'

// The homepage's full-screen landing (docs/mockup/HomeLanding.dc.html): one background per
// category, revealed as visitors hover/focus the category list (auto-advancing on touch).
// The rest of the homepage is still set in Site Settings → Homepage.
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  admin: { group: 'Settings' },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      name: 'landing',
      type: 'group',
      fields: [
        { name: 'kicker', type: 'text', admin: { description: 'Small line above the list, e.g. "Your moment. Your story."' } },
        {
          name: 'items',
          type: 'array',
          maxRows: 6,
          labels: { singular: 'Category', plural: 'Categories' },
          admin: { description: 'Shown in this order. The first background loads first, so make it a strong photo.' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
                { name: 'label', type: 'text', admin: { description: 'Leave blank to use the category name.' } },
              ],
            },
            { name: 'description', type: 'text', admin: { description: 'e.g. Traditional & white' } },
            {
              name: 'background',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { description: 'A landscape photo; text sits over the left side.' },
            },
            {
              name: 'mobilePosition',
              label: 'Phone position (%)',
              type: 'number',
              min: 0,
              max: 100,
              admin: {
                description:
                  'Phones show a narrow upright slice of this photo. 0 = left edge, 50 = centre, 100 = right edge. Leave blank to use the photo’s focal point.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'videoUrl',
                  label: 'Video (optional)',
                  type: 'text',
                  admin: { description: 'A direct https link to an .mp4 or .webm file. Plays muted, on desktop only.' },
                  validate: (value: unknown) =>
                    !value || (typeof value === 'string' && isVideoFileURL(value)) || 'Use a direct https link ending in .mp4 or .webm.',
                },
                {
                  name: 'poster',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Required with a video: shown before it loads, on phones and with reduced motion.' },
                  validate: (value: unknown, { siblingData }: { siblingData: { videoUrl?: string | null } }) =>
                    !siblingData?.videoUrl || Boolean(value) || 'Add a poster image for the video.',
                },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'introEnabled', label: 'Play the intro (once per visit)', type: 'checkbox', defaultValue: true },
            { name: 'footerLeft', type: 'text', admin: { description: 'Bottom-left line, e.g. "Lagos · Across Nigeria & beyond"' } },
          ],
        },
      ],
    },
  ],
}
