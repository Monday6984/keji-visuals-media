import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/LegalPage'
import { getSiteSettings } from '@/lib/data'
import { BOOK_HREF } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Booking terms',
  description: 'How deposits, payments, rescheduling and delivery work when you book Keji Visuals.',
}

// Deposit, balance and turnaround come from Site Settings → Booking. Bracketed items are
// placeholders for Keji's own terms (requested in the client asset list).
export default async function BookingTermsPage() {
  const s = await getSiteSettings()
  const deposit = s.depositPercent != null ? `${s.depositPercent}%` : '[X]%'

  return (
    <LegalPage
      title={['Booking', 'terms']}
      draft="These terms are an outline. Items in [brackets] are waiting for Keji’s own terms; your signed agreement is what applies to your booking."
    >
      <h2>Securing your date</h2>
      <p>
        Your date is held once we receive a {deposit} deposit and your signed agreement. Until then, the date stays
        available to other enquiries.
      </p>

      <h2>Payments</h2>
      <p>The remaining balance is due {s.balanceDue || '[when — e.g. two weeks before the day]'}.</p>
      <p>[Accepted payment methods, and how £ prices for UK-based clients are paid.]</p>

      <h2>Rescheduling and cancellation</h2>
      <p>[What happens to the deposit if you move or cancel your date, and how much notice is needed.]</p>

      <h2>On the day</h2>
      <p>[Coverage hours, meals and breaks for the team, travel beyond the service area, and overtime.]</p>

      <h2>Your photographs and film</h2>
      <p>
        Edited images are delivered to a private online gallery{s.turnaround ? ` within ${s.turnaround}` : ' [within N weeks]'}.
        [Film delivery times, how long galleries stay online, and print or usage rights.]
      </p>
      <p>[Whether Keji may share selected images from your day in his portfolio, and how to opt out.]</p>

      <h2>Questions</h2>
      <p>
        Ask us anything before you book — <Link href={BOOK_HREF}>send an enquiry</Link> or see the{' '}
        <Link href="/packages">packages page</Link>. How we handle your details is set out in our{' '}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </LegalPage>
  )
}
