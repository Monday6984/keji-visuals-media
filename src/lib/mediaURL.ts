// Public R2 URL for a stored media file. `folder` is the storage plugin's object folder:
// the collection prefix plus the per-upload `_objectKey` segment added by clientUploads.
export const mediaFileURL = ({ filename, folder }: { filename: string; folder?: string | null }) =>
  [process.env.R2_PUBLIC_URL, folder, encodeURIComponent(filename)].filter(Boolean).join('/')

export const mediaFolder = (doc: { prefix?: string | null; _objectKey?: string | null }) =>
  [doc.prefix, doc._objectKey].filter(Boolean).join('/')
