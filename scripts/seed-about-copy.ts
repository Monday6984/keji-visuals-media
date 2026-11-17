/**
 * Seeds the About page with the final copy from Keji's interview (docs/about-copy.md,
 * 17 Nov 2026): Frames 01–08, values, timeline, places, "Next on my list", team,
 * "Off the clock" and credits.
 *
 *   npm run seed:about
 *
 * Text only. Each frame keeps the photos, layout and captions it already has (matched by
 * frame number), and the hero, reels and closing are left alone, so photos chosen in the
 * admin survive. Re-running overwrites text edited in the admin (e.g. the film brand name),
 * so on staging it refuses unless ABOUT_COPY_STAGING=yes.
 */
import { getPayload } from 'payload'

import config from '@payload-config'
import type { About } from '@/payload-types'

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

type Chapter = NonNullable<About['chapters']>[number]
type Copy = Pick<Chapter, 'frameNumber' | 'title' | 'pullQuote' | 'extra'> & {
  body: string[]
  aside?: { heading: string; body: string[] }
}

const CHAPTERS: Copy[] = [
  {
    frameNumber: '01',
    title: 'The moment',
    pullQuote: {
      text: 'There’s a moment right before the vows are said, the toast is raised, the deal is sealed — and then it’s gone. Unless someone is there to hold onto it.',
      olive: 'and then it’s gone.',
      size: 'normal',
    },
    body: [
      'That is the work. We follow the big scenes, and we notice the small ones too: a gele being tied, a father’s handshake, a hand held a little tighter.',
    ],
  },
  {
    frameNumber: '02',
    title: 'What we shoot',
    body: [
      'Weddings are at the heart of what we do: traditional engagements, white weddings and the pre-wedding shoots that come before them. We also photograph portraits and events, and make brand films, documentaries and films for corporate milestones.',
      'Couples kept asking me the same question: why book a photographer and a videographer separately? They wanted to trust one person with their whole day. So I added film. Now your photographs and your film come from one team, with one plan, telling one story, and you’re not juggling two vendors on the biggest day of your life.',
    ],
  },
  {
    frameNumber: '03',
    title: 'How I see',
    pullQuote: {
      text: 'If someone missed your wedding, your photobook should tell them exactly how it went.',
      olive: 'exactly how it went.',
      size: 'normal',
    },
    body: [
      'I’m big on storytelling. On the day, we’ll get the shots from your mood board, but I’m always watching for the moments you don’t know I’m catching: when you’re being playful, cracking jokes, whispering to each other and giggling. I crack plenty of jokes myself, because I want your real emotions, not a pose. Those are the frames that become the memories you’ll cherish forever, and they mean that by the end of the day I have everything I need to tell your whole story.',
    ],
    extra: 'values',
  },
  {
    frameNumber: '04',
    title: 'More than your photographer',
    pullQuote: {
      text: 'Good work gets you booked. Good character keeps you in the game.',
      olive: 'Good character keeps you in the game.',
      size: 'normal',
    },
    body: [
      'I’ve never wanted to be just your photographer. I want to be your friend. Once you’ve chosen your package and booked, we start with a consultation call. It’s not a briefing; it’s a chance to get to know you. I’ll ask how you met and what you love most about each other, and we’ll probably laugh a lot. By the time we meet on the day, we’re already friends.',
      'On the day, I’m looking out for you, not just the shot. Have you had water? Have you eaten? Weddings are emotional, and if it gets too much, I’ll make sure you get a quiet moment to breathe before we carry on. Couples often tell me they love how clean and natural their pictures look, and how at ease I made them feel.',
      'I’ve even handed my camera to the team to drive a couple to their own wedding.',
    ],
    extra: 'timeline',
  },
  {
    frameNumber: '05',
    title: 'Wherever love is',
    pullQuote: { text: 'Wherever love is, that’s where you’ll find us.', olive: 'that’s where you’ll find us.', size: 'large' },
    body: [
      'I love to travel, so if your wedding is somewhere new, even better. We’re based in Lagos, and I’ve photographed love stories across more than 80% of Nigeria, north, east and right across the southwest, and over the border in Benin Republic.',
    ],
    extra: 'places',
  },
  {
    frameNumber: '06',
    title: 'If not the army, then what?',
    pullQuote: {
      text: 'I messaged him every week for two years. Then he said yes — on one condition.',
      olive: 'on one condition.',
      size: 'normal',
    },
    body: [
      'The plan was never photography. I finished military school, and all I wanted was to serve in the Nigerian Armed Forces. But a lot had changed. The news was hard, the people who loved me were worried, and the course I was on was stuck waiting for accreditation. So I made a difficult call and stepped away. My mum backed me, the way she always has. I finished my degree, came home to Lagos, and kept asking myself one question: if not the army, then what?',
      'She bought me my first camera, a Canon 1300D, and I started out as Jo Studio, doing creative shoots for brands and individuals. Then I went to a friend’s sister’s wedding and watched the photography team at work. The way they moved, the way they organised themselves — that was the kind of photographer I wanted to be.',
      'I got the team lead’s number and messaged him every week for about two years, asking questions and commenting on his work. Eventually he told me he’d never seen anyone that persistent, and offered me a place on the team. The catch: I’d have to move to Ife. By then I had a few clients of my own in Lagos. I left them, left my house, left everything, and went.',
      'For three years, Gideon trained me without charging me a thing. He invested in a total stranger, and everything you see in Keji Visuals started there. Today we’re like brothers.',
      'In 2021 I left the team and came back to Lagos to start Keji Visuals, not knowing anyone or where to begin. On my birthday, a parcel arrived: the Canon 5D Mark III I’d used on the team, the camera he knew I loved. Inside was a note telling me I could never fail. I still carry those words with me.',
    ],
    aside: {
      heading: 'Before the weddings',
      body: [
        'My early work wasn’t weddings at all. Back then I shot as Jo Studio. I’d leave the house with a model and an idea, find a spot somewhere in Lagos and shoot: creative portraits for people, and for brands.',
        'Around 2020, Trophy Lager ran a photo challenge. I was so curious I went and got some Trophy, found a model and did a shoot. I tagged them, and they commented on my photo. A big brand commenting on my work? That meant a lot to me.',
        'The first wedding I ever photographed was my friend Dare’s, in Ibadan. I’d never shot a wedding before. He told me to come anyway. That trust meant everything, and the fee felt like a fortune to me then. I made him a photobook too, and the feedback told me this was it.',
        'Some of those early photos I took down as I grew. I almost wish I’d kept them up, because that’s what growth looks like.',
      ],
    },
  },
  {
    frameNumber: '07',
    title: 'Why weddings',
    pullQuote: { text: 'I’ve always loved love.', olive: 'loved love.', size: 'large' },
    body: [
      'I’ve always loved seeing couples smile together. At that wedding where I first met Gideon’s team, I watched how they worked with the couple: making them laugh, guiding them, catching the moments in between. When I saw the photos afterwards, I fell in love with wedding photography. I knew I wanted to document people’s love stories.',
      'On the team, I photographed more than 100 weddings. Every one showed me love in a different light: different people, different stories, the sacrifices couples make to be together. Above everything else I shoot, weddings are the work I love most, because I get to be part of your big day. Being the one trusted to tell your love story means a lot to me, and the messages couples send afterwards make me want to do it again and again.',
      'One wedding I’ll never forget came just after I started Keji Visuals. I was still new at my church, and a mutual friend, whose wedding I’d also photographed, recommended me to the couple. That wedding put my work in front of so many people, and the referrals that followed carried Keji Visuals forward. I believe God used it to put me out there, and I’ll always be grateful to them for trusting me.',
      'And Nigerian weddings? There’s nothing like them. I love it when cultures come together — a Yoruba and Hausa wedding, two families from different traditions becoming one — and I love a wedding where one culture is celebrated in full. The colours, the aso ebi, the outfits and the traditions each family holds onto. The food. The drums, the dancing, the spraying. A proper Nigerian wedding has a joy you can feel, and I want every bit of it in your pictures.',
    ],
  },
  {
    frameNumber: '08',
    title: 'The people behind the camera',
    body: [
      'I don’t work alone. It took time to find people who treat this work like their own, who care about every couple as much as I do. Now I have the most amazing team I could ask for.',
    ],
    extra: 'team',
  },
]

async function main() {
  const payload = await getPayload({ config })
  const dbHost = (process.env.DATABASE_URI ?? '').replace(/.*@([^/:?]+).*/, '$1').replace(/^(ep-[a-z]+-[a-z]+).*/, '$1')
  console.log(`target database: ${dbHost} · bucket: ${process.env.R2_BUCKET}`)
  if (!process.env.R2_BUCKET?.endsWith('-dev') && process.env.ABOUT_COPY_STAGING !== 'yes') {
    console.error('Refusing to run against staging: it would overwrite About text edited in the admin. Set ABOUT_COPY_STAGING=yes to override.')
    process.exit(1)
  }

  const current = await payload.findGlobal({ slug: 'about', depth: 0 })
  const existing = new Map((current.chapters ?? []).map((c) => [c.frameNumber, c]))

  const chapters = CHAPTERS.map((copy) => {
    const prev = existing.get(copy.frameNumber)
    return {
      // Photos, layout and captions stay as they are; new frames are text only.
      layout: prev?.layout ?? 'text',
      image: prev?.image ?? null,
      caption: prev?.caption ?? null,
      image2: prev?.image2 ?? null,
      caption2: prev?.caption2 ?? null,
      frameNumber: copy.frameNumber,
      title: copy.title,
      slug: '',
      published: true,
      pullQuote: copy.pullQuote ?? { text: null, olive: null, size: 'normal' as const },
      body: richText(copy.body),
      aside: copy.aside ? { heading: copy.aside.heading, body: richText(copy.aside.body) } : { heading: null, body: null },
      extra: copy.extra ?? 'none',
    }
  })

  await payload.updateGlobal({
    slug: 'about',
    data: {
      chapters,
      values: [
        { name: 'Authentic', line: 'Real moments over forced poses.' },
        { name: 'Timeless', line: 'Images you’ll still love years from now.' },
        { name: 'Intentional', line: 'Every frame has a purpose.' },
        { name: 'Personal', line: 'Your story, your personality, your way.' },
      ],
      timeline: [
        { when: 'Before', title: 'We talk', line: 'A consultation call to get to know you, your story and your plans.' },
        { when: 'The day', title: 'We’re there', line: 'Beside you from getting ready to the last dance.', highlight: true },
        { when: 'Within 72 hours', title: 'First look', line: 'A first set of photos to share straight away.' },
        { when: '2–4 weeks', title: 'Full gallery', line: 'Every edited photo, in a private online gallery.' },
        { when: 'Soon after', title: 'Photobook', line: 'Your photobook and frames, to keep for good.' },
      ],
      places: ['Lagos', 'Ibadan', 'Abeokuta', 'Osun', 'Ekiti', 'Abuja', 'Kaduna', 'Anambra', 'Enugu', 'Abia', 'Delta', 'Benin Republic'].map(
        (name) => ({ name }),
      ),
      nextOnMyList: {
        text: 'a week-long traditional northern wedding, and destination weddings in Ghana, Morocco and France.',
        linkLabel: 'Planning one? Let’s talk.',
        linkUrl: '/packages#destination',
      },
      team: [
        // Placeholder on purpose: Monie fills in the brand name through the admin.
        { name: '[Film brand name]', role: 'Films · Abuja', line: 'Behind most of the films I’ve delivered. Solid, reliable, and brilliant at what they do.', show: true },
        { name: 'Daniel', role: 'Videographer', line: 'An eye for detail, and a storyteller like me.', show: true },
        { name: 'Lekan', role: 'Assistant & lighting', line: 'Makes sure every piece of kit is on set and the light is just right.', show: true },
        { name: 'Precious', role: 'Behind the scenes', line: 'Our newest member, capturing the day from behind the camera.', show: true },
        { name: 'Samson', role: 'Social media', line: 'Brings the ideas that help more couples find us.', show: true },
      ],
      offTheClock: [
        { title: 'On repeat', line: 'Love songs, gospel and everything in between. There’s always music playing while I edit.' },
        { title: 'Quiet places', line: 'I travel to slow down, reflect and plan what’s next.' },
        { title: 'Good food', line: 'Always looking for the next great spot to try.' },
        {
          title: 'Family & church',
          line: 'My family and my church family are where I recharge. There’s a joy in being around them that nothing else gives me.',
        },
      ],
      credits: [
        { name: 'Mum', line: 'My first camera, and my biggest supporter.' },
        { name: 'Dare', line: 'Trusted me with his wedding before anyone else did.' },
        { name: 'Gideon', line: 'Trained a stranger for three years, and sent the camera that started it all.' },
      ],
      // Testimonials stay empty (and the section hidden) until Keji shares approved ones.
    },
  })
  console.log(`about: ${chapters.length} frames, 5 team, 4 off the clock, 3 credits`)

  // The site's page cache lives in the Next.js server, not this process: ask it to refresh.
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
