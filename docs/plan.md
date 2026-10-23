# Keji Visuals Photography — Approved Project Plan

_Status: approved stack and design direction, 23 Oct 2026. Pitch mockup in progress; implementation paused until the client is on board._

## Stack
- **Next.js (App Router) + Payload CMS** in one app; admin at `/admin`
- **Postgres on Neon** (not Supabase, because free Supabase projects pause after a week idle)
- **Cloudflare R2** for media, via `@payloadcms/storage-s3` (endpoint = R2 S3 API, `region: 'auto'`, `forcePathStyle: true`, `clientUploads: true`), served from a custom domain such as `media.kejivisuals.com`
- **Tailwind CSS** for styling
- **Vercel Pro** for hosting (the Hobby plan doesn't allow commercial sites)
- **Umami** for cookie-less analytics
- Built for Keji specifically, not as a reusable starter
- Extra dependency beyond the stack: PhotoSwipe (lightbox) only

## Scope decisions
- Pricing display is set per package: exact / "from" / "enquire"
- Client proofing and delivery are out of scope; we link to Keji's Pixieset or Pic-Time if he uses one
- Phase 2 options: journal/blog, Paystack booking deposits

## Client & brand (from Instagram @kejivisuals_weddings, 23 Oct 2026)
- Photographer: Ayomideji Morenikeji Omolegan ("Keji"). Wedding-led photo **and video** studio: weddings, pre-weddings, events, portraits, plus brand films, documentaries and corporate milestones
- Contact: Kejivisuals@gmail.com · +234 903 491 7020 (written on IG as +23409034917020; drop the 0 for WhatsApp links). City not yet confirmed
- Tagline: "Timeless. Genuine. Beautiful." Brand lines: "Your moment. Your story.", "Beyond the lens", "Behind the lens", "More than a photograph", "Ready to tell your story?"
- Values: Authentic · Timeless · Intentional · Personal
- Existing identity: geometric logo mark + KEJI VISUALS wordmark; cream ~#EFEDE0, olive-gold ~#A9A06B, black; Cinzel-style classical serif caps (to confirm) with two-tone headlines (black + olive words); Montserrat-style body
- His work: vivid, saturated Nigerian (largely Yoruba) traditional weddings, pre-wedding and bridal portraits, mostly portrait orientation; IG images are watermarked, so the site needs clean exports

## Design direction — "Your moment. Your story." (approved for pitch)
- References studied: ethanwong.photography (pricing page, chapter index, mobile bottom bar), almirakho.com, perappelgren.de, remyshoots.co.za, HENSON.STUDIO (Behance concept)
- Quiet cream/ink frame so his colour photography leads; olive reserved for large headline words, rules and frames; deeper olive (~#6B6436) or ink for small text/buttons (contrast)
- Typography: Cinzel-style serif for display, Montserrat for UI/body; his two-tone headline as a recurring device
- Signature: contact-sheet captions (`No. 014 · Traditional Engagement · Ibadan`) and a thin film-strip line motif in place of the clip-art icons
- Home: header + Book CTA → hero diptych (portrait pairs) with "Your moment. Your story." → category index with counts → selected stories → Behind the lens (portrait + bio) → four values → packages teaser → testimonial → how booking works → "Ready to tell your story?" with email + WhatsApp
- Story pages: chapters (Getting ready · Traditional ceremony · Portraits · Reception), justified rows + full-bleed breathers, dark full-screen viewer, embedded film where available, "Book a similar session" + next story
- Packages: category tabs, per-package price display, ₦/£ toggle, add-ons, deposit/payment terms, "what changes the price", "Before you book" guide (from his educational posts), FAQ, enquire pre-fills form
- Mobile: sticky Book + WhatsApp bar, category chips, large single-column images, swipe viewer; no preloader or entry gate

## Sitemap
- `/`: hero, featured galleries, categories, intro, packages teaser, testimonials, CTA
- `/portfolio`, `/portfolio/[category]`, `/portfolio/[category]/[gallery]` (categories: Weddings, Pre-Weddings, Events, Portraits, Films)
- `/packages`: rate card grouped by category, with FAQ
- `/about`
- `/contact`: enquiry form, WhatsApp, Instagram, email
- `/privacy`, `/booking-terms`, 404
- `/admin`: Payload

## Payload content model
- **Media** (upload): alt text (required), caption, focal point/crop, generated WebP sizes (~640/1024/1600/2400), blur placeholder (blurDataURL) via hook, width/height
- **Categories**: name, slug, cover, intro, order
- **Galleries / Stories**: title, slug, category, cover, chapters[] (title + images Media[]), optional film embed (YouTube/Vimeo URL), date, location, featured, order, published
- **Films**: title, slug, client/type (wedding film, brand film, documentary), embed URL, poster image, description, featured
- **Packages**: name, category (incl. photo + film bundles), price NGN (+ optional GBP/USD), priceDisplay (exact / from / enquire), duration, edited image count, turnaround, inclusions[], add-ons[], featured/"most popular", visible, order
- **Testimonials**, **FAQs**
- **Enquiries**: stored from the contact form, and also emailed
- **Site Settings** (global): logo, contact details, WhatsApp, socials, SEO defaults, homepage hero picks
- **About** (global)
- **Users**: Keji (editor) and Monie (admin); `maxLoginAttempts` + lockout

## Image strategy
- Keji uploads sRGB JPEGs, long edge 3000–4000 px, ~85 quality, with GPS data stripped
- Uploads go straight from the browser to R2, bypassing Vercel's 4.5 MB server upload limit
- Sizes are pre-generated at upload; images are served from the R2 custom domain with long cache headers
- A custom `next/image` loader keeps Vercel's image optimisation quota untouched
- The largest size served is 2400 px; originals are never linked publicly
- Width/height plus blur placeholder means no layout shift
- Only the hero and first row load eagerly; galleries over ~30 images get "load more"
- Justified/masonry grid computed from aspect ratios; PhotoSwipe lightbox
- Future option: Cloudflare Image Transformations in front of R2

## Ops
- Payload migrations run as part of the deploy
- Weekly `pg_dump` to R2 via a scheduled GitHub Action
- The R2 bucket is the media store of record
- Static pages with on-demand revalidation via Payload `afterChange` hooks

## Phases
1. Discovery sign-off + client asset request ✅ (in progress)
2. Design direction ✅ approved → pitch mockup (Home, wedding story, Packages, mobile) on the Design canvas with placeholder imagery until Keji grants photo permission
3. Foundation: **day-one spike** (upload a >4.5 MB JPEG via clientUploads → confirm sizes + blur generate → serve from R2 domain), then Payload/Neon/R2/Vercel setup, collections, staging URL
4. Templates: all pages, gallery + lightbox, packages, enquiry form (email + stored, honeypot + rate limit)
5. Content load with Keji's real images and copy
6. QA + one consolidated client revision round
7. Training (30-minute walkthrough + recorded guide) and launch
8. Two weeks of post-launch fixes

## Testing
- Low/mid Android on throttled 4G, iPhone Safari, tablet, desktop Chrome/Safari/Firefox/Edge
- LCP < 2.5 s on mobile 4G, CLS ≈ 0, Lighthouse 90+
- Keyboard and screen-reader lightbox; contrast; alt text
- Enquiry delivery, spam handling, admin storage
- Keji dry run in the admin: edit a price, add a gallery, reorder; confirm revalidation
- Metadata, sitemap, robots.txt, social previews

## Launch checklist
- DNS + SSL for the site and the media subdomain
- SPF/DKIM for the form sender
- Search Console + sitemap; Google Business Profile link; Umami live
- Privacy policy (NDPA 2023); booking terms
- First DB backup verified
- Keji owns the domain; Monie holds admin on Vercel, Neon and Cloudflare
