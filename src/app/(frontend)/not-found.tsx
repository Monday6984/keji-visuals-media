import Link from 'next/link'

export const metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60svh] max-w-3xl flex-col justify-center gap-6 px-4 py-20 sm:px-6">
      <p className="cap font-semibold text-olive-deep">No. 404 · Not in the archive</p>
      <h1 className="m-0 font-display text-4xl leading-tight font-medium text-ink sm:text-6xl">
        This frame <span className="text-olive-display">didn’t make the edit.</span>
      </h1>
      <p className="m-0 max-w-prose text-lg leading-relaxed">
        The page may have moved, or the link may be mistyped. The work is still here.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/portfolio" className="btn btn-ink">
          View the work
        </Link>
        <Link href="/" className="btn btn-line">
          Home
        </Link>
      </div>
    </section>
  )
}
