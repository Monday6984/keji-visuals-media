// Small display helpers shared by pages.

/** Contact-sheet frame number, e.g. 14 → "014". */
export const frameNo = (n: number) => String(n).padStart(3, '0')

/** "June 2026" */
export const monthYear = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : null

/**
 * Splits a title for the two-tone headline: the part after "&" (or the last word) is
 * shown in olive. "Tolu & Femi" → ["Tolu &", "Femi"].
 */
export const twoTone = (title: string): [string, string] => {
  const amp = title.lastIndexOf('&')
  if (amp > 0) return [title.slice(0, amp + 1).trim(), title.slice(amp + 1).trim()]
  const space = title.trim().lastIndexOf(' ')
  return space > 0 ? [title.slice(0, space), title.slice(space + 1)] : ['', title]
}
