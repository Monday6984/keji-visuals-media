import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/LegalPage'
import { getSiteSettings } from '@/lib/data'
import { BOOK_HREF } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Booking terms',
  description: 'How booking payments, cancellation, travel and delivery work when you book Keji Visuals.',
}

// Booking payment, balance and turnaround come from Site Settings → Booking; the rest is
// from Keji's rate card (Nov 2026). Bracketed items are still waiting for his answers.
export default async function BookingTermsPage() {
  const s = await getSiteSettings()
  const deposit = s.depositPercent != null ? `${s.depositPercent}%` : '[X]%'
  const balance = s.depositPercent != null ? `${100 - s.depositPercent}%` : 'remaining'

  return (
    <LegalPage
      title={['Booking', 'terms']}
      draft="Items in [brackets] are still being confirmed. Your written confirmation from Keji Visuals is what applies to your booking."
    >
      <h2>Securing your date</h2>
      <p>
        Your date is secured with a {deposit} booking payment once we’ve confirmed we’re available. We recommend making it
        at least one to two months before your wedding so everything can be planned properly. Until then, the date
        stays open to other enquiries.
      </p>

      <h2>Payments</h2>
      <p>The {balance} balance is due {s.balanceDue || '[when]'}.</p>
      <p>[Accepted payment methods.]</p>

      <h2>Cancellation</h2>
      <p>
        Your booking reserves the date for you alone, so 30% of the booking payment is
        non-refundable if the event is cancelled after booking.
      </p>
      <p>[Whether a date can be moved, and how much notice is needed.]</p>

      <h2>Travel and accommodation</h2>
      <p>
        So our team arrives rested and ready, we ask that hotel accommodation is provided for the Keji Visuals team. For
        weddings outside Western Nigeria or outside the country, transport and logistics cost extra. We agree these with you
        in advance, so there are no surprises.
      </p>

      <h2>Your photographs and film</h2>
      <ul>
        <li>Your couple first-look photos within 72 hours of the wedding.</li>
        <li>Your full gallery of edited photos within {s.turnaround || '2–4 weeks'}, in a lifetime online gallery.</li>
        <li>Your photobook, frames and other package items within 7–8 weeks.</li>
      </ul>
      <p>[Whether Keji may share selected images from your day in his portfolio, and how to opt out.]</p>

      <h2>Questions</h2>
      <p>
        Ask us anything before you book. <Link href={BOOK_HREF}>Send an enquiry</Link> or see the{' '}
        <Link href="/packages">packages page</Link>. How we handle your details is set out in our{' '}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </LegalPage>
  )
}
