/**
 * Dev-only test content built from the local images/ folder (Instagram downloads,
 * gitignored). Everything it creates is labelled [DEV]; re-running replaces the last run.
 *
 *   npm run seed:dev
 *
 * Refuses to run unless R2_BUCKET is a "-dev" bucket, so it can never touch Keji's
 * real database (staging/production use the main bucket).
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '@payload-config'

const TAG = '[DEV]'
const IMAGES = path.resolve(process.cwd(), 'images')

if (!process.env.R2_BUCKET?.endsWith('-dev')) {
  console.error(`Refusing to seed: R2_BUCKET (${process.env.R2_BUCKET}) is not a -dev bucket.`)
  process.exit(1)
}

// Descriptions from docs/research.md (Instagram shortlist), used as alt text + captions.
const PHOTOS: Record<string, { alt: string; caption: string }> = {
  'Dcbq-0lAhIU_01': { alt: 'Couple in lilac aso-oke on a staircase', caption: 'Traditional engagement' },
  'Dcbq-0lAhIU_02': { alt: 'Couple in lilac on the staircase, laughing', caption: 'Traditional engagement' },
  'Db8-HzoAoOd_01': { alt: 'Bride in a green gele, close-up', caption: 'Bridal portrait' },
  'Db8-HzoAoOd_03': { alt: 'Bride in green, looking over her shoulder', caption: 'Bridal portrait' },
  'DbwB-8hAsPW_01': { alt: 'Couple kissing, bride in a lilac gele', caption: 'The couple' },
  'Dcbpfa-ghtM_01': { alt: 'Bride in a purple veil', caption: 'Getting ready' },
  'DbsZ3zPgv-V_01': { alt: 'Couple in white on a sofa', caption: 'Pre-wedding' },
  'DefG0IRAiC2_01': { alt: 'Bride with a white veil blowing in the wind', caption: 'White wedding' },
  'DefG0IRAiC2_02': { alt: 'Bride in white, veil lifted', caption: 'White wedding' },
  'Dd8yj7xgg61_01': { alt: 'Keji holding a camera', caption: 'Behind the lens' },
  'DcbqV3-Ahno_01': { alt: 'Groom in a purple agbada', caption: 'The groom' },
  'DcbqV3-Ahno_03': { alt: 'Groom adjusting his fila', caption: 'The groom' },
  'Db8-rJnAlWx_01': { alt: 'Man in striped aso-oke', caption: 'Guests' },
  'Db8-rJnAlWx_02': { alt: 'Guest in striped aso-oke, smiling', caption: 'Guests' },
  'Db89oH0AssA_01': { alt: 'Bride in green, dancing', caption: 'Reception' },
  'Db89oH0AssA_02': { alt: 'Bride dancing with family', caption: 'Reception' },
  'Db89oH0AssA_03': { alt: 'Bride mid-spin on the dance floor', caption: 'Reception' },
  'DaXZ91QgrHP_01': { alt: 'Couple portrait in soft light', caption: 'Pre-wedding' },
  'DaXZ91QgrHP_02': { alt: 'Couple walking hand in hand', caption: 'Pre-wedding' },
}

const richText = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [{ type: 'text', text, version: 1 }],
      },
    ],
  },
})

async function main() {
  const payload = await getPayload({ config })
  const like = { like: TAG }

  // Clear the previous run (children first).
  await payload.updateGlobal({ slug: 'site-settings', data: { heroSlides: [], homePackages: [], homeTestimonial: null } })
  for (const [collection, field] of [
    ['films', 'title'],
    ['stories', 'title'],
    ['packages', 'name'],
    ['testimonials', 'names'],
    ['faqs', 'question'],
    ['media', 'alt'],
  ] as const) {
    const { docs } = await payload.delete({ collection, where: { [field]: like } })
    console.log(`removed ${docs.length} ${collection}`)
  }

  // Photos
  const media: Record<string, number> = {}
  for (const file of fs.readdirSync(IMAGES).filter((f) => f.endsWith('.jpg')).sort()) {
    const key = file.replace('kejivisuals_weddings_', '').replace('.jpg', '')
    const info = PHOTOS[key] ?? { alt: 'Wedding photograph', caption: 'Wedding' }
    const doc = await payload.create({
      collection: 'media',
      data: { alt: `${TAG} ${info.alt}`, caption: info.caption },
      filePath: path.join(IMAGES, file),
    })
    media[key] = doc.id
  }

  // Two landscape crops so justified rows and full-width breathers get exercised.
  for (const [key, source, top] of [
    ['wide-hall', 'Db89oH0AssA_02', 0.3],
    ['wide-stairs', 'Dcbq-0lAhIU_01', 0.35],
  ] as const) {
    const src = path.join(IMAGES, `kejivisuals_weddings_${source}.jpg`)
    const { width = 1080, height = 1350 } = await sharp(src).metadata()
    const cropHeight = Math.round(width / 2.33)
    const data = await sharp(src)
      .extract({ left: 0, top: Math.round(height * top), width, height: cropHeight })
      .jpeg({ quality: 88 })
      .toBuffer()
    const doc = await payload.create({
      collection: 'media',
      data: { alt: `${TAG} Wide view of the celebration`, caption: 'Wide' },
      file: { data, mimetype: 'image/jpeg', name: `dev-${key}.jpg`, size: data.length },
    })
    media[key] = doc.id
  }

  const category = async (slug: string) =>
    (await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })).docs[0].id

  const m = (...keys: string[]) => keys.map((k) => media[k])

  // Stories
  const wedding = await payload.create({
    collection: 'stories',
    data: {
      _status: 'published',
      title: `${TAG} Tolu & Femi`,
      slug: '',
      category: await category('weddings'),
      cover: media['Dcbq-0lAhIU_01'],
      excerpt: `${TAG} A two-day celebration: a traditional engagement in lilac and a white wedding by the water.`,
      date: '2026-08-15',
      location: `${TAG} Ibadan`,
      featured: true,
      order: 0,
      chapters: [
        {
          title: 'Getting ready',
          slug: '',
          images: m('Dcbpfa-ghtM_01', 'Db8-HzoAoOd_01', 'Db8-HzoAoOd_03'),
        },
        {
          title: 'Traditional ceremony',
          slug: '',
          images: m('Dcbq-0lAhIU_01', 'DbwB-8hAsPW_01', 'Dcbq-0lAhIU_02', 'wide-hall', 'DcbqV3-Ahno_01', 'DcbqV3-Ahno_03', 'Db8-rJnAlWx_01', 'Db8-rJnAlWx_02'),
          breathers: m('wide-hall'),
        },
        {
          title: 'White wedding & reception',
          slug: '',
          images: m('DefG0IRAiC2_01', 'DefG0IRAiC2_02', 'wide-stairs', 'Db89oH0AssA_01', 'Db89oH0AssA_02', 'Db89oH0AssA_03'),
          breathers: m('wide-stairs'),
        },
      ],
    },
  })

  await payload.create({
    collection: 'stories',
    data: {
      _status: 'published',
      title: `${TAG} Ada & Tunde`,
      slug: '',
      category: await category('pre-weddings'),
      cover: media['DbsZ3zPgv-V_01'],
      excerpt: `${TAG} A golden-hour pre-wedding session.`,
      date: '2026-06-02',
      location: `${TAG} Lagos`,
      featured: true,
      order: 1,
      chapters: [{ title: 'Golden hour', slug: '', images: m('DbsZ3zPgv-V_01', 'DaXZ91QgrHP_01', 'DaXZ91QgrHP_02') }],
    },
  })

  await payload.create({
    collection: 'stories',
    data: {
      _status: 'published',
      title: `${TAG} Bisi`,
      slug: '',
      category: await category('portraits'),
      cover: media['Db8-HzoAoOd_01'],
      excerpt: `${TAG} A bridal portrait session.`,
      date: '2026-05-10',
      featured: true,
      order: 2,
      chapters: [{ title: 'Portraits', slug: '', images: m('Db8-HzoAoOd_01', 'Db8-HzoAoOd_03', 'DefG0IRAiC2_02') }],
    },
  })

  await payload.create({
    collection: 'films',
    data: {
      _status: 'published',
      title: `${TAG} Tolu & Femi — wedding film`,
      slug: '',
      type: 'wedding',
      embedUrl: 'https://vimeo.com/76979871',
      poster: media['DefG0IRAiC2_01'],
      description: `${TAG} Placeholder embed until Keji's own films are added.`,
      story: wedding.id,
      featured: true,
    },
  })

  // Packages (names and lines from the pitch mockup; prices are placeholders)
  const pkg = async (data: Record<string, unknown>, categorySlug: string, order: number) =>
    payload.create({
      collection: 'packages',
      data: { ...data, name: `${TAG} ${data.name}`, category: await category(categorySlug), order, visible: true } as never,
    })

  const packages = [
    await pkg({ tier: 'Essential', name: 'Traditional Wedding', tagline: 'Your engagement ceremony, beautifully documented.', priceDisplay: 'from', priceNGN: 650000, priceGBP: 750, duration: '8 hours of coverage', imageCount: '300+ edited images', turnaround: 'Delivered in 4 weeks', inclusions: [{ item: 'Private online gallery' }] }, 'weddings', 0),
    await pkg({ tier: 'Signature', name: 'The Full Story', tagline: 'Traditional and white wedding — one story, two days.', priceDisplay: 'from', priceNGN: 1400000, priceGBP: 1600, mostBooked: true, duration: 'Both days covered', imageCount: '600+ edited images', turnaround: 'Delivered in 6 weeks', inclusions: [{ item: 'Wedding film, 3–5 min' }, { item: 'Second photographer' }, { item: 'Pre-wedding session' }] }, 'weddings', 1),
    await pkg({ tier: 'Bespoke', name: 'Destination & Multi-day', tagline: 'Weddings away from home, and celebrations over several days.', priceDisplay: 'enquire', inclusions: [{ item: 'Coverage built around your plans' }, { item: 'Photo + film team' }, { item: 'Travel planned with you' }] }, 'weddings', 2),
    await pkg({ tier: 'Session', name: 'Pre-Wedding Session', tagline: 'Natural, romantic and uniquely yours.', priceDisplay: 'exact', priceNGN: 250000, duration: '3 hours on location', imageCount: '60 edited images', inclusions: [{ item: '2 outfit changes' }] }, 'pre-weddings', 0),
    await pkg({ tier: 'Portrait', name: 'Portrait Session', tagline: 'Images that capture your personality and presence.', priceDisplay: 'exact', priceNGN: 120000, duration: '1 hour in studio or on location', imageCount: '20 edited images' }, 'portraits', 0),
    await pkg({ tier: 'Brand', name: 'Brand Films & Documentaries', tagline: 'Stories that don’t just show — they let people feel it.', priceDisplay: 'enquire', inclusions: [{ item: 'Concept & scripting' }, { item: 'Shoot & edit' }, { item: 'Social cut-downs' }] }, 'films', 0),
  ]

  const testimonial = await payload.create({
    collection: 'testimonials',
    data: { names: `${TAG} Ada & Tunde`, quote: 'Placeholder testimonial until Keji supplies real ones with permission.', consent: true, featured: true },
  })

  for (const [order, question] of [
    'Have you photographed a day like ours?',
    'How many edited images will we receive, and when?',
    'Do you cover both the traditional and white wedding?',
    'What secures our date?',
  ].entries()) {
    await payload.create({
      collection: 'faqs',
      data: { question: `${TAG} ${question}`, answer: richText('[Keji’s answer goes here.]'), group: 'beforeYouBook', order },
    })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      heroSlides: [
        { left: media['Dcbq-0lAhIU_01'], right: media['Db8-HzoAoOd_01'] },
        { left: media['DbwB-8hAsPW_01'], right: media['Dcbpfa-ghtM_01'] },
        { left: media['DbsZ3zPgv-V_01'], right: media['DefG0IRAiC2_01'] },
      ],
      homePackages: [packages[3].id, packages[0].id, packages[1].id],
      homeTestimonial: testimonial.id,
      depositPercent: 50,
      balanceDue: `${TAG} 2 weeks before the day`,
      turnaround: `${TAG} 6 weeks, film to follow`,
      quoteFactors: [
        { item: 'Travel beyond [region], and overnight stays' },
        { item: 'Long gaps between the traditional ceremony and the white wedding' },
        { item: 'A second photographer for large guest lists' },
        { item: 'Drone coverage or same-day edits' },
      ],
      addOns: [
        { name: 'Extra hour of coverage', priceDisplay: 'exact', priceNGN: 50000, priceGBP: 60 },
        { name: 'Second photographer', priceDisplay: 'exact', priceNGN: 150000, priceGBP: 180 },
        { name: 'Same-day highlight edit', priceDisplay: 'exact', priceNGN: 200000 },
        { name: 'Drone coverage', priceDisplay: 'exact', priceNGN: 120000 },
        { name: 'Printed album', priceDisplay: 'from', priceNGN: 180000, priceGBP: 220 },
      ],
      gbpNote: 'GBP prices are for UK-based clients and are fixed at booking.',
    },
  })

  await payload.updateGlobal({
    slug: 'about',
    data: {
      portrait: media['Dd8yj7xgg61_01'],
      intro: `${TAG} Placeholder intro until Keji supplies his "Behind the lens" copy.`,
      bio: richText(`${TAG} Placeholder bio.`),
    },
  })

  console.log(`seeded ${Object.keys(media).length} photos, 3 stories, 1 film, ${packages.length} packages`)
  process.exit(0)
}

// Top-level await: `payload run` exits as soon as this module finishes importing.
await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
