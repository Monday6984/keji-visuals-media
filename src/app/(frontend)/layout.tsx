import type { Metadata } from 'next'
import { Cinzel, Montserrat } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { MobileBar } from '@/components/site/MobileBar'
import { getSiteSettings } from '@/lib/data'
import './globals.css'

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })

const DEFAULT_DESCRIPTION = 'Wedding, portrait and event photography and film. Timeless. Genuine. Beautiful.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings.seoTitle || 'Keji Visuals'
  const description = settings.seoDescription || DEFAULT_DESCRIPTION
  const share = typeof settings.shareImage === 'object' ? settings.shareImage : null

  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
    title: { default: title, template: '%s · Keji Visuals' },
    description,
    openGraph: {
      siteName: 'Keji Visuals',
      type: 'website',
      locale: 'en_NG',
      images: share?.url ? [{ url: share.url, width: share.width ?? undefined, height: share.height ?? undefined }] : [],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable}`}>
      <body className="min-h-svh">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-ink px-5 py-3 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Header whatsapp={settings.whatsapp} />
        <main id="main">{children}</main>
        <Footer socials={settings.socials} />
        <MobileBar whatsapp={settings.whatsapp} />
      </body>
    </html>
  )
}
