import type { Metadata } from 'next'

import { EnquiryForm } from '@/components/contact/EnquiryForm'
import { getSiteSettings } from '@/lib/data'
import { whatsappHref } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Book a session',
  description: 'Tell Keji Visuals about your date — weddings, pre-weddings, events, portraits and films.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const wa = whatsappHref(settings.whatsapp, 'Hi Keji, I’d like to ask about a date.')
  const instagram = settings.socials?.find((s) => s.platform === 'instagram')

  return (
    <>
      <header className="mx-auto max-w-[1360px] px-4 pt-14 pb-12 sm:px-6 lg:px-10 lg:pt-18">
        <p className="cap m-0 mb-5 font-semibold text-olive-deep">Book a session</p>
        <h1 className="m-0 font-display text-[clamp(48px,6vw,88px)] leading-[1.02] font-medium text-ink">
          Ready to tell
          <br />
          <span className="text-olive-display">your story?</span>
        </h1>
        <p className="m-0 mt-7 max-w-[560px] text-lg leading-[1.75]">
          Tell us your date, where it’s happening and what you have in mind. We’ll reply with availability and a quote.
        </p>
      </header>

      <section aria-labelledby="enquire-h" className="bg-ink text-cream">
        <div className="mx-auto flex max-w-[1360px] flex-wrap gap-14 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="min-w-0 flex-[1.6_1_560px]">
            <h2 id="enquire-h" className="m-0 mb-8 font-display text-4xl font-medium">
              Your <span className="text-olive-light">enquiry</span>
            </h2>
            <EnquiryForm whatsapp={wa} />
          </div>
          <aside aria-label="Other ways to reach us" className="min-w-0 flex-[1_1_280px] lg:border-l lg:border-cream/15 lg:pl-14">
            <h2 className="cap m-0 mb-6 font-semibold text-olive-light">Prefer to chat?</h2>
            <ul className="m-0 flex list-none flex-col gap-5 p-0 text-lg">
              {wa && (
                <li>
                  <a href={wa} className="btn btn-line-cream w-full">
                    WhatsApp{settings.phone ? ` ${settings.phone}` : ''}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <span className="cap block text-stone">Email</span>
                  <a href={`mailto:${settings.email}`} className="text-cream hover:text-olive-light">
                    {settings.email}
                  </a>
                </li>
              )}
              {instagram && (
                <li>
                  <span className="cap block text-stone">Instagram</span>
                  <a href={instagram.url} className="text-cream hover:text-olive-light" rel="me noopener">
                    {instagram.url.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, '')}
                  </a>
                </li>
              )}
              {(settings.serviceArea || settings.city) && (
                <li>
                  <span className="cap block text-stone">Based in</span>
                  <span className="text-mist">{[settings.city, settings.serviceArea].filter(Boolean).join(' · ')}</span>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
