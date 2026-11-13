/**
 * One-off import of Keji's first real content (Nov 2026 delivery): 42 photos as three
 * stories, the rate-card packages, booking settings, FAQs, About copy and draft
 * testimonials. Also removes the [DEV] test content. Safe to re-run: photos are matched
 * by filename and everything else by its title/name/question.
 *
 *   KEJI_PHOTOS="C:/path/to/pictures" npm run import:keji
 *
 * Runs against whichever database/bucket the environment points at; try it on dev first.
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '@payload-config'

const PHOTOS_DIR = process.env.KEJI_PHOTOS
if (!PHOTOS_DIR || !fs.existsSync(PHOTOS_DIR)) {
  console.error('Set KEJI_PHOTOS to the folder holding Keji’s photos.')
  process.exit(1)
}

// file (without "-Edit.jpg") → alt text. Captions come from the story/chapter below.
type Shot = [file: string, alt: string]

const STORIES: {
  title: string
  category: 'weddings' | 'pre-weddings'
  date: string
  excerpt: string
  cover: string
  order: number
  chapters: { title: string; caption: string; shots: Shot[] }[]
}[] = [
  {
    title: 'Kiki & Seye',
    category: 'weddings',
    date: '2026-08-08',
    excerpt: 'A pre-wedding shoot in white and lilac in June, then a traditional wedding in purple on 8 August.',
    cover: 'IMG_1220',
    order: 0,
    chapters: [
      {
        title: 'Pre-wedding, in white',
        caption: 'Kiki & Seye · Pre-wedding',
        shots: [
          ['IMG_5798', 'Couple in white on a cream sofa, she laughs as she covers his eyes'],
          ['IMG_5888', 'She hugs him from behind on the sofa, both in white and smiling'],
          ['IMG_5959', 'Couple in white, cheek to cheek, by sheer white curtains'],
          ['IMG_5974', 'Couple standing together in white beside a potted plant'],
          ['IMG_5982', 'Couple laughing together in white, his hand on her waist'],
          ['IMG_6037', 'She wraps her arms around him from behind, both smiling'],
          ['IMG_6056', 'Black-and-white portrait: she holds the back of his head and smiles at the camera'],
        ],
      },
      {
        title: 'Save the date',
        caption: 'Kiki & Seye · Save the date',
        shots: [
          ['IMG_6127', 'Couple in lilac aso-oke on a wooden bench, reading save-the-date newspapers'],
          ['IMG_6158', 'She leans on his shoulder while he reads their save-the-date newspaper'],
          ['IMG_6227', 'Couple in lilac sitting on a wooden bench, laughing'],
          ['IMG_6247', 'Close-up of the couple, she in a lilac gele resting her face against his'],
          ['IMG_6305', 'He kisses her hand, one foot on the bench, while she laughs'],
          ['IMG_6343', 'He kisses her cheek, both in lilac traditional outfits'],
          ['IMG_6381', 'Couple standing in lilac traditional outfits, she smiles at the camera'],
        ],
      },
      {
        title: 'The traditional wedding',
        caption: 'Kiki & Seye · Traditional wedding',
        shots: [
          ['IMG_1144', 'Bride in a purple gele and beaded lace on a wooden staircase, holding aso-oke'],
          ['IMG_1165', 'Bride in purple lace on the staircase, looking down'],
          ['IMG_1169', 'Bride smiling on the staircase with aso-oke over her arm'],
          ['IMG_1200', 'Couple in matching purple on the staircase, the groom in agbada and coral beads'],
          ['IMG_1220', 'Bride and groom in purple, close together on the staircase'],
          ['IMG_1252', 'Bride in a purple gele reflected in a round mirror'],
          ['IMG_1282', 'Bride kisses the groom’s cheek outdoors, both in purple'],
          ['IMG_1393', 'Bride in a purple veil and lace holding aso-oke'],
        ],
      },
    ],
  },
  {
    title: 'Dolapo & Femi',
    category: 'pre-weddings',
    date: '2026-04-26',
    excerpt: 'Green lace on a warm studio backdrop, then white on bright blue: a playful pre-wedding shoot.',
    cover: 'C09A3574',
    order: 1,
    chapters: [
      {
        title: 'In green and gold',
        caption: 'Dolapo & Femi · Pre-wedding',
        shots: [
          ['C09A3185', 'Couple embracing in green lace and a navy agbada against a tan backdrop'],
          ['C09A3238', 'Couple seated together, she in a green gele and beaded lace'],
          ['C09A3289', 'Couple laughing, she holding a green aso-oke wrap'],
        ],
      },
      {
        title: 'In white',
        caption: 'Dolapo & Femi · Pre-wedding',
        shots: [
          ['C09A3574', 'Close-up of the couple smiling cheek to cheek, in white, on a blue backdrop'],
          ['C09A3692', 'He dips her for a kiss against a bright blue backdrop'],
          ['C09A3727', 'He carries her in his arms, both laughing'],
          ['C09A3738', 'He holds her up in his arms while she laughs, legs in the air'],
          ['C09A3748', 'Couple posing playfully, she pointing at the camera'],
          ['C09A3773', 'Couple smiling side by side in white on a blue backdrop'],
        ],
      },
    ],
  },
  {
    title: 'David & Tope',
    category: 'pre-weddings',
    date: '2026-10-05',
    excerpt: 'Teal lace and gele for the traditional look, then a white lace gown and burgundy suit for the white wedding.',
    cover: 'IMG_5923',
    order: 2,
    chapters: [
      {
        title: 'The traditional look',
        caption: 'David & Tope · Traditional look',
        shots: [
          ['IMG_5382', 'Bride-to-be in a teal gele and beaded lace, holding a gold bag'],
          ['IMG_5446', 'Close-up portrait in a teal gele and gold jewellery, smiling'],
          ['IMG_5485', 'Bride-to-be in teal lace with one hand on a stool'],
          ['IMG_5693', 'Couple in teal: she in beaded lace, he in a teal agbada'],
          ['IMG_5728', 'Couple in teal facing each other, his hands on her waist'],
          ['IMG_5761', 'He kisses her cheek, both in teal'],
          ['IMG_5923', 'Couple in teal smiling cheek to cheek'],
        ],
      },
      {
        title: 'The white wedding look',
        caption: 'David & Tope · White wedding look',
        shots: [
          ['IMG_6095', 'Bride in a white lace gown, groom in a burgundy suit seated beside her'],
          ['IMG_6166', 'Bride holding a white bouquet, the groom in burgundy behind her'],
          ['IMG_6386', 'Groom kisses the bride’s cheek, she in a veil and tiara'],
          ['IMG_6462', 'Bride in a fitted white lace gown and veil'],
        ],
      },
    ],
  },
]

const HERO_PAIRS: [string, string][] = [
  ['C09A3574', 'IMG_1220'],
  ['IMG_5446', 'IMG_6343'],
  ['IMG_6386', 'C09A3727'],
]

const PACKAGE_SHARED = { priceDisplay: 'exact', turnaround: 'Full gallery in 2–4 weeks', visible: true }
const PACKAGES = [
  {
    name: 'Bronze',
    tier: 'Photo + film',
    tagline: 'Photographs and film for your wedding day, with a pre-wedding shoot to start.',
    priceNGN: 750000,
    inclusions: [
      'Complimentary pre-wedding photoshoot (1 outfit)',
      '12" × 24" photobook with box',
      '2–3 minute wedding highlight video',
      'Full edited wedding video',
      'Two 16" × 20" wall frames',
      'Lifetime online photo gallery',
    ],
  },
  {
    name: 'Silver',
    tier: 'Photo + film',
    tagline: 'Traditional and white wedding, each with its own highlight film.',
    priceNGN: 850000,
    inclusions: [
      'Complimentary pre-wedding photoshoot (up to 2 outfits)',
      '12" × 36" photobook with box',
      'Mini photobook',
      '2–3 minute white wedding highlight video',
      '2–3 minute traditional wedding highlight video',
      'Full edited wedding video',
      'Two 16" × 20" wall frames',
      'Lifetime online photo gallery',
    ],
  },
  {
    name: 'Gold',
    tier: 'Photo + film',
    tagline: 'Our most complete wedding experience.',
    priceNGN: 980000,
    inclusions: [
      'Complimentary pre-wedding photoshoot (up to 3 outfits)',
      '12" × 36" photobook with box, plus a mini photobook',
      '2–3 minute white wedding highlight video',
      '2–3 minute traditional wedding highlight video',
      'All fully edited pictures and portraits',
      'All fully edited wedding videos',
      'Drone video coverage',
      'Two 16" × 20" wall frames',
      'Lifetime online photo gallery',
    ],
  },
]

const FAQS: [question: string, answer: string[]][] = [
  [
    'How do we secure our date?',
    [
      'Once your date is confirmed, an 80% booking payment secures it. We recommend paying at least one to two months before your wedding so everything can be planned properly.',
      'The remaining 20% is due within 24–48 hours after your wedding.',
    ],
  ],
  [
    'When will we receive our photos?',
    [
      'Your couple first-look photos arrive within 72 hours of the wedding. The full gallery of edited photos is ready within two to four weeks, and your photobook, frames and other package items within seven to eight weeks.',
    ],
  ],
  [
    'Do you cover both the traditional and the white wedding?',
    [
      'Yes. Silver and Gold include a separate highlight film for each ceremony, and every package includes a full edited wedding video.',
    ],
  ],
  [
    'Do you travel outside Lagos?',
    [
      'Yes. We ask that hotel accommodation is provided for our team. For weddings outside Western Nigeria or outside the country, transport and logistics cost extra; we agree these with you in advance so there are no surprises.',
    ],
  ],
  [
    'What happens if we cancel?',
    [
      'Your booking reserves the date for you alone, so 30% of the booking payment is non-refundable if the event is cancelled after booking.',
    ],
  ],
]

// Drafted for the couples to approve or rewrite. They stay hidden (consent unticked)
// until Keji confirms each couple is happy with the wording.
const TESTIMONIALS: { names: string; story: string; quote: string }[] = [
  {
    names: 'Kiki & Seye',
    story: 'Kiki & Seye',
    quote:
      'Keji shot our pre-wedding in June and our traditional wedding in August, and both days felt easy. He caught moments we didn’t even know had happened, and our families still ask who took the pictures.',
  },
  {
    names: 'Dolapo & Femi',
    story: 'Dolapo & Femi',
    quote:
      'We were nervous about being in front of a camera, and within ten minutes Keji had us laughing. The photos on the blue backdrop are now our favourite pictures of us together.',
  },
  {
    names: 'David & Tope',
    story: 'David & Tope',
    quote:
      'Two looks in one afternoon and not one stiff pose. Keji was calm, patient and quick, and the photos came back even better than we hoped.',
  },
]

const ABOUT_INTRO =
  'Keji Visuals is a wedding photography and film studio in Lagos, led by Ayomideji “Keji” Omolegan. We document traditional and white weddings, pre-wedding shoots, portraits and events, and we stay with each couple from the first call to the day the photobook arrives.'

const ABOUT_BIO = [
  'Keji Visuals is a photography and film studio based in Lagos, founded by Ayomideji Morenikeji Omolegan. Most people call him Keji.',
  'There’s a moment right before the vows are said, the toast is raised, the deal is sealed, and then it’s gone. Unless someone is there to hold onto it. That is the work: we follow the big scenes and we notice the small ones too, like a gele being tied, a father’s handshake, a hand held a little tighter.',
  'Weddings are at the heart of what we do: traditional engagements, white weddings and the pre-wedding shoots that come before them. We also photograph portraits and events, and make brand films, documentaries and films for corporate milestones.',
  'We would rather catch you being yourselves than hold you in a pose. Every frame should earn its place, and we edit for how your pictures will feel in twenty years, not only next week.',
  'The relationship matters as much as the pictures. We get to know you before the day so you feel comfortable in front of the camera, and we keep you posted afterwards: first-look photos within 72 hours, your full gallery in two to four weeks, and your photobook and frames soon after.',
  'We’re based in Lagos and travel across Nigeria and beyond. Wherever love is, that’s where you’ll find us.',
]

const paragraph = (text: string) => ({
  type: 'paragraph',
  format: '' as const,
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  textFormat: 0,
  children: [{ type: 'text', text, version: 1, detail: 0, format: 0, mode: 'normal', style: '' }],
})
const richText = (paras: string[]) => ({
  root: { type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const, children: paras.map(paragraph) },
})

async function main() {
  const payload = await getPayload({ config })
  console.log(`target bucket: ${process.env.R2_BUCKET}`)
  // Neon closes idle connections while sharp is busy with a large photo; without a
  // listener pg treats that as fatal. The pool reconnects on the next query.
  ;(payload.db as unknown as { pool?: { on: (e: 'error', cb: (err: Error) => void) => void } }).pool?.on('error', (err) =>
    console.warn(`db: idle connection dropped (${err.message}), reconnecting`),
  )

  // 1. Remove the [DEV] test content. That includes the stand-in About portrait (an
  // Instagram graphic with text on it); About goes without a photo until Keji sends one.
  await payload.updateGlobal({ slug: 'site-settings', data: { heroSlides: [], homePackages: [], homeTestimonial: null } })
  await payload.updateGlobal({ slug: 'about', data: { portrait: null } })
  await payload.delete({ collection: 'media', where: { alt: { like: 'Keji holding a camera' } } })
  for (const [collection, field] of [
    ['films', 'title'],
    ['stories', 'title'],
    ['packages', 'name'],
    ['testimonials', 'names'],
    ['faqs', 'question'],
    ['media', 'alt'],
  ] as const) {
    const { docs } = await payload.delete({ collection, where: { [field]: { like: '[DEV]' } } })
    if (docs.length) console.log(`removed ${docs.length} [DEV] ${collection}`)
  }

  // 2. Photos (skips any already uploaded)
  const files = new Map(
    fs
      .readdirSync(PHOTOS_DIR!)
      .filter((f) => /^[^.].*\.jpe?g$/i.test(f))
      .map((f) => [f.replace(/-Edit(-\d)?\.jpe?g$/i, ''), f]),
  )
  const media: Record<string, number> = {}
  const shots = STORIES.flatMap((s) => s.chapters.flatMap((c) => c.shots.map(([key, alt]) => ({ key, alt, caption: c.caption }))))
  for (const [i, { key, alt, caption }] of shots.entries()) {
    const file = files.get(key)
    if (!file) throw new Error(`missing photo ${key}`)
    const existing = (await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1 })).docs[0]
    if (existing) {
      await payload.update({ collection: 'media', id: existing.id, data: { alt, caption } })
      media[key] = existing.id
      continue
    }
    const started = Date.now()
    const doc = await payload.create({ collection: 'media', data: { alt, caption }, filePath: path.join(PHOTOS_DIR!, file) })
    media[key] = doc.id
    console.log(`photo ${i + 1}/${shots.length} ${file} (${((Date.now() - started) / 1000).toFixed(0)} s)`)
  }

  const categoryId = async (slug: string) =>
    (await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })).docs[0].id

  // Upsert by a unique-enough field.
  const upsert = async <T extends 'stories' | 'packages' | 'testimonials' | 'faqs'>(
    collection: T,
    field: string,
    value: string,
    data: Record<string, unknown>,
  ) => {
    const found = (await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1, draft: true })).docs[0]
    return found
      ? payload.update({ collection, id: found.id, data: data as never, draft: false })
      : payload.create({ collection, data: data as never })
  }

  // 3. Stories
  const stories: Record<string, number> = {}
  for (const s of STORIES) {
    const doc = await upsert('stories', 'title', s.title, {
      _status: 'published',
      title: s.title,
      category: await categoryId(s.category),
      cover: media[s.cover],
      excerpt: s.excerpt,
      date: s.date,
      featured: true,
      order: s.order,
      chapters: s.chapters.map((c) => ({ title: c.title, images: c.shots.map(([key]) => media[key]) })),
    })
    stories[s.title] = doc.id
    console.log(`story: ${s.title}`)
  }

  // 4. Packages
  const weddings = await categoryId('weddings')
  const packages: number[] = []
  for (const [order, p] of PACKAGES.entries()) {
    const doc = await upsert('packages', 'name', p.name, {
      ...PACKAGE_SHARED,
      ...p,
      category: weddings,
      order,
      inclusions: p.inclusions.map((item) => ({ item })),
    })
    packages.push(doc.id)
  }
  console.log(`packages: ${PACKAGES.map((p) => p.name).join(', ')}`)

  // 5. FAQs and testimonials
  for (const [order, [question, answer]] of FAQS.entries()) {
    await upsert('faqs', 'question', question, { question, answer: richText(answer), group: 'beforeYouBook', order })
  }
  let firstTestimonial: number | undefined
  for (const [order, t] of TESTIMONIALS.entries()) {
    const doc = await upsert('testimonials', 'names', t.names, {
      names: t.names,
      quote: t.quote,
      story: stories[t.story],
      category: weddings,
      featured: order === 0,
      order,
    })
    firstTestimonial ??= doc.id
  }
  console.log(`faqs: ${FAQS.length}, testimonials: ${TESTIMONIALS.length} (hidden until consent is ticked)`)

  // 6. Settings and About
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      city: 'Lagos',
      serviceArea: 'Across Nigeria and overseas',
      heroSlides: HERO_PAIRS.map(([left, right]) => ({ left: media[left], right: media[right] })),
      homePackages: packages,
      homeTestimonial: firstTestimonial,
      depositPercent: 80,
      balanceDue: 'within 24–48 hours after the wedding',
      turnaround: '2–4 weeks',
      quoteFactors: [
        { item: 'Weddings outside Western Nigeria or abroad: transport and logistics, agreed with you in advance' },
        { item: 'Hotel accommodation for our team, which we ask you to provide' },
      ],
      addOns: [],
      gbpNote: null,
      seoTitle: 'Keji Visuals · Wedding photography & film in Lagos',
      seoDescription:
        'Keji Visuals is a Lagos wedding photography and film studio: traditional and white weddings, pre-wedding shoots, portraits and films, across Nigeria and overseas.',
    },
  })
  await payload.updateGlobal({
    slug: 'about',
    data: {
      headline: 'Behind the lens',
      intro: ABOUT_INTRO,
      bio: richText(ABOUT_BIO) as never,
    },
  })
  console.log('site settings + about updated')

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${site}/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET ?? '' },
    })
    console.log(`revalidate ${site}: ${res.status}`)
  } catch {
    console.log(`revalidate ${site}: not reachable (restart the server to see the new content)`)
  }
  process.exit(0)
}

// Top-level await: `payload run` exits as soon as this module finishes importing.
await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
