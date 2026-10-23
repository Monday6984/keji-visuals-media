# Phase 3 spike report: large uploads via clientUploads

_23 Oct 2026. Payload 3.92.0, Next.js 16.3.3, @payloadcms/storage-s3 3.92.0, Neon Postgres 18, Cloudflare R2, Vercel preview._

## Result: passed, no fallback needed

An 8.8 MB, 3000×4000 JPEG uploaded through `/admin` on a **Vercel preview deployment** went from the browser straight to R2. Payload then generated all four WebP sizes and the blur placeholder, saved width/height, and every file serves from the R2 public URL.

| Check | Local (doc 1) | Vercel preview (doc 3) |
|---|---|---|
| Original > 4.5 MB | 9,236,085 bytes | 9,236,085 bytes |
| Width/height stored | 3000×4000 | 3000×4000 |
| `blurDataURL` | WebP data URL | WebP data URL |
| sm / md / lg / xl | 640 / 1024 / 1600 / 2400 wide | same |
| All URLs 200 from `r2.dev` | yes | yes |

The test image is random noise, which is the worst case for compression (xl = 3.3 MB). Real photos will be much smaller.

## How it works (from the Payload source, then confirmed by the test)

1. The admin asks our server for a signed URL (`POST /api/storage-s3-generate-signed-url`), and the browser `PUT`s the file directly to R2. Vercel's 4.5 MB request-body limit never applies.
2. On save, Payload's server streams the original back from R2 to a temp file (`payload/dist/uploads/getFileFromClientUpload.js`). It does this because Media has image sizes configured. It then generates the sizes as it would for a normal upload.
3. In that mode `req.file.data` is an empty buffer and the bytes are at `req.file.tempFilePath`. Our `blurDataURL` hook reads whichever one is present (covered by `tests/int/media-blur.int.spec.ts`).

## Problems found and fixed

- **Admin thumbnail 500s.** Payload builds `thumbnailURL` from the local size URL stored in the database, not the R2 URL. Fixed with a function `adminThumbnail` and a shared `src/lib/mediaURL.ts`. Client uploads go into a per-upload folder (`media/<_objectKey>/`), and the helper includes it.
- **Duplicate sizes for small images.** `withoutEnlargement: true` copied the original into every size larger than the image. Removed it, so Payload's default skips those sizes instead.
- **Vercel config.** The first deploy built as production with no env vars (they were set for Preview only) and ran `next build` without migrations. Fixed: added a `main` branch as the production branch, and `vercel.json` sets `buildCommand: npm run ci` (`payload migrate && npm run build`).
- **Schema push disabled** (`push: false`). Local dev and Vercel share one Neon database, so schema changes go through migrations only.

## Open items

| Item | Notes | When |
|---|---|---|
| Cache headers | R2 objects have no `Cache-Control` (the original has `no-cache`). Add a Cloudflare cache rule on the media custom domain. | Before launch |
| Originals are public | The full original is reachable at its URL, and that URL appears in the public `/api/media` response. Options: hide `url` from public reads, store originals privately, or accept the risk. | Decide in Phase 4 |
| Vercel plan | The project is on Hobby, and Monie decided on 23 Oct 2026 to stay there for now. Hobby's terms ban commercial use, so revisit before Keji's site goes live. | Before launch |
| Save duration on Vercel | Not measured (runtime logs only record requests that print output). It was 11.5 s locally for the worst-case image. Check the deployment's Observability tab. | Phase 4 |
| Production env vars | None set yet. Production needs its own `PAYLOAD_SECRET`. | Before staging/launch |
| `r2.dev` URL | Rate-limited and meant for development only. Switch `R2_PUBLIC_URL` to `media.<domain>` once Keji's domain is known. | Launch |
| pg SSL warning | `sslmode=require` is currently treated as `verify-full`, and pg v9 will weaken that. Use `sslmode=verify-full` in `DATABASE_URI` to keep today's behaviour. | Any time |
