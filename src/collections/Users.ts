import type { Access, CollectionConfig, FieldAccess } from 'payload'

const isAdmin = (user: unknown): boolean =>
  Boolean(user && typeof user === 'object' && 'role' in user && user.role === 'admin')

const adminOnly: Access = ({ req }) => isAdmin(req.user)
const adminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (isAdmin(req.user)) return true
  return { id: { equals: req.user.id } }
}
const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req.user)

// Monie (admin) and Keji (editor). Editors manage content but not users.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  hooks: {
    // The first account (created from the /admin setup screen) becomes the admin.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.role = 'admin'
        return data
      },
    ],
  },
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
    },
  ],
}
