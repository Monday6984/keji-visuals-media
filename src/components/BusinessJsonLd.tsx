import type { SiteSetting } from '@/payload-types'

// schema.org LocalBusiness for search results (name, contact, area served, socials).
export function BusinessJsonLd({ settings }: { settings: SiteSetting }) {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  const share = typeof settings.shareImage === 'object' ? settings.shareImage?.url : undefined
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Keji Visuals',
    description: 'Wedding-led photography and film: weddings, pre-weddings, events, portraits and films.',
    slogan: 'Timeless. Genuine. Beautiful.',
    url,
    image: share,
    email: settings.email ?? undefined,
    telephone: settings.phone ?? undefined,
    founder: { '@type': 'Person', name: 'Ayomideji Morenikeji Omolegan' },
    areaServed: settings.serviceArea ?? undefined,
    address: settings.city ? { '@type': 'PostalAddress', addressLocality: settings.city, addressCountry: 'NG' } : undefined,
    sameAs: settings.socials?.map((s) => s.url),
  }
  // Escape "<" so content can never close the script tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
