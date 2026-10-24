import type { Metadata } from 'next'
import Link from 'next/link'

import { FAQList } from '@/components/FAQList'
import { CurrencyProvider, CurrencyToggle, Price } from '@/components/packages/Currency'
import { Tabs } from '@/components/packages/Tabs'
import { getCategories, getFAQs, getPackages, getSiteSettings } from '@/lib/data'
import { BOOK_HREF } from '@/lib/site'
import type { Category, Package } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Packages & rates',
  description: 'Wedding, pre-wedding, event, portrait and film packages with clear starting prices.',
}

function PackageCard({ pkg, category }: { pkg: Package; category: Category }) {
  const hot = Boolean(pkg.mostBooked)
  const items = [pkg.duration, pkg.imageCount, pkg.turnaround, ...(pkg.inclusions ?? []).map((i) => i.item)].filter(Boolean)
  const enquire = `${BOOK_HREF}?type=${encodeURIComponent(category.slug)}&package=${encodeURIComponent(pkg.name)}`

  return (
    <article
      aria-labelledby={`pkg-${pkg.id}`}
      className={`flex flex-col gap-4 p-7 sm:p-9 ${hot ? 'bg-ink text-cream' : 'border border-ink/20 bg-paper text-ink'}`}
    >
      <div className="flex min-h-6.5 items-center justify-between gap-3">
        {pkg.tier && <span className={`cap font-semibold ${hot ? 'text-olive-light' : 'text-olive-deep'}`}>{pkg.tier}</span>}
        {hot && <span className="cap rounded-full bg-olive-light px-3 py-1.5 font-semibold text-ink">Most booked</span>}
      </div>
      <h3 id={`pkg-${pkg.id}`} className="m-0 font-display text-3xl leading-[1.15] font-medium">
        {pkg.name}
      </h3>
      {pkg.tagline && <p className={`m-0 text-[15px] leading-relaxed ${hot ? 'text-mist' : 'text-body'}`}>{pkg.tagline}</p>}
      <p className="m-0 mt-1.5">
        <Price item={pkg} mutedClass={hot ? 'text-mist' : 'text-muted'} />
      </p>
      {items.length > 0 && (
        <ul className={`m-0 mt-2 flex list-none flex-col gap-2.5 border-t p-0 pt-4.5 ${hot ? 'border-cream/25' : 'border-ink/18'}`}>
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] leading-normal">
              <span aria-hidden="true" className={hot ? 'text-olive-light' : 'text-olive-deep'}>
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}
      <Link href={enquire} className={`btn mt-auto ${hot ? 'btn-cream' : 'btn-line'}`}>
        Enquire about this package<span className="sr-only">: {pkg.name}</span>
      </Link>
    </article>
  )
}

export default async function PackagesPage() {
  const [packages, categories, settings, beforeYouBook, packageFAQs] = await Promise.all([
    getPackages(),
    getCategories(),
    getSiteSettings(),
    getFAQs('beforeYouBook'),
    getFAQs('packages'),
  ])

  const tabs = categories
    .map((category) => ({
      category,
      items: packages.filter((p) => (typeof p.category === 'object' ? p.category?.id : p.category) === category.id),
    }))
    .filter((t) => t.items.length)
    .map(({ category, items }) => ({
      id: category.slug,
      label: category.name,
      panel: (
        <section aria-label={`${category.name} packages`} className="mx-auto max-w-[1360px] px-4 pt-12 sm:px-6 lg:px-10">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
            {items.map((p) => (
              <PackageCard key={p.id} pkg={p} category={category} />
            ))}
          </div>
        </section>
      ),
    }))

  const hasGBP = packages.some((p) => p.priceGBP != null) || (settings.addOns ?? []).some((a) => a.priceGBP != null)
  const area = settings.serviceArea || settings.city
  const facts = [
    settings.depositPercent != null && { term: 'At booking', value: `${settings.depositPercent}%`, note: 'holds your date' },
    settings.balanceDue && { term: 'Before the day', value: 'Balance', note: `due ${settings.balanceDue}` },
    settings.turnaround && { term: 'Your gallery', value: settings.turnaround, note: '' },
  ].filter((f): f is { term: string; value: string; note: string } => Boolean(f))

  return (
    <CurrencyProvider>
      <header className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-8 px-4 pt-14 pb-10 sm:px-6 lg:px-10 lg:pt-18">
        <div className="min-w-0 flex-[1_1_520px]">
          <p className="cap m-0 mb-5.5 font-semibold text-muted">Packages &amp; rates · {new Date().getFullYear()}</p>
          <h1 className="m-0 font-display text-[clamp(48px,6vw,88px)] leading-[1.02] font-medium text-ink">
            Your day,
            <br />
            <span className="text-olive-display">your way</span>
          </h1>
          <p className="m-0 mt-7 max-w-[560px] text-lg leading-[1.75]">
            Clear starting prices for every kind of story. Every couple is different, so your final quote is confirmed after a
            short call — with nothing hidden.
          </p>
        </div>
        {hasGBP && <CurrencyToggle note={settings.gbpNote} />}
      </header>

      {tabs.length ? (
        <Tabs tabs={tabs} label="Package category" />
      ) : (
        <p className="mx-auto max-w-[1360px] px-4 text-lg sm:px-6 lg:px-10">
          Packages are being finalised. <Link href={BOOK_HREF}>Enquire</Link> and we’ll send current rates.
        </p>
      )}
      <p className="mx-auto max-w-[1360px] px-4 pt-6 pb-24 text-sm text-muted sm:px-6 lg:px-10">
        Prices shown are starting points{area ? ` for ${area}` : ''}. Travel further afield is quoted separately.
      </p>

      {((settings.addOns?.length ?? 0) > 0 || facts.length > 0 || (settings.quoteFactors?.length ?? 0) > 0) && (
        <section className="border-y border-ink/10 bg-paper">
          <div className="mx-auto flex max-w-[1360px] flex-wrap gap-16 px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            {(settings.addOns?.length ?? 0) > 0 && (
              <div className="min-w-0 flex-[1_1_420px]">
                <h2 className="m-0 mb-7 font-display text-4xl font-medium text-ink">
                  Add-<span className="text-olive-display">ons</span>
                </h2>
                <table className="w-full border-collapse text-[15px]">
                  <caption className="cap pb-3 text-left text-muted">Added to any package</caption>
                  <tbody>
                    {settings.addOns!.map((a) => (
                      <tr key={a.id ?? a.name} className="border-t border-ink/18">
                        <th scope="row" className="py-4 text-left font-medium">
                          {a.name}
                        </th>
                        <td className="py-4 text-right">
                          <Price item={a} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-9">
              {facts.length > 0 && (
                <div>
                  <h2 className="m-0 mb-5 font-display text-4xl font-medium text-ink">
                    Securing <span className="text-olive-display">your date</span>
                  </h2>
                  <dl className="m-0 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {facts.map((f) => (
                      <div key={f.term} className="border-t border-ink pt-3.5">
                        <dt className="cap text-muted">{f.term}</dt>
                        <dd className="m-0 mt-2 font-display text-2xl text-ink">{f.value}</dd>
                        {f.note && <dd className="m-0 mt-1 text-sm">{f.note}</dd>}
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {(settings.quoteFactors?.length ?? 0) > 0 && (
                <div>
                  <h3 className="m-0 mb-3.5 font-display text-[22px] font-medium text-ink">What can change your quote</h3>
                  <ul className="m-0 flex list-disc flex-col gap-2 pl-4.5 text-[15px] leading-relaxed">
                    {settings.quoteFactors!.map((q) => (
                      <li key={q.id ?? q.item}>{q.item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {beforeYouBook.length > 0 && (
        <section aria-labelledby="guide-h" className="mx-auto max-w-[1360px] px-4 pt-24 pb-20 sm:px-6 lg:px-10 lg:pt-28">
          <div className="flex flex-wrap gap-16">
            <div className="min-w-0 flex-[1_1_360px]">
              <p className="cap m-0 mb-4.5 font-semibold text-olive-deep">Before you book</p>
              <h2 id="guide-h" className="m-0 mb-5 font-display text-[clamp(34px,3.6vw,52px)] leading-[1.08] font-medium text-ink">
                Questions to ask <span className="text-olive-display">your photographer</span>
              </h2>
              <p className="m-0 leading-[1.7]">Straight answers, before you commit — from Keji’s guide for couples.</p>
            </div>
            <div className="min-w-0 flex-[1.4_1_520px]">
              <FAQList faqs={beforeYouBook} />
            </div>
          </div>
        </section>
      )}

      {packageFAQs.length > 0 && (
        <section aria-labelledby="faq-h" className="mx-auto max-w-[1360px] px-4 pb-24 sm:px-6 lg:px-10">
          <h2 id="faq-h" className="m-0 mb-8 font-display text-4xl font-medium text-ink">
            Package <span className="text-olive-display">questions</span>
          </h2>
          <FAQList faqs={packageFAQs} />
        </section>
      )}

      <section className="bg-ink text-cream">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-10 px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
          <h2 className="m-0 font-display text-[clamp(36px,4.4vw,64px)] leading-[1.05] font-medium">
            Not sure which <span className="text-olive-light">fits?</span>
          </h2>
          <Link href={BOOK_HREF} className="btn btn-cream">
            Tell us about your day
          </Link>
        </div>
      </section>
    </CurrencyProvider>
  )
}
