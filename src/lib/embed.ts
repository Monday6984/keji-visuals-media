// YouTube / Vimeo page links → privacy-friendly embed URLs (no cookies until played).

export type Embed = { provider: 'youtube' | 'vimeo'; id: string; src: string }

export function toEmbed(value: string | null | undefined): Embed | null {
  if (!value) return null
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }
  const host = url.hostname.replace(/^(www|m)\./, '')

  let youtubeId: string | null = null
  if (host === 'youtu.be') youtubeId = url.pathname.slice(1)
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    youtubeId = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null
  }
  if (youtubeId && /^[\w-]{6,}$/.test(youtubeId)) {
    return {
      provider: 'youtube',
      id: youtubeId,
      src: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`,
    }
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const vimeoId = url.pathname.match(/(?:^|\/)(\d{5,})(?:\/|$)/)?.[1]
    if (vimeoId) {
      return { provider: 'vimeo', id: vimeoId, src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&dnt=1` }
    }
  }
  return null
}
