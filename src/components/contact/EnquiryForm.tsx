'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'

import { submitEnquiry, type EnquiryState } from '@/app/(frontend)/contact/actions'
import { SHOOT_TYPES, shootTypeForCategory, type FieldErrors } from '@/lib/enquiry'

type Prefill = { shootType: string; packageName: string }

// ?type=<category slug>&package=<name> from "Book a similar session" / package links.
const subscribe = () => () => {}
const readPrefill = (): string => window.location.search
const parsePrefill = (search: string): Prefill => {
  const q = new URLSearchParams(search)
  return { shootType: shootTypeForCategory[q.get('type') ?? ''] ?? '', packageName: q.get('package')?.slice(0, 200) ?? '' }
}

const inputClass =
  'mt-2 block w-full rounded-[2px] border border-cream/35 bg-transparent px-4 py-3 text-base text-cream placeholder:text-stone/70 focus-visible:border-olive-light focus-visible:outline-olive-light aria-invalid:border-[#E8A091]'

function Field({
  id,
  label,
  error,
  hint,
  required,
  children,
  wide,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <label htmlFor={id} className="cap font-semibold text-mist">
        {label}
        {required ? <span aria-hidden="true"> *</span> : <span className="font-normal text-stone"> (optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="m-0 mt-1.5 text-sm text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="m-0 mt-1.5 text-sm text-[#F2B8AC]">
          {error}
        </p>
      )}
    </div>
  )
}

const LABELS: Record<keyof FieldErrors, string> = {
  names: 'Your names',
  email: 'Email',
  phone: 'Phone / WhatsApp',
  shootType: 'Type of shoot',
  date: 'Date',
  location: 'Location',
  package: 'Package',
  message: 'Tell us about your day',
}

export function EnquiryForm({ whatsapp }: { whatsapp?: string | null }) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { status: 'idle' })
  const search = useSyncExternalStore(subscribe, readPrefill, () => '')
  const prefill = parsePrefill(search)
  const [startedAt] = useState(() => Date.now())
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const errors: FieldErrors = state.status === 'error' ? (state.fieldErrors ?? {}) : {}
  // After an error, refill what was typed (React resets forms after each action).
  const v: Record<string, string> =
    state.status === 'error' ? state.values : { shootType: prefill.shootType, package: prefill.packageName }
  const describedBy = (id: keyof FieldErrors, hint = false) =>
    errors[id] ? `${id}-error` : hint ? `${id}-hint` : undefined

  useEffect(() => {
    if (state.status === 'error') summaryRef.current?.focus()
    if (state.status === 'success') successRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="max-w-xl outline-none">
        <p className="cap m-0 mb-4 font-semibold text-olive-light">Enquiry received</p>
        <p className="m-0 font-display text-3xl leading-tight text-cream">Thank you — we’ll be in touch soon.</p>
        <p className="m-0 mt-4 text-lg leading-relaxed text-mist">
          We usually reply within a day or two.
          {whatsapp && (
            <>
              {' '}
              For anything urgent,{' '}
              <a href={whatsapp} className="text-cream underline">
                message us on WhatsApp
              </a>
              .
            </>
          )}
        </p>
      </div>
    )
  }

  // Remount when the pre-fill arrives from the URL so default values apply.
  return (
    <form key={search} action={action} noValidate className="grid gap-6 sm:grid-cols-2">
      {state.status === 'error' && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-[2px] border border-[#E8A091] p-4 text-cream outline-none sm:col-span-2">
          <p className="m-0 font-semibold">{state.message}</p>
          {Object.keys(errors).length > 0 && (
            <ul className="m-0 mt-2 list-disc pl-5 text-sm">
              {(Object.keys(errors) as (keyof FieldErrors)[]).map((k) => (
                <li key={k}>
                  <a href={`#${k}`} className="text-cream underline">
                    {LABELS[k]}: {errors[k]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Field id="names" label="Your names" error={errors.names} required>
        <input id="names" name="names" defaultValue={v.names} type="text" autoComplete="name" placeholder="e.g. Ada & Tunde" required maxLength={200} aria-invalid={Boolean(errors.names)} aria-describedby={describedBy('names')} className={inputClass} />
      </Field>
      <Field id="email" label="Email" error={errors.email} required>
        <input id="email" name="email" defaultValue={v.email} type="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} className={inputClass} />
      </Field>
      <Field id="phone" label="Phone / WhatsApp" error={errors.phone}>
        <input id="phone" name="phone" defaultValue={v.phone} type="tel" autoComplete="tel" maxLength={40} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy('phone')} className={inputClass} />
      </Field>
      <Field id="shootType" label="Type of shoot" error={errors.shootType} required>
        <select id="shootType" name="shootType" required defaultValue={v.shootType ?? ''} aria-invalid={Boolean(errors.shootType)} aria-describedby={describedBy('shootType')} className={`${inputClass} [&_option]:text-ink`}>
          <option value="" disabled>
            Choose one
          </option>
          {SHOOT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>
      <Field id="date" label="Date" error={errors.date} hint="If you have one. An approximate date is fine.">
        <input id="date" name="date" defaultValue={v.date} type="date" aria-invalid={Boolean(errors.date)} aria-describedby={describedBy('date', true)} className={`${inputClass} [color-scheme:dark]`} />
      </Field>
      <Field id="location" label="Location" error={errors.location}>
        <input id="location" name="location" defaultValue={v.location} type="text" placeholder="City / venue" maxLength={200} aria-invalid={Boolean(errors.location)} aria-describedby={describedBy('location')} className={inputClass} />
      </Field>
      <Field id="package" label="Package" error={errors.package} wide>
        <input id="package" name="package" type="text" defaultValue={v.package} placeholder="Not sure yet? Leave this blank." maxLength={200} aria-invalid={Boolean(errors.package)} aria-describedby={describedBy('package')} className={inputClass} />
      </Field>
      <Field id="message" label="Tell us about your day" error={errors.message} wide>
        <textarea id="message" name="message" defaultValue={v.message} rows={5} maxLength={5000} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy('message')} className={inputClass} />
      </Field>

      {/* Spam traps: hidden from people (and assistive tech), filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-2">
        <button type="submit" disabled={pending} aria-disabled={pending} className="btn btn-cream disabled:opacity-70">
          {pending ? 'Sending…' : 'Send enquiry'}
        </button>
        <p className="m-0 text-sm text-stone">
          We use your details only to reply to this enquiry. See our{' '}
          <Link href="/privacy" className="text-mist underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
