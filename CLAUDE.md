# Keji Visuals — project brief for Claude Code

You are the senior web developer on this project. The developer you're working with is **Monie**, a freelance designer/developer who is experienced with WordPress, React, Next.js, Tailwind and modern tooling. Explain decisions briefly, propose a plan before large changes, and don't add packages unless they are clearly justified.

Everything below was decided in a discovery session on claude.ai (23 Oct 2026). Full detail is in `docs/`:
- `docs/plan.md` — the approved project plan (stack, content model, image strategy, ops, phases, testing, launch)
- `docs/client-asset-request.md` — what we've asked the client for
- `docs/research.md` — design references, the client's brand, motion research, Instagram shortlist
- `docs/mockup/` — the approved pitch mockup (4 screens), as source files to build from

---

## The client
- **Keji Visuals** — Ayomideji Morenikeji Omolegan ("Keji"), Nigerian wedding-led **photo and video** studio.
- Services: Weddings (traditional + white), Pre-Weddings, Events, Portraits, Films (wedding films, brand films, documentaries, corporate milestones).
- Contact: kejivisuals@gmail.com · +234 903 491 7020 (WhatsApp link: `https://wa.me/2349034917020`) · Instagram @kejivisuals_weddings
- City **not confirmed** — keep it as a setting, never hard-code a city.
- Tagline: **"Timeless. Genuine. Beautiful."** Brand lines: "Your moment. Your story.", "Behind the lens", "More than a photograph", "Ready to tell your story?"
- Values: Authentic (real moments over forced poses) · Timeless · Intentional (every frame has a purpose) · Personal.

## Status
- Discovery, stack and design direction: **approved**.
- Pitch mockup: done (`docs/mockup/`). Uses colour-block placeholders — real photos pending from client.
- Phase 3 upload spike: **passed** on a Vercel preview (23 Oct 2026). See `docs/spike-report.md` for results and open items.
- Phase 3 foundation in place: Payload 3.92 + Next 16.3, Neon (migrations only, `push: false`), R2 with `clientUploads`, Media + Users collections, Tailwind tokens. Work is on branch `phase-3/foundation`; production branch is `main`.
- **Next: rest of Phase 3 — remaining collections + globals, then a staging URL.**
- Still waiting on from Keji: logo files, unwatermarked photos, rates, copy, testimonials, city/service area, domain.

## Stack (approved — don't change without asking)
- **Next.js (App Router) + Payload CMS** in one app; admin at `/admin`. Check the current Payload major version in the official docs before scaffolding (docs list v3 and v4).
- **Postgres on Neon** (not Supabase — free Supabase projects pause after a week idle).
- **Cloudflare R2** for media via `@payloadcms/storage-s3`: R2 S3 endpoint, `region: 'auto'`, `forcePathStyle: true`, **`clientUploads: true`** (Vercel caps server uploads at 4.5 MB). Serve from an R2 custom domain (e.g. `media.<domain>`) via `generateFileURL`. Not `@payloadcms/storage-r2` (that one is for Cloudflare Workers).
- **Tailwind CSS**, TypeScript.
- **Vercel** hosting. Monie's decision (23 Oct 2026): stay on **Hobby** for now. Note that Hobby's terms forbid commercial use and Pro was the original plan.
- **Umami** analytics (cookie-less).
- **PhotoSwipe** is the only planned UI dependency (lightbox).
- Built for Keji specifically — not a reusable starter.

## Phase 3 starts with a spike (do this first)
Prove the risky part before building pages:
1. Scaffold Next.js + Payload, connect Neon and R2.
2. Upload a JPEG **larger than 4.5 MB** through the admin with `clientUploads`.
3. Confirm Payload still generates the image sizes and our blur placeholder, and stores width/height.
4. Confirm the files serve from the R2 public/custom URL.
If size generation doesn't run with client uploads, stop and propose a fallback (e.g. processing after upload) before continuing.

Monie creates the Neon project, R2 bucket + S3 API token, and Vercel project. Secrets go in `.env.local` / Vercel env vars — never in code or chat. Expected env vars: `DATABASE_URI`, `PAYLOAD_SECRET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET`, plus the email provider key (provider not chosen yet — propose one) and Umami IDs.

## Content model (Payload)
- **Media** (upload): `alt` (required), caption, focal point + crop enabled; generated WebP sizes ~640/1024/1600/2400; `blurDataURL` generated in a hook with sharp; width/height.
- **Categories**: name, slug, cover, intro, order. Seed: Weddings, Pre-Weddings, Events, Portraits, Films.
- **Stories** (galleries): title, slug, category, cover, **chapters[]** (title + images), optional film embed URL (YouTube/Vimeo), date, location, featured, order, published.
- **Films**: title, slug, type (wedding / brand / documentary), embed URL, poster, description, featured.
- **Packages**: name, category (incl. photo + film bundles), price NGN + optional GBP, `priceDisplay` (exact / from / enquire), duration, image count, turnaround, inclusions[], add-ons[], mostBooked, visible, order.
- **Testimonials**, **FAQs** (incl. "Before you book" questions).
- **Enquiries**: saved from the contact form and emailed.
- **Globals**: Site Settings (logo, contact, WhatsApp, socials, city/service area, SEO defaults, hero picks), About.
- **Users**: Keji (editor), Monie (admin); `maxLoginAttempts` + lockout.

## Sitemap
`/` · `/portfolio` · `/portfolio/[category]` · `/portfolio/[category]/[story]` · `/films` · `/packages` · `/about` · `/contact` · `/privacy` · `/booking-terms` · 404 · `/admin`

## Images & performance
- Uploads: sRGB JPEG, long edge 3000–4000 px. Sizes pre-generated at upload, served from R2 with long cache headers.
- Custom `next/image` loader pointing at the pre-generated sizes — **do not use Vercel image optimisation**.
- Largest served size 2400 px; never link originals.
- Width/height + blur placeholder → no layout shift. Only hero + first row eager; galleries over ~30 images use "load more".
- Static pages + on-demand revalidation from Payload `afterChange` hooks.
- Targets: LCP < 2.5 s on mobile 4G, CLS ≈ 0, Lighthouse 90+. Test on low/mid Android.

## Brand & design tokens
- Colours: cream `#EFEDE0` (page), paper `#F7F5EE` (cards/alt sections), ink `#16140F` (text, buttons, dark sections), olive `#A9A06B` (**large display words, rules, frames only** — too low-contrast for small text), olive-deep `#6B6436` (small accent text/links/focus rings), olive-light `#C9C08A` (accent on dark), body text `#3A372F`, muted `#57534A`.
- Fonts (via `next/font/google`): **Cinzel** for display (all-caps classical serif), **Montserrat** for UI/body. Confirm with Keji — matched from his Instagram graphics.
- Signature devices: **two-tone headlines** (some words ink, some olive); **contact-sheet captions** (`No. 014 · Traditional engagement`); thin **film-strip / marquee** rules in olive. No clip-art icons.
- Logo in the mockup is a stand-in; use Keji's real files when supplied.

## Motion spec (from the mockup — `docs/mockup/Main.dc.html`, `Mobile.dc.html`)
- Hero intro: headline lines rise from a mask (staggered), intro/paragraph/buttons fade up, photos wipe in bottom→top, cream viewfinder corner brackets "focus" in.
- Hero cycle: photo pairs change every ~5 s — outgoing desaturates and fades, incoming settles from scale 1.06 → 1; captions update; film-advance progress segments (clickable) + **pause/play button** (required for auto-moving content).
- Marquee strip of categories/values (desktop only).
- CSS + light JS only — no WebGL/3D. Respect `prefers-reduced-motion` (static hero, slideshow starts paused).

## UX requirements
- Mobile: sticky bottom bar with **Book** + **WhatsApp**; swipeable category chips; large single-column images; swipe full-screen viewer.
- Story pages: chapter navigation, justified rows + full-width "breather" images, dark full-screen viewer (keyboard + swipe), film embed, "Book a similar session" + next story.
- Packages: category tabs, per-package price display, ₦/£ toggle, add-ons, deposit terms, "what can change your quote", "Before you book" FAQ; "Enquire about this package" pre-fills the form.
- Enquiry form: names, email, shoot type, date, location, package, message; honeypot + rate limit; store + email.
- Accessibility: semantic HTML, real buttons/links, visible focus, 4.5:1 text contrast, required alt text, 44 px touch targets.
- No preloaders or entry gates.

## Out of scope (for now)
Client proofing/delivery (link to Pixieset/Pic-Time if Keji uses one), online payments (Paystack deposits are phase 2), blog/journal (phase 2), quote calculator (phase 2).

## Ops
Payload migrations in the deploy step; weekly `pg_dump` to R2 via scheduled GitHub Action; Keji owns domain, Monie holds admin on Vercel/Neon/Cloudflare. Privacy policy must cover the enquiry form under Nigeria's Data Protection Act 2023.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
