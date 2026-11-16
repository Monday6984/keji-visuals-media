# Keji Visuals

Website for Keji Visuals (photo + film studio). Next.js (App Router) + Payload CMS in one app, Postgres on Neon, media on Cloudflare R2.

Project brief and decisions: `CLAUDE.md` and `docs/`.

## Local setup

1. Node `^22.23.4 || >=24.22.1`, npm.
2. `cp .env.example .env.local` and fill in the values (ask Monie — never commit them).
3. `npm install`
4. `npm run dev` → site at http://localhost:3000, admin at http://localhost:3000/admin

## Environments

| Environment | Git branch | Neon | R2 bucket | Who sees it |
|---|---|---|---|---|
| Local + tests | any | `dev` branch | dev bucket | Monie |
| Vercel Preview | feature branches | `dev` branch | dev bucket | Vercel login only |
| Vercel Production = staging until launch | `main` | main | `keji-visuals-media` | Public URL, `noindex` |

Keji's real content lives only in the main database and the main bucket. Tests and experiments use the `dev` branch and the dev bucket, so deleting media there never removes his files. At launch, Keji's domain is added to the Production environment and `ALLOW_INDEXING=true` is set there.

## R2 bucket CORS

Admin uploads go from the browser straight to R2 (`clientUploads`), so the bucket's CORS policy must allow every origin the admin runs on. Replace the whole policy rather than adding a rule. If an origin is missing, uploads fail in the browser with "NetworkError when attempting to fetch resource".

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://keji-visuals-media-*-monday-ofems-projects.vercel.app"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type", "If-None-Match"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Add the production domain (e.g. `https://kejivisuals.com`) when it exists.

## Scripts

- `npm run dev` — dev server
- `npm run build` / `npm start` — production build
- `npm run payload migrate:create` — create a migration after changing collections
- `npm run ci` — run migrations then build (used by the Vercel build step)
- `npm run generate:types` — regenerate `src/payload-types.ts`
- `npm run lint`, `npm test`
- `npm run seed:dev` — dev-only test content from `images/` (refuses to run on a non-`-dev` bucket)
- `npm run import:keji` — imports Keji's Nov 2026 delivery (`KEJI_PHOTOS=<folder>`). Re-runnable on dev. It prints the
  target database endpoint and bucket first, and **refuses to run against staging** (it would overwrite content edited
  in the admin) unless `KEJI_IMPORT_STAGING=yes` is set. For staging changes, make them in the admin or with a
  small targeted script.

### Running a script against staging

Payload loads `.env.local` (dev) automatically and only uses values not already set in the shell. To target staging,
export the staging values first, but **don't `source` the env file**: the database URL contains an unquoted `&`, so
the shell cuts it off and the script silently falls back to the dev database. Export each line verbatim instead:

```sh
loadenv() { while IFS= read -r l || [ -n "$l" ]; do l="${l%$'\r'}"; case "$l" in ''|\#*) continue;; esac
  k="${l%%=*}"; v="${l#*=}"; v="${v#\"}"; v="${v%\"}"; export "$k=$v"; done < "$1"; }
(loadenv .env.vercel-production && npm run import:keji)
```
