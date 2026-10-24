import type { MetadataRoute } from 'next'

// Blocks all crawlers until launch (see ALLOW_INDEXING in next.config.ts). The launch
// version adds the sitemap and keeps /admin and /api disallowed.
export default function robots(): MetadataRoute.Robots {
  if (process.env.ALLOW_INDEXING !== 'true') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  }
}
