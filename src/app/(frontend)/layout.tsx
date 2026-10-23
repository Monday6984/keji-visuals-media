import type { Metadata } from 'next'
import { Cinzel, Montserrat } from 'next/font/google'
import React from 'react'
import './globals.css'

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })

export const metadata: Metadata = {
  title: 'Keji Visuals',
  description: 'Wedding, portrait and event photography and film. Timeless. Genuine. Beautiful.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
