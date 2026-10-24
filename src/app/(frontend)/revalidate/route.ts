import { timingSafeEqual } from 'crypto'
import { revalidateTag } from 'next/cache'

import { ALL_TAGS } from '@/lib/revalidate'

// Clears the page cache after changes made outside the admin (seed scripts, data
// migrations). Admin edits already revalidate through collection hooks.
//   curl -X POST -H "x-revalidate-secret: $REVALIDATE_SECRET" <site>/revalidate
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  const given = request.headers.get('x-revalidate-secret') ?? ''
  const ok = Boolean(secret) && given.length === secret!.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret!))
  if (!ok) return Response.json({ ok: false }, { status: 401 })

  for (const tag of ALL_TAGS) revalidateTag(tag, 'max')
  return Response.json({ ok: true, revalidated: ALL_TAGS.length })
}
