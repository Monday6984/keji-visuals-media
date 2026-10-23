import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Enquiries } from './collections/Enquiries'
import { FAQs } from './collections/FAQs'
import { Films } from './collections/Films'
import { Media } from './collections/Media'
import { Packages } from './collections/Packages'
import { Stories } from './collections/Stories'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { SiteSettings } from './globals/SiteSettings'
import { mediaFileURL } from './lib/mediaURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Categories, Stories, Films, Packages, Testimonials, FAQs, Enquiries, Media, Users],
  globals: [SiteSettings, About],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Schema changes go through migrations only (`payload migrate:create`), so local dev
    // and deployed builds never drift on the shared Neon database.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    // Cloudflare R2 through its S3 API. clientUploads sends files from the browser straight
    // to R2, bypassing Vercel's 4.5 MB request limit; the server then fetches the original
    // back to generate image sizes.
    s3Storage({
      alwaysInsertFields: true,
      bucket: process.env.R2_BUCKET || '',
      clientUploads: true,
      collections: {
        media: {
          prefix: 'media',
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => mediaFileURL({ filename, folder: prefix }),
        },
      },
      config: {
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
