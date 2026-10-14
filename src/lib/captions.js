import { captionPalette, photos, videoCaptionPalette, videos } from '../content/site.js'

/**
 * One place where captions are resolved.
 *
 * A caption written in `site.js` always wins; otherwise the photograph or film
 * borrows a short neutral note from the palette, in order. That keeps every
 * screen honest — no invented stories — while still reading like a journal.
 */
export const galleryPhotos = photos.map((photo, i) => ({
  ...photo,
  caption: photo.caption ?? captionPalette[i % captionPalette.length],
}))

export const reels = videos.map((video, i) => ({
  ...video,
  caption: video.caption ?? videoCaptionPalette[i % videoCaptionPalette.length],
}))
