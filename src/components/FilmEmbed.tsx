'use client'

import { useState, type ReactNode } from 'react'

import { toEmbed } from '@/lib/embed'

// Click-to-play: shows the poster until the visitor presses play, so no YouTube/Vimeo
// scripts, cookies or data load before then.
export function FilmEmbed({ url, title, poster }: { url: string; title: string; poster?: ReactNode }) {
  const [playing, setPlaying] = useState(false)
  const embed = toEmbed(url)
  if (!embed) return null

  return (
    <div className="relative aspect-video overflow-hidden bg-ink">
      {playing ? (
        <iframe
          src={embed.src}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <>
          {poster}
          <div className="absolute inset-0 bg-ink/35" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute top-1/2 left-1/2 flex size-24 -translate-1/2 items-center justify-center rounded-full border border-cream text-cream transition-colors hover:bg-cream/15 focus-visible:outline-cream"
          >
            <span className="sr-only">Play film: {title}</span>
            <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true" fill="currentColor">
              <path d="M2 1.5v27L24.5 15z" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
