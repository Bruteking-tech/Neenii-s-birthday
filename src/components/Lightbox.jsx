import { useEffect, useRef, useState } from 'react'
import { photoUrl } from '../lib/media.js'
import { useScrollLock } from '../lib/hooks.js'

/**
 * SECTION B (part two) — the lightbox.
 *
 * Shows the untouched full-size original, never a crop. Previous / next,
 * Escape and arrow keys, click-outside to close, swipe on phones, focus
 * returned to whatever opened it.
 */
export default function Lightbox({ photos, index, onClose, onNavigate }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const closeRef = useRef(null)
  const openerRef = useRef(null)
  const touchStart = useRef(null)
  const photo = photos[index]

  useScrollLock(true)

  // Remember the trigger, focus the close button, restore focus on the way out.
  useEffect(() => {
    openerRef.current = document.activeElement
    closeRef.current?.focus()
    return () => {
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus()
    }
  }, [])

  // Reset the loading state whenever the photograph changes.
  useEffect(() => {
    setLoaded(false)
    setFailed(false)
  }, [index])

  // Warm the neighbours so moving back and forth feels instant.
  useEffect(() => {
    ;[index - 1, index + 1].forEach((i) => {
      const neighbour = photos[(i + photos.length) % photos.length]
      if (neighbour) {
        const img = new Image()
        img.src = photoUrl(neighbour.file)
      }
    })
  }, [index, photos])

  useEffect(() => {
    const onKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          onClose()
          break
        case 'ArrowRight':
          event.preventDefault()
          onNavigate(1)
          break
        case 'ArrowLeft':
          event.preventDefault()
          onNavigate(-1)
          break
        case 'Home':
          event.preventDefault()
          onNavigate(-index)
          break
        case 'End':
          event.preventDefault()
          onNavigate(photos.length - 1 - index)
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, photos.length, onClose, onNavigate])

  const onTouchStart = (event) => {
    const touch = event.changedTouches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event) => {
    if (!touchStart.current) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStart.current.x
    const dy = touch.clientY - touchStart.current.y
    touchStart.current = null
    // Horizontal intent only, and only when it is a real swipe.
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      onNavigate(dx < 0 ? 1 : -1)
    }
  }

  // Click outside closes; clicks on the picture or controls do not.
  const onBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose()
  }

  if (!photo) return null

  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${index + 1} of ${photos.length}`}
    >
      <div className="lb__bar">
        <span className="lb__count">
          {String(index + 1).padStart(2, '0')} <span aria-hidden="true">/</span>{' '}
          {String(photos.length).padStart(2, '0')}
        </span>
        <span className="lb__label">the memory journey</span>
        <button type="button" className="lb__close" ref={closeRef} onClick={onClose}>
          Close
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div
        className="lb__stage"
        onMouseDown={onBackdrop}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <figure className="lb__figure" key={photo.id}>
          <img
            src={photoUrl(photo.file)}
            alt={photo.alt}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setFailed(true)
              setLoaded(true)
            }}
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 500ms ease' }}
          />
          {!loaded && <p className="lb__loading">loading the original…</p>}
          {failed && <p className="lb__loading">this file could not be loaded — {photo.file}</p>}
        </figure>

        <button
          type="button"
          className="lb__nav lb__nav--prev"
          onClick={() => onNavigate(-1)}
          aria-label="Previous photograph"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="lb__nav lb__nav--next"
          onClick={() => onNavigate(1)}
          aria-label="Next photograph"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="lb__foot">
        <p className="lb__caption">{photo.caption}</p>
        <div className="lb__dots" aria-hidden="true">
          {photos.map((p, i) => (
            <span key={p.id} className="lb__dot" data-active={i === index} />
          ))}
        </div>
        <p className="lb__hint">← → to move · esc to close · tap outside</p>
      </div>
    </div>
  )
}
