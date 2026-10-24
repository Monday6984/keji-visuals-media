// Price display for packages and add-ons, following each item's priceDisplay setting.

export type Currency = 'NGN' | 'GBP'

type Priced = {
  priceDisplay: 'exact' | 'from' | 'enquire'
  priceNGN?: number | null
  priceGBP?: number | null
}

export const formatMoney = (amount: number, currency: Currency) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount)

/**
 * { prefix, amount } for display, e.g. { prefix: 'from', amount: '₦650,000' }.
 * "Price on enquiry" items, and £ requests for items without a £ price, return amount null.
 */
export function displayPrice(item: Priced, currency: Currency = 'NGN') {
  if (item.priceDisplay === 'enquire') return { prefix: 'Priced', amount: null as string | null, label: 'on enquiry' }
  const value = currency === 'GBP' ? item.priceGBP : item.priceNGN
  if (value == null) return { prefix: 'Priced', amount: null as string | null, label: 'on enquiry' }
  return { prefix: item.priceDisplay === 'from' ? 'from' : '', amount: formatMoney(value, currency), label: '' }
}
