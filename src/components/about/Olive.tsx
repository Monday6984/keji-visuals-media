import { splitOlive } from '@/lib/about'

/** Two-tone text: the olive phrase in olive-display, the rest inherits. */
export function Olive({ text, olive, className = 'text-olive-display' }: { text: string; olive?: string | null; className?: string }) {
  const [before, accent, after] = splitOlive(text, olive)
  return (
    <>
      {before}
      {accent && <span className={className}>{accent}</span>}
      {after}
    </>
  )
}
