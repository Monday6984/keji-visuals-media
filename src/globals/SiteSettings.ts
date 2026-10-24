import type { GlobalConfig } from 'payload'

import { anyone, loggedIn, loggedInField } from '@/access'
import { priceFields } from '@/fields/price'
import { isWhatsAppNumber } from '@/lib/validation'
import { revalidateGlobalAfterChange } from '@/lib/revalidate'

// The logo lives in the codebase (SVG uploads are an XSS risk), so it is not a setting.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', admin: { description: 'Shown on the site.' } },
                {
                  name: 'enquiryRecipient',
                  type: 'email',
                  access: { read: loggedInField },
                  admin: { description: 'Where enquiry emails are sent. Not shown publicly.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', admin: { description: 'As displayed, e.g. "+234 903 491 7020"' } },
                {
                  name: 'whatsapp',
                  label: 'WhatsApp number',
                  type: 'text',
                  admin: { description: 'Country code + number, digits only, e.g. 2349034917020' },
                  validate: (value: unknown) =>
                    !value ||
                    (typeof value === 'string' && isWhatsAppNumber(value)) ||
                    'Digits only, starting with the country code (no +, spaces or leading 0).',
                },
              ],
            },
            {
              name: 'socials',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: ['Instagram', 'TikTok', 'YouTube', 'Vimeo', 'Facebook', 'X'].map((p) => ({
                        label: p,
                        value: p.toLowerCase(),
                      })),
                    },
                    { name: 'url', type: 'text', required: true },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'city', type: 'text', admin: { description: 'Where Keji is based. Not confirmed yet.' } },
                { name: 'serviceArea', type: 'text', admin: { description: 'e.g. "Across Nigeria and the UK"' } },
              ],
            },
          ],
        },
        {
          label: 'Homepage',
          fields: [
            {
              name: 'heroSlides',
              type: 'array',
              maxRows: 6,
              labels: { singular: 'Hero pair', plural: 'Hero pairs' },
              admin: { description: 'Pairs of photos that rotate in the homepage hero. Captions come from each photo.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'left', type: 'upload', relationTo: 'media', required: true },
                    { name: 'right', type: 'upload', relationTo: 'media', required: true },
                  ],
                },
              ],
            },
            {
              name: 'homePackages',
              label: 'Packages teaser',
              type: 'relationship',
              relationTo: 'packages',
              hasMany: true,
              maxRows: 3,
            },
            { name: 'homeTestimonial', label: 'Featured testimonial', type: 'relationship', relationTo: 'testimonials' },
          ],
        },
        {
          label: 'Booking',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'depositPercent', label: 'Deposit (%)', type: 'number', min: 0, max: 100 },
                { name: 'balanceDue', type: 'text', admin: { description: 'e.g. "2 weeks before the day"' } },
                { name: 'turnaround', type: 'text', admin: { description: 'e.g. "6 weeks, film to follow"' } },
              ],
            },
            {
              name: 'quoteFactors',
              label: 'What can change your quote',
              type: 'array',
              fields: [{ name: 'item', type: 'text', required: true }],
            },
            {
              name: 'addOns',
              label: 'Add-ons',
              type: 'array',
              labels: { singular: 'Add-on', plural: 'Add-ons' },
              fields: [{ name: 'name', type: 'text', required: true }, ...priceFields()],
            },
            { name: 'gbpNote', label: 'Note shown with £ prices', type: 'text' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', label: 'Default title', type: 'text' },
            { name: 'seoDescription', label: 'Default description', type: 'textarea', maxLength: 300 },
            { name: 'shareImage', type: 'upload', relationTo: 'media', admin: { description: '1200×630 works best.' } },
          ],
        },
      ],
    },
  ],
}
