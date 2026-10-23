import type { CollectionBeforeChangeHook, CollectionConfig, ImageSize } from 'payload'
import sharp from 'sharp'

import type { Media as MediaDoc } from '@/payload-types'
import { mediaFileURL, mediaFolder } from '@/lib/mediaURL'

// Served widths for the custom next/image loader. Originals are never linked publicly.
const widths = { sm: 640, md: 1024, lg: 1600, xl: 2400 } as const

const imageSizes: ImageSize[] = Object.entries(widths).map(([name, width]) => ({
  name,
  width,
  withoutEnlargement: true,
  formatOptions: { format: 'webp', options: { quality: 80 } },
}))

// Tiny blurred WebP stored inline for the placeholder. With clientUploads the server
// streams the original from R2 to a temp file, so req.file.data is empty and the bytes
// live at req.file.tempFilePath.
export const generateBlurDataURL: CollectionBeforeChangeHook = async ({ data, req }) => {
  const file = req.file
  if (!file) return data

  const input = file.data?.length ? file.data : file.tempFilePath
  if (!input) {
    req.payload.logger.warn(`media: no file bytes available for blur placeholder (${file.name})`)
    return data
  }

  try {
    const blur = await sharp(input)
      .rotate()
      .resize(16, 16, { fit: 'inside' })
      .webp({ quality: 50 })
      .toBuffer()
    data.blurDataURL = `data:image/webp;base64,${blur.toString('base64')}`
  } catch (err) {
    req.payload.logger.error({ err, msg: `media: blur placeholder failed (${file.name})` })
  }

  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'width', 'height', 'updatedAt'],
  },
  hooks: {
    beforeChange: [generateBlurDataURL],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the photo for people who cannot see it, e.g. "Bride in green gele laughing".',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'blurDataURL',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    // A function, because Payload builds a string thumbnail from the stored (local) size URL
    // rather than the R2 URL the storage plugin generates.
    adminThumbnail: ({ doc }) => {
      const sm = (doc as Partial<MediaDoc>).sizes?.sm
      return sm?.filename ? mediaFileURL({ filename: sm.filename, folder: mediaFolder(doc) }) : null
    },
    focalPoint: true,
    crop: true,
    imageSizes,
  },
}
