import type { Access, FieldAccess } from 'payload'

// Two roles: admin (Monie) and editor (Keji). Editors manage all content; only admins
// manage users. The public only ever reads.

export const isAdminUser = (user: unknown): boolean =>
  Boolean(user && typeof user === 'object' && 'role' in user && user.role === 'admin')

export const anyone: Access = () => true
export const loggedIn: Access = ({ req }) => Boolean(req.user)
export const adminOnly: Access = ({ req }) => isAdminUser(req.user)
export const adminOnlyField: FieldAccess = ({ req }) => isAdminUser(req.user)
export const loggedInField: FieldAccess = ({ req }) => Boolean(req.user)

// Drafts are visible in the admin; the public only sees published versions.
export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

// For collections that use a checkbox rather than drafts to control visibility.
export const whereOrLoggedIn =
  (field: string): Access =>
  ({ req }) =>
    req.user ? true : { [field]: { equals: true } }
