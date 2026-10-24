import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/LegalPage'
import { getSiteSettings } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Keji Visuals collects and uses personal data from enquiries.',
}

// Structure follows the Nigeria Data Protection Act 2023. Bracketed items need Keji's
// details; the whole text needs a legal review before launch.
export default async function PrivacyPage() {
  const settings = await getSiteSettings()
  const email = settings.email ?? '[contact email]'

  return (
    <LegalPage
      title={['Privacy', 'policy']}
      draft="This policy has not yet been reviewed. Items in [brackets] still need confirming, and the text will be checked against the Nigeria Data Protection Act 2023 before the site launches."
    >
      <h2>Who we are</h2>
      <p>
        Keji Visuals (Ayomideji Morenikeji Omolegan, [business name / registration if applicable], [address or city]) is
        the data controller for personal data collected through this website. You can contact us about privacy at{' '}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>What we collect, and why</h2>
      <p>When you send an enquiry through our form, we collect:</p>
      <ul>
        <li>your name(s) and email address, so we can reply;</li>
        <li>optionally, a phone or WhatsApp number, if you’d like us to contact you that way;</li>
        <li>the type of shoot, date, location, package and message you give us, so we can check availability and prepare a quote.</li>
      </ul>
      <p>
        We use this information only to respond to your enquiry and, if you book, to plan and deliver your session. Our
        lawful basis is taking steps at your request before entering into a contract with you. We don’t use enquiry
        details for marketing, and we don’t sell or share them for anyone else’s marketing.
      </p>
      <p>
        To protect the form from spam, we keep a short-lived, one-way scrambled (hashed) version of the network address
        you send from. It cannot be turned back into your address, it isn’t linked to your enquiry, and it is deleted
        after one hour.
      </p>

      <h2>Who processes it for us</h2>
      <ul>
        <li>Website hosting: Vercel Inc. ([region]).</li>
        <li>Database: Neon (Databricks) ([region]), where enquiries are stored.</li>
        <li>Email delivery: Resend ([region]), which sends your enquiry to us.</li>
        <li>Image storage: Cloudflare R2.</li>
      </ul>
      <p>
        Some of these providers are outside Nigeria. Where personal data is transferred abroad, we rely on [the adequacy
        or safeguard basis permitted under Part VIII of the Act — to be confirmed].
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiries for [12 months] after our last contact if you don’t book, and for [the period needed for
        accounting and contract purposes] if you do. After that, they are deleted.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        This website doesn’t use advertising or tracking cookies. [If analytics are added: we use cookie-less, privacy-
        focused analytics that don’t identify individual visitors.] We remember your currency choice on the packages
        page in your own browser only.
      </p>

      <h2>Your rights</h2>
      <p>Under the Nigeria Data Protection Act 2023 you have the right to:</p>
      <ul>
        <li>ask for a copy of the personal data we hold about you;</li>
        <li>ask us to correct or delete it;</li>
        <li>object to or restrict how we use it, and withdraw consent where we rely on it;</li>
        <li>receive your data in a portable format.</li>
      </ul>
      <p>
        To use any of these rights, email <a href={`mailto:${email}`}>{email}</a>. We’ll respond within [the period set by
        the Act]. If you’re unhappy with how we’ve handled your data, you can complain to the Nigeria Data Protection
        Commission.
      </p>

      <h2>Changes</h2>
      <p>
        If we change this policy, we’ll update this page. See also our <Link href="/booking-terms">booking terms</Link>.
      </p>
    </LegalPage>
  )
}
