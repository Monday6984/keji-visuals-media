import type { Field } from 'payload'

import { needsNairaPrice, type PriceDisplay } from '@/lib/validation'

// Price display + ₦ / optional £ amounts, shared by packages and add-ons.
export const priceFields = (): Field[] => [
  {
    name: 'priceDisplay',
    type: 'select',
    required: true,
    defaultValue: 'from',
    options: [
      { label: 'Exact price', value: 'exact' },
      { label: '"From" price', value: 'from' },
      { label: 'Price on enquiry', value: 'enquire' },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'priceNGN',
        label: 'Price (₦)',
        type: 'number',
        min: 0,
        admin: { condition: (_, sibling) => sibling?.priceDisplay !== 'enquire' },
        validate: (value: unknown, { siblingData }: { siblingData: { priceDisplay?: PriceDisplay } }) =>
          !needsNairaPrice(siblingData?.priceDisplay, value) || 'Enter a naira price, or choose "Price on enquiry".',
      },
      {
        name: 'priceGBP',
        label: 'Price (£, optional)',
        type: 'number',
        min: 0,
        admin: { condition: (_, sibling) => sibling?.priceDisplay !== 'enquire' },
      },
    ],
  },
]
