import type { Field, GlobalConfig } from 'payload'

import { anyone, loggedIn } from '@/access'
import { slugField } from '@/fields'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

// The About page (docs/mockup/About.dc.html): a hero, then "frames" (chapters) with a sticky
// index, film-strip reels placed after chapters, a timeline, places and a closing call to
// action. Unpublished chapters are kept for drafting but never rendered.

/** Must the olive phrase appear in the text? Used by the two-tone headline fields. */
const oliveIn =
  (textField: string) =>
  (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
    const text = siblingData?.[textField]
    if (!value || typeof value !== 'string') return true
    return (typeof text === 'string' && text.includes(value)) || 'The olive words must appear exactly as written in the text.'
  }

const olive = (textField: string, description: string): Field => ({
  name: 'olive',
  label: 'Words in olive',
  type: 'text',
  admin: { description },
  validate: oliveIn(textField),
})

/** A hero button: label plus where it goes (WhatsApp uses the number in Site Settings). */
const heroButton = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text' },
        {
          name: 'link',
          type: 'select',
          defaultValue: 'portfolio',
          options: [
            { label: 'Portfolio', value: 'portfolio' },
            { label: 'Enquiry form', value: 'book' },
            { label: 'Packages', value: 'packages' },
            { label: 'WhatsApp (from Site Settings)', value: 'whatsapp' },
          ],
        },
      ],
    },
  ],
})

export const About: GlobalConfig = {
  slug: 'about',
  admin: { group: 'Settings' },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'kicker', type: 'text', admin: { description: 'Small line above the headline, e.g. "About · Photographer & filmmaker · Lagos"' } },
                {
                  name: 'statusPill',
                  type: 'group',
                  admin: { description: 'Small pill above the headline, with a pulsing dot.' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'text', type: 'text', admin: { description: 'e.g. Now booking 2027 weddings' } },
                        { name: 'show', type: 'checkbox', defaultValue: true },
                      ],
                    },
                  ],
                },
                {
                  name: 'headlineLines',
                  label: 'Headline lines',
                  type: 'array',
                  maxRows: 3,
                  admin: { description: 'Each line rises in separately. Accent lines are shown in olive.' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'text', type: 'text', required: true },
                        { name: 'accent', type: 'checkbox', defaultValue: false },
                      ],
                    },
                  ],
                },
                { name: 'intro', type: 'textarea' },
                heroButton('primaryButton', 'Solid button'),
                heroButton('secondaryButton', 'Outline button'),
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'portrait',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { description: 'A cut-out with a transparent background (PNG or WebP). Its alt text is required on upload.' },
                    },
                    { name: 'portraitMono', label: 'Show in black and white', type: 'checkbox', defaultValue: true },
                  ],
                },
                {
                  name: 'faceFrame',
                  type: 'group',
                  admin: {
                    description:
                      'Where the viewfinder corners sit over the portrait, as percentages of the image (left, top, width, height). Adjust if the photo changes.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'left', type: 'number', min: 0, max: 100, defaultValue: 29 },
                        { name: 'top', type: 'number', min: 0, max: 100, defaultValue: 8 },
                        { name: 'width', type: 'number', min: 1, max: 100, defaultValue: 33 },
                        { name: 'height', type: 'number', min: 1, max: 100, defaultValue: 39.5 },
                      ],
                    },
                  ],
                },
                { name: 'caption', type: 'text', admin: { description: 'The frame number is added automatically, e.g. "Keji, Lagos".' } },
                {
                  name: 'indexThumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Small photo above the chapter index (desktop).' },
                },
                {
                  name: 'shareImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Shown when the About page is shared on social media.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Chapters',
          fields: [
            {
              name: 'chapters',
              type: 'array',
              labels: { singular: 'Chapter', plural: 'Chapters' },
              admin: { description: 'Shown in this order as "Frame 01", "Frame 02"… Untick Published to keep a draft off the site.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'frameNumber', type: 'text', required: true, admin: { width: '20%', description: 'e.g. 01' } },
                    { name: 'title', type: 'text', required: true },
                    { name: 'published', type: 'checkbox', defaultValue: true },
                  ],
                },
                slugField('title', { unique: false }),
                {
                  name: 'pullQuote',
                  type: 'group',
                  fields: [
                    { name: 'text', type: 'textarea' },
                    {
                      type: 'row',
                      fields: [
                        olive('text', 'Part of the quote shown in olive'),
                        {
                          name: 'size',
                          type: 'select',
                          defaultValue: 'normal',
                          options: [
                            { label: 'Normal', value: 'normal' },
                            { label: 'Large', value: 'large' },
                          ],
                        },
                      ],
                    },
                  ],
                },
                { name: 'body', type: 'richText' },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'layout',
                      type: 'select',
                      required: true,
                      defaultValue: 'text',
                      options: [
                        { label: 'Text only', value: 'text' },
                        { label: 'Image right', value: 'image-right' },
                        { label: 'Image left', value: 'image-left' },
                        { label: 'Two images (diptych)', value: 'diptych' },
                      ],
                    },
                    {
                      name: 'extra',
                      label: 'Also show',
                      type: 'select',
                      defaultValue: 'none',
                      options: [
                        { label: 'Nothing', value: 'none' },
                        { label: 'Values', value: 'values' },
                        { label: 'Timeline', value: 'timeline' },
                        { label: 'Places', value: 'places' },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: { condition: (_, sibling) => sibling?.layout && sibling.layout !== 'text' },
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media' },
                    { name: 'caption', type: 'text' },
                  ],
                },
                {
                  type: 'row',
                  admin: { condition: (_, sibling) => sibling?.layout === 'diptych' },
                  fields: [
                    { name: 'image2', label: 'Second image', type: 'upload', relationTo: 'media' },
                    { name: 'caption2', label: 'Second caption', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Reels & lists',
          fields: [
            {
              name: 'reels',
              type: 'array',
              labels: { singular: 'Reel', plural: 'Reels' },
              admin: { description: 'Film strips of photos, shown after a chapter.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { description: 'e.g. Reel 01 / 03 · From the last season' } },
                    {
                      name: 'afterFrame',
                      label: 'After frame',
                      type: 'text',
                      required: true,
                      admin: { width: '20%', description: 'Frame number, e.g. 02' },
                      validate: (value: unknown, { data }: { data: { chapters?: { frameNumber?: string }[] } }) =>
                        !value ||
                        (data?.chapters ?? []).some((c) => c.frameNumber === value) ||
                        'No chapter has this frame number.',
                    },
                  ],
                },
                {
                  name: 'frames',
                  type: 'array',
                  minRows: 1,
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'image', type: 'upload', relationTo: 'media', required: true },
                        { name: 'caption', type: 'text', admin: { description: 'e.g. Kiki & Seye · Traditional wedding' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'timeline',
              type: 'array',
              admin: { description: 'Shown in the chapter set to "Also show: Timeline".' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'when', type: 'text', required: true, admin: { description: 'e.g. Within 72 hours' } },
                    { name: 'title', type: 'text', required: true },
                    { name: 'highlight', type: 'checkbox', admin: { description: 'Filled dot' } },
                  ],
                },
                { name: 'line', type: 'text', required: true },
              ],
            },
            {
              name: 'places',
              type: 'array',
              admin: { description: 'Places Keji has shot. The line only shows once there are at least two.' },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Closing',
          fields: [
            {
              name: 'closing',
              type: 'group',
              fields: [
                { name: 'kicker', type: 'text', admin: { description: 'e.g. End of reel' } },
                {
                  type: 'row',
                  fields: [{ name: 'heading', type: 'text' }, olive('heading', 'e.g. "your story"')],
                },
                { name: 'image', type: 'upload', relationTo: 'media' },
                {
                  name: 'buttons',
                  type: 'array',
                  maxRows: 3,
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true },
                        {
                          name: 'link',
                          type: 'select',
                          required: true,
                          defaultValue: 'book',
                          options: [
                            { label: 'Enquiry form', value: 'book' },
                            { label: 'Portfolio', value: 'portfolio' },
                            { label: 'Packages', value: 'packages' },
                            { label: 'WhatsApp (from Site Settings)', value: 'whatsapp' },
                          ],
                        },
                        {
                          name: 'style',
                          type: 'select',
                          defaultValue: 'line',
                          options: [
                            { label: 'Solid', value: 'solid' },
                            { label: 'Outline', value: 'line' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Homepage',
          description: 'The "Behind the lens" section on the homepage.',
          fields: [
            { name: 'intro', type: 'textarea', admin: { description: 'Short version, used on the homepage.' } },
            { name: 'portrait', type: 'upload', relationTo: 'media' },
            {
              name: 'values',
              type: 'array',
              maxRows: 6,
              admin: { description: 'Also shown on the About page, in the chapter set to "Also show: Values".' },
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
        },
      ],
    },
  ],
}
