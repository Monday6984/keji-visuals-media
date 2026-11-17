/**
 * Adds the "Early days" film-strip reel to the About page, after Frame 06: six early
 * photos of Keji with his camera (sent by Monie, 17 Nov 2026), prepared in images/
 * (gitignored) as about-early-01…06.jpg.
 *
 *   npx cross-env NODE_OPTIONS=--no-deprecation payload run scripts/add-early-reel.ts
 *
 * Safe to re-run: photos are matched by filename and the reel by its label. Only touches
 * the About reels list; everything else stays as edited in the admin.
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '@payload-config'

const LABEL = 'Reel 02 · Early days'
const AFTER_FRAME = '06'

const PHOTOS: [file: string, alt: string, caption: string][] = [
  [
    'about-early-01.jpg',
    'Keji in a white shirt, purple tie and brown leather braces, a red camera hanging at his hip, looking away outside an orange church building',
    'Early days',
  ],
  [
    'about-early-02.jpg',
    'Keji smiling in a white shirt, purple tie, brown braces and navy trousers, holding a red camera, in front of an orange and red arched building',
    'Suited up',
  ],
  ['about-early-03.jpg', 'Keji in a blue cap and T-shirt, smiling and holding a Nikon camera up beside his face', 'Camera in hand'],
  [
    'about-early-04.jpg',
    'Keji in an orange striped shirt with a camera bag on his back and a camera in hand, smiling on a red carpet at a wedding venue',
    'On a wedding day',
  ],
  ['about-early-05.jpg', 'Keji in a blue outfit, smiling on a garden swing seat with a red camera on his knee', 'Between shots'],
  [
    'about-early-06.jpg',
    'Keji in glasses and a black shirt, smiling, holding a Canon camera with a flash tucked under his arm, under palm trees',
    'On location',
  ],
]

const payload = await getPayload({ config })
const dbHost = (process.env.DATABASE_URI ?? '').replace(/.*@([^/:?]+).*/, '$1').replace(/^(ep-[a-z]+-[a-z]+).*/, '$1')
console.log(`target database: ${dbHost} · bucket: ${process.env.R2_BUCKET}`)

const frames: { image: number; caption: string }[] = []
for (const [file, alt, caption] of PHOTOS) {
  const existing = (await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1 })).docs[0]
  const filePath = path.resolve(process.cwd(), 'images', file)
  if (!existing && !fs.existsSync(filePath)) throw new Error(`missing images/${file}`)
  const id = existing ? existing.id : (await payload.create({ collection: 'media', data: { alt, caption }, filePath })).id
  frames.push({ image: id, caption })
}

const about = await payload.findGlobal({ slug: 'about', depth: 0 })
const reels = (about.reels ?? []).filter((r) => r.label !== LABEL)
await payload.updateGlobal({
  slug: 'about',
  data: { reels: [...reels, { label: LABEL, afterFrame: AFTER_FRAME, frames }] },
})
console.log(`about: "${LABEL}" after frame ${AFTER_FRAME}, ${frames.length} photos`)

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
try {
  const res = await fetch(`${site}/revalidate`, {
    method: 'POST',
    // Vercel's bot protection answers 403 to the default fetch user agent.
    headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET ?? '', 'user-agent': 'Mozilla/5.0 (keji-seed)' },
  })
  console.log(`revalidate ${site}: ${res.status}`)
} catch {
  console.log(`revalidate ${site}: not reachable (restart the server to see the new content)`)
}
process.exit(0)
