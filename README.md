# Keji Visuals

Website for Keji Visuals (photo + film studio). Next.js (App Router) + Payload CMS in one app, Postgres on Neon, media on Cloudflare R2.

Project brief and decisions: `CLAUDE.md` and `docs/`.

## Local setup

1. Node `^22.23.4 || >=24.22.1`, npm.
2. `cp .env.example .env.local` and fill in the values (ask Monie — never commit them).
3. `npm install`
4. `npm run dev` → site at http://localhost:3000, admin at http://localhost:3000/admin

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
