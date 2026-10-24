// Stand-in mark from the pitch mockup. Replace with Keji's real logo files (SVG, kept in
// the codebase rather than the CMS) when he supplies them.
export function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <svg
        width={small ? 26 : 34}
        height={small ? 17 : 22}
        viewBox="0 0 34 22"
        aria-hidden="true"
        fill="none"
        stroke="#8A8150"
        strokeWidth={small ? 2.4 : 2.2}
        strokeLinejoin="round"
      >
        <path d="M2 2 L10 11 L2 20" />
        <path d="M9 2 L17 11 L9 20" />
        <path d="M17 2 L24 20 L32 2" />
      </svg>
      <span className={`font-display tracking-[0.16em] text-ink ${small ? 'text-[15px]' : 'text-xl'}`}>
        KEJI VISUALS
      </span>
    </span>
  )
}
