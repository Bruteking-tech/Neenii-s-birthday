/**
 * Media guard — run with `npm run verify:media`.
 *
 * Checks that every file the website references really exists in `public/media`,
 * that the recorded pixel sizes still match the actual files (the layouts use
 * them so nothing is ever cropped), and that the excluded files stay excluded.
 *
 * It never modifies or renames anything: the originals are left exactly as
 * they were uploaded.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const photosDir = path.join(root, 'public', 'media', 'photos')
const videosDir = path.join(root, 'public', 'media', 'videos')

/** Must never appear anywhere in the project. */
const EXCLUDED = ['WIN_20261007_01_29_55_Pro.jpg', 'Snapchat-1080653625.mp4']

const EXPECTED = {
  photos: [
    ['Snapchat-129798896.jpg', 1080, 1920],
    ['Snapchat-1371045590.jpg', 1080, 1920],
    ['Snapchat-1804482524.jpg', 1080, 1920],
    ['Snapchat-1904639234.jpg', 1080, 1920],
    ['Snapchat-2103469573.jpg', 1080, 1920],
    ['Snapchat-2120155862.jpg', 1080, 1920],
    ['Snapchat-485998362.jpg', 540, 960],
    ['Snapchat-490527177.jpg', 720, 1280],
    ['Snapchat-522322252.jpg', 1080, 1920],
    ['Snapchat-575918770.jpg', 1080, 1920],
    ['Snapchat-75399844.jpg', 1080, 1920],
    ['WIN_20260817_13_19_20_Pro.jpg', 1280, 720],
    ['WIN_20260817_13_19_26_Pro.jpg', 1280, 720],
    ['WhatsApp Image 2026-10-14 at 4.21.18 PM.jpeg', 540, 307],
    ['WhatsApp Image 2026-10-14 at 4.21.19 PM.jpeg', 720, 1600],
    ['WhatsApp Image 2026-10-14 at 4.21.19 PM (1).jpeg', 1024, 768],
    ['WhatsApp Image 2026-10-14 at 4.21.19 PM (2).jpeg', 750, 500],
    ['WhatsApp Image 2026-10-14 at 4.21.19 PM (3).jpeg', 852, 1600],
  ],
  videos: [
    'Snapchat-1088951076.mp4',
    'Snapchat-1333243989.mp4',
    'Snapchat-1775402273.mp4',
    'Snapchat-1967837298.mp4',
    'Snapchat-454282862.mp4',
    'Snapchat-892045918.mp4',
    'Snapchat-92877993.mp4',
  ],
}

/** Read a JPEG's real pixel size straight from its SOF marker. */
function jpegSize(file) {
  const buffer = fs.readFileSync(file)
  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = buffer[offset + 1]
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { w: buffer.readUInt16BE(offset + 7), h: buffer.readUInt16BE(offset + 5) }
    }
    offset += 2 + buffer.readUInt16BE(offset + 2)
  }
  return null
}

/** MP4 dimensions live in the video track header. */
function mp4Size(file) {
  const buffer = fs.readFileSync(file)
  const findBox = (start, end, want) => {
    let offset = start
    while (offset + 8 <= end) {
      let size = buffer.readUInt32BE(offset)
      const type = buffer.toString('latin1', offset + 4, offset + 8)
      let header = 8
      if (size === 1) {
        size = Number(buffer.readBigUInt64BE(offset + 8))
        header = 16
      }
      if (size === 0) size = end - offset
      if (size < header) break
      if (type === want) return { start: offset + header, end: offset + size }
      offset += size
    }
    return null
  }
  const moov = findBox(0, buffer.length, 'moov')
  if (!moov) return null
  let offset = moov.start
  while (offset + 8 <= moov.end) {
    let size = buffer.readUInt32BE(offset)
    const type = buffer.toString('latin1', offset + 4, offset + 8)
    if (size < 8) break
    if (type === 'trak') {
      const tkhd = findBox(offset + 8, offset + size, 'tkhd')
      if (tkhd) {
        const version = buffer.readUInt8(tkhd.start)
        const base = tkhd.start + (version === 0 ? 76 : 88)
        const w = buffer.readUInt32BE(base) / 65536
        const h = buffer.readUInt32BE(base + 4) / 65536
        if (w > 0 && h > 0) return { w, h }
      }
    }
    offset += size
  }
  return null
}

let failures = 0
const check = (ok, message) => {
  console.log(`${ok ? '  ✓' : '  ✗'} ${message}`)
  if (!ok) failures += 1
}

console.log('\nOriginal media, checked against the website:\n')

console.log(`Photographs — public/media/photos/ (${EXPECTED.photos.length} expected)`)
for (const [name, w, h] of EXPECTED.photos) {
  const file = path.join(photosDir, name)
  if (!fs.existsSync(file)) {
    check(false, `${name} — MISSING`)
    continue
  }
  const size = jpegSize(file)
  const sizeNote = size ? `${size.w}×${size.h}` : 'size unreadable'
  const matches = size && size.w === w && size.h === h
  check(matches, `${name} — ${sizeNote}${matches ? '' : ` (site.js records ${w}×${h})`}`)
}

console.log(`\nFilms — public/media/videos/ (${EXPECTED.videos.length} expected)`)
for (const name of EXPECTED.videos) {
  const file = path.join(videosDir, name)
  if (!fs.existsSync(file)) {
    check(false, `${name} — MISSING`)
    continue
  }
  const size = mp4Size(file)
  const mb = (fs.statSync(file).size / 1024 / 1024).toFixed(2)
  check(Boolean(size), `${name} — ${size ? `${Math.round(size.w)}×${Math.round(size.h)}` : 'no video track'}, ${mb} MB`)
}

console.log('\nExclusions (must never appear in the project):')
for (const name of EXCLUDED) {
  const inPhotos = fs.existsSync(path.join(photosDir, name))
  const inVideos = fs.existsSync(path.join(videosDir, name))
  check(!inPhotos && !inVideos, `${name} — not present`)
}
const sources = []
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.(jsx?|css|html|json|md|ya?ml)$/.test(entry.name)) sources.push(full)
  }
}
walk(root)
for (const name of EXCLUDED) {
  const mentioned = sources.filter((file) => fs.readFileSync(file, 'utf8').includes(name))
  check(mentioned.length === 0, `${name} — not referenced in any source file`)
}

console.log(
  failures === 0
    ? '\nAll media checks passed.\n'
    : `\n${failures} media check(s) failed — fix the names above before deploying.\n`,
)
process.exit(failures === 0 ? 0 : 1)
