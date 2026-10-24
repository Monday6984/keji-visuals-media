// Justified rows for story chapters. Each photo becomes a flex item that grows in
// proportion to its aspect ratio, so every photo in a row ends up the same height.
// Rows aim for a combined aspect ratio of `target` (2.4 ≈ three portraits); breathers sit
// on a row of their own. An unfinished last row gets a spacer so it keeps the normal row
// height instead of stretching one photo to full width.

export type RowItem = { ar: number; breather?: boolean }

export type Row<T> = {
  items: T[]
  breather: boolean
  /** Spacer to append (in aspect-ratio units) so a short last row keeps its height. */
  spacer: number
}

export function buildRows<T extends RowItem>(items: T[], target = 2.4, maxPerRow = 4): Row<T>[] {
  const rows: Row<T>[] = []
  let current: T[] = []
  let sum = 0

  const flush = () => {
    if (!current.length) return
    rows.push({ items: current, breather: false, spacer: 0 })
    current = []
    sum = 0
  }

  for (const item of items) {
    if (item.breather) {
      flushShort()
      rows.push({ items: [item], breather: true, spacer: 0 })
      continue
    }
    current.push(item)
    sum += item.ar
    if (sum >= target * 0.9 || current.length >= maxPerRow) flush()
  }
  flushShort()
  return rows

  // A leftover shorter than a full row: merge a lone small remainder into the previous
  // row when it has room, otherwise keep it with a spacer.
  function flushShort() {
    if (!current.length) return
    const prev = rows[rows.length - 1]
    if (sum < target * 0.5 && prev && !prev.breather && prev.items.length + current.length <= maxPerRow) {
      prev.items.push(...current)
      current = []
      sum = 0
      return
    }
    if (sum < target * 0.9) {
      rows.push({ items: current, breather: false, spacer: target - sum })
      current = []
      sum = 0
      return
    }
    flush()
  }
}
