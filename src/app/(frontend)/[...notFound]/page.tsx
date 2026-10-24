import { notFound } from 'next/navigation'

// The app has two root layouts (site and Payload admin), so Next's default 404 would skip
// the site's layout. Unmatched site URLs land here and render (frontend)/not-found.tsx.
// Real routes, /admin and /api always take precedence over this catch-all.
export default function CatchAll() {
  notFound()
}
