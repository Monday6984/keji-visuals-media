'use client'

import 'photoswipe/style.css'

import type PhotoSwipeLightbox from 'photoswipe/lightbox'
import { useEffect } from 'react'

// Full-screen dark viewer for every <a data-pswp-width> inside #galleryId. Without JS the
// links still open the largest generated size. PhotoSwipe handles keyboard (← → Esc),
// swipe, pinch-zoom, and returns focus to the photo that opened it.
export function Lightbox({ galleryId }: { galleryId: string }) {
  useEffect(() => {
    let lightbox: PhotoSwipeLightbox | undefined
    let cancelled = false
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    import('photoswipe/lightbox').then(({ default: Lightbox }) => {
      if (cancelled) return
      lightbox = new Lightbox({
        gallery: `#${galleryId}`,
        children: 'a[data-pswp-width]',
        pswpModule: () => import('photoswipe'),
        bgOpacity: 1,
        showHideAnimationType: reduceMotion ? 'none' : 'zoom',
        closeTitle: 'Close viewer',
        arrowPrevTitle: 'Previous frame',
        arrowNextTitle: 'Next frame',
        zoomTitle: 'Zoom',
        indexIndicatorSep: ' / ',
      })

      // Contact-sheet caption under each photo: "No. 014 · Traditional ceremony".
      lightbox.on('uiRegister', () => {
        lightbox?.pswp?.ui?.registerElement({
          name: 'kv-caption',
          order: 9,
          isButton: false,
          appendTo: 'root',
          onInit: (el, pswp) => {
            el.className = 'kv-pswp-caption cap'
            el.setAttribute('aria-live', 'polite')
            pswp.on('change', () => {
              el.textContent = pswp.currSlide?.data.element?.dataset.caption ?? ''
            })
          },
        })
      })

      lightbox.init()
    })

    return () => {
      cancelled = true
      lightbox?.destroy()
    }
  }, [galleryId])

  return null
}
