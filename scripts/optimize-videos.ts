/**
 * Makes the site videos light: 720p (or smaller), H.264 MP4 that starts playing while it loads,
 * sound kept for the enlarged player. .mov files become .mp4 as well.
 *
 * Run on the server:   npm run videos:optimize
 * Videos that were already optimised (name ends with "-720p") are skipped.
 */
import 'dotenv/config'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

function ffmpegPath() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' })
    return 'ffmpeg'
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('ffmpeg-static') as string
  }
}

async function run() {
  const ffmpeg = ffmpegPath()
  const payload = await getPayload({ config })
  const videos = await payload.find({ collection: 'media', where: { mimeType: { like: 'video/' } }, depth: 0, limit: 200, pagination: false })
  const staticDir = path.resolve('media')
  let done = 0, skipped = 0, failed = 0
  for (const v of videos.docs) {
    if (!v.filename) continue
    const base = v.filename.replace(/\.[^.]+$/, '')
    if (base.endsWith('-720p')) { skipped++; continue }
    const input = path.join(staticDir, v.filename)
    const output = path.join(os.tmpdir(), `${base}-720p.mp4`)
    try {
      execFileSync(ffmpeg, [
        '-y', '-i', input,
        // At most 1280 px wide / 720 px high, keep the shape, even sizes for H.264.
        '-vf', "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2",
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-profile:v', 'main',
        '-c:a', 'aac', '-b:a', '96k', '-ac', '2',
        '-movflags', '+faststart',
        output,
      ], { stdio: 'ignore' })
      const data = fs.readFileSync(output)
      await payload.update({
        collection: 'media',
        id: v.id,
        data: {},
        file: { data, mimetype: 'video/mp4', name: path.basename(output), size: data.length },
      })
      fs.unlinkSync(output)
      done++
      console.log(`✓ ${v.filename}: ${((v.filesize ?? 0) / 1e6).toFixed(1)} MB → ${(data.length / 1e6).toFixed(1)} MB`)
    } catch (e) {
      failed++
      console.warn(`✗ ${v.filename}: ${(e as Error).message.split('\n')[0]}`)
    }
  }
  console.log(`\nGotovo: smanjeno ${done}, već smanjeno ${skipped}, greške ${failed}.`)
  process.exit(0)
}

void run()
