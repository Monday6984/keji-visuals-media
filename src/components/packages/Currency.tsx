'use client'

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react'

import { displayPrice, type Currency } from '@/lib/price'

// ₦/£ choice shared by package cards and add-ons, remembered in this browser.
const KEY = 'kv-currency'
const CurrencyContext = createContext<{ currency: Currency; setCurrency: (c: Currency) => void }>({
  currency: 'NGN',
  setCurrency: () => {},
})

const readStored = (): Currency | null => {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'GBP' || v === 'NGN' ? v : null
  } catch {
    return null
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(() => () => {}, readStored, () => null)
  const [chosen, setChosen] = useState<Currency | null>(null)
  const currency = chosen ?? stored ?? 'NGN'

  const setCurrency = (c: Currency) => {
    setChosen(c)
    try {
      window.localStorage.setItem(KEY, c)
    } catch {
      // Storage unavailable (private mode): the choice still applies for this visit.
    }
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>
}

export function CurrencyToggle({ note }: { note?: string | null }) {
  const { currency, setCurrency } = useContext(CurrencyContext)
  return (
    <div className="flex flex-col items-start gap-2.5">
      <span id="currency-label" className="cap text-muted">
        Show prices in
      </span>
      <div role="group" aria-labelledby="currency-label" className="flex gap-1 rounded-full border border-ink/25 p-1">
        {(['NGN', 'GBP'] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={currency === c}
            onClick={() => setCurrency(c)}
            className={`cap min-h-10 rounded-full px-4 font-semibold ${currency === c ? 'bg-ink text-cream' : 'text-ink'}`}
          >
            {c === 'NGN' ? '₦ NGN' : '£ GBP'}
          </button>
        ))}
      </div>
      {currency === 'GBP' && note && <p className="m-0 max-w-xs text-sm text-muted">{note}</p>}
    </div>
  )
}

type PriceProps = {
  item: Parameters<typeof displayPrice>[0]
  size?: 'lg' | 'sm'
  mutedClass?: string
}

/** A price in the visitor's chosen currency. */
export function Price({ item, size = 'lg', mutedClass = 'text-muted' }: PriceProps) {
  const { currency } = useContext(CurrencyContext)
  const p = displayPrice(item, currency)
  return (
    <span className="inline-flex flex-wrap items-baseline gap-2">
      {p.prefix && <span className={`text-sm ${mutedClass}`}>{p.prefix}</span>}
      <strong className={`font-display font-medium ${size === 'lg' ? 'text-4xl' : 'text-lg'}`}>{p.amount ?? p.label}</strong>
    </span>
  )
}
