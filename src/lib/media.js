/**
 * Media URL builder.
 *
 * The originals in `public/media/**` are copied verbatim into the build, so at
 * runtime they live at `<base>media/...` — never at `/public/media/...`.
 *
 * `import.meta.env.BASE_URL` is supplied by Vite ('./' in this project because
 * of `base: './'` in vite.config.js, or '/Neenii-s-birthday/' if you ever
 * switch to an absolute base). Building URLs through this helper means the
 * site keeps working when it is published under a repository sub-path, at a
 * domain root, or from a local preview server.
 *
 * Filenames contain spaces and brackets, so each path segment is encoded while
 * the slashes are preserved.
 */

const BASE = import.meta.env?.BASE_URL ?? './'

/** Encode one relative path (e.g. `photos/My file (1).jpg`) safely. */
export function encodePath(relativePath) {
  return String(relativePath)
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

/** Build a URL for anything inside `public/media/`. */
export function mediaUrl(relativePath) {
  const base = BASE.endsWith('/') ? BASE : `${BASE}/`
  return `${base}media/${encodePath(relativePath)}`
}

export const photoUrl = (file) => mediaUrl(`photos/${file}`)
export const videoUrl = (file) => mediaUrl(`videos/${file}`)

/** Small helper so a missing photograph fails visibly, not silently. */
export const onMediaError = (kind, file) => (event) => {
  const el = event?.currentTarget
  if (el) el.dataset.failed = 'true'
  // Visible in the console for whoever is debugging a renamed file.
  console.warn(`[neenii] ${kind} could not be loaded: ${file}`)
}
