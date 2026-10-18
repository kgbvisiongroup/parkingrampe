/**
 * Makes the site videos light but sharp: Full HD at most (1920 px on the long side, so upright
 * phone videos stay 1080×1920), H.264 MP4 that starts playing while it loads, sound kept for the
 * enlarged player. .mov files become .mp4 as well.
 *
 * Run on the server:   npm run videos:optimize
 *
 * Videos made by the first version of this script ("-720p", too small for upright phone videos)
 * can be made again from the originals:
 *   npm run videos:optimize -- media.bak
 * (the folder with the original files, e.g. the backup made before the first run).
 * Videos that are already done (name ends with "-hd") are skipped.
 */
import 'dotenv/config'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function ffmpegPath() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' })
    return 'ffmpeg'
  } catch {
    // No ffmpeg on the server: use the copy installed by npm (ffmpeg-static).
    const mod = (await import('ffmpeg-static')) as unknown as { default: string | null }
    if (!mod.default) throw new Error('ffmpeg nije pronađen. Pokrenite npm install.')
    return mod.default
  }
}

/** The original of a "-720p" video in the backup folder (same name, any video extension). */
function findOriginal(dir: string, base: string) {
  const want = base.replace(/-720p$/, '')
  const hit = fs.readdirSync(dir).find((f) => f.replace(/\.[^.]+$/, '') === want && /\.(mp4|mov|m4v|webm)$/i.test(f))
  return hit ? path.join(dir, hit) : null
}

async function run() {
  const ffmpeg = await ffmpegPath()
  const originals = process.argv[2] ? path.resolve(process.argv[2]) : null
  if (originals && !fs.existsSync(originals)) {
    console.error(`Folder ${originals} ne postoji.`)
    process.exit(1)
  }
  const payload = await getPayload({ config })
  const videos = await payload.find({ collection: 'media', where: { mimeType: { like: 'video/' } }, depth: 0, limit: 200, pagination: false })
  const staticDir = path.resolve('media')
  let done = 0, skipped = 0, failed = 0, missing = 0
  for (const v of videos.docs) {
    if (!v.filename) continue
    const base = v.filename.replace(/\.[^.]+$/, '')
    if (base.endsWith('-hd')) { skipped++; continue }
    let input = path.join(staticDir, v.filename)
    if (base.endsWith('-720p')) {
      const orig = originals ? findOriginal(originals, base) : null
      if (!orig) { missing++; console.warn(`! ${v.filename}: nema originala${originals ? ` u ${originals}` : ' (pokrenite sa folderom originala)'}`); continue }
      input = orig
    }
    const clean = base.replace(/-720p$/, '')
    const output = path.join(os.tmpdir(), `${clean}-hd.mp4`)
    try {
      execFileSync(ffmpeg, [
        '-y', '-i', input,
        // Long side at most 1920 px (landscape 1920×1080, upright 1080×1920), never enlarged; even sizes for H.264.
        '-vf', "scale='if(gte(iw,ih),min(1920,iw),-2)':'if(gte(iw,ih),-2,min(1920,ih))',scale=trunc(iw/2)*2:trunc(ih/2)*2",
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
        '-c:a', 'aac', '-b:a', '128k', '-ac', '2',
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
      console.log(`✓ ${path.basename(input)} → ${path.basename(output)} (${(data.length / 1e6).toFixed(1)} MB)`)
    } catch (e) {
      failed++
      console.warn(`✗ ${v.filename}: ${(e as Error).message.split('\n')[0]}`)
    }
  }
  console.log(`\nGotovo: obrađeno ${done}, već gotovo ${skipped}, bez originala ${missing}, greške ${failed}.`)
  process.exit(0)
}

void run()
