import type { CollectionConfig } from 'payload'

import { loggedIn } from '@/access'
import { SHOOT_TYPES } from '@/lib/enquiry'

// Saved by the contact form's own server endpoint (Phase 4) with overrideAccess, so the
// public REST/GraphQL API can never create, read or change enquiries. No IP addresses
// are stored; the privacy policy must cover these fields (NDPA 2023).
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'names',
    group: 'Bookings',
    defaultColumns: ['names', 'shootType', 'date', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    create: () => false,
    read: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'names', type: 'text', required: true, maxLength: 200 },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'phone', label: 'Phone / WhatsApp', type: 'text', maxLength: 40 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'shootType', type: 'select', required: true, options: [...SHOOT_TYPES] },
        { name: 'date', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    { name: 'location', type: 'text', maxLength: 200 },
    { name: 'package', type: 'text', maxLength: 200, admin: { description: 'Package chosen on the site, if any.' } },
    { name: 'message', type: 'textarea', maxLength: 5000 },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
