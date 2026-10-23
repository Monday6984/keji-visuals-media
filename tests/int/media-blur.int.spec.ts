import { mkdtemp, rm, writeFile } from 'fs/promises'
import os from 'os'
import path from 'path'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { generateBlurDataURL } from '@/collections/Media'

// The hook only touches req.file and req.payload.logger.
const run = (file: Record<string, unknown> | undefined) => {
  const logger = { error: vi.fn(), warn: vi.fn() }
  const req = { file, payload: { logger } }
  const result = generateBlurDataURL({ data: {}, req } as unknown as Parameters<
    typeof generateBlurDataURL
  >[0])
  return { logger, result: result as Promise<Record<string, unknown>> }
}

describe('Media blurDataURL hook', () => {
  let jpeg: Buffer
  let dir: string

  beforeAll(async () => {
    jpeg = await sharp({
      create: { width: 400, height: 600, channels: 3, background: '#A9A06B' },
    })
      .jpeg()
      .toBuffer()
    dir = await mkdtemp(path.join(os.tmpdir(), 'keji-blur-'))
  })

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('uses the in-memory buffer for server uploads', async () => {
    const { result } = run({ name: 'a.jpg', data: jpeg })
    expect((await result).blurDataURL).toMatch(/^data:image\/webp;base64,/)
  })

  it('reads the temp file for client uploads (empty data buffer)', async () => {
    const tempFilePath = path.join(dir, 'client-upload')
    await writeFile(tempFilePath, jpeg)
    const { result } = run({ name: 'b.jpg', data: Buffer.alloc(0), tempFilePath })
    const blur = (await result).blurDataURL as string
    const meta = await sharp(Buffer.from(blur.split(',')[1], 'base64')).metadata()
    expect(meta.format).toBe('webp')
    expect(Math.max(meta.width ?? 0, meta.height ?? 0)).toBe(16)
  })

  it('leaves data unchanged when no file is attached', async () => {
    const { result } = run(undefined)
    expect(await result).toEqual({})
  })

  it('warns instead of failing when there are no bytes', async () => {
    const { logger, result } = run({ name: 'c.jpg', data: Buffer.alloc(0) })
    expect((await result).blurDataURL).toBeUndefined()
    expect(logger.warn).toHaveBeenCalled()
  })
})
