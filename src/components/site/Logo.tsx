import { LOCKUP_MARK, LOCKUP_VIEWBOX, LOCKUP_WORD } from './logoPaths'

// Keji's horizontal lockup from his Illustrator file. His logo is all gold (#AAA06D), which is
// too faint on cream at header size, so the mark uses olive-display (his stroke colour, darker)
// and the wordmark uses ink. Callers name it (the header link has an aria-label).
export function Logo({ small = false }: { small?: boolean }) {
  return (
    <svg
      viewBox={LOCKUP_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={`block w-auto ${small ? 'h-[18px]' : 'h-[20px] lg:h-[23px]'}`}
    >
      <path d={LOCKUP_MARK} className="fill-olive-display" />
      <path d={LOCKUP_WORD} className="fill-ink" />
    </svg>
  )
}
