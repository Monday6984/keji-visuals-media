import type { CollectionConfig } from 'payload'

// Short-lived counters for the enquiry form's rate limit. `key` is a salted hash of the
// visitor's IP (never the IP itself), rows are deleted after the window, and nothing links
// them to an enquiry. Server code only: hidden from the admin and the public API.
export const RateLimits: CollectionConfig = {
  slug: 'rate-limits',
  admin: { hidden: true },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, index: true },
    { name: 'count', type: 'number', required: true, defaultValue: 0 },
    { name: 'windowStart', type: 'date', required: true, index: true },
  ],
}
