import { photoUrl, onMediaError } from '../lib/media.js'

/**
 * A single photograph, dressed for the composition it belongs to.
 *
 * Every frame is given the photograph's *own* proportions (`--photo-ratio`
 * comes from the real pixel size recorded in site.js), so the layouts crop
 * nothing — faces included. The full-size original is one tap away in the
 * lightbox.
 *
 * variants
 *   plain     thin mounted print
 *   matt      mounted print with a paper matte and a contained image, used for
 *             frames that are limited by height (so nothing is ever cropped)
 *   polaroid  white border with a lip for the handwritten caption
 *   film      dark film-strip frame with sprocket edges
 *   taped     a paper tape strip over one corner
 */
export default function PhotoFrame({
  photo,
  caption,
  index = 0,
  total = 0,
  variant = 'plain',
  onOpen,
  ratio,
  height,
  className = '',
  priority = false,
  showHint = true,
}) {
  if (!photo) return null

  const natural = photo.w && photo.h ? photo.w / photo.h : undefined
  const frameRatio = ratio ?? natural

  const style = {
    ...(frameRatio ? { '--photo-ratio': String(frameRatio) } : {}),
    ...(height ? { '--photo-h': height } : {}),
  }

  const photoClasses = [
    'photo',
    variant === 'matt' ? 'photo--matt' : '',
    height ? 'photo--capped' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const position = total ? `photograph ${index + 1} of ${total}` : 'this photograph'
  const label = caption ? `${caption} — open ${position}` : `Open ${position}`

  const inner = (
    <button type="button" className={photoClasses} onClick={onOpen} aria-label={label} aria-haspopup="dialog">
      <img
        src={photoUrl(photo.file)}
        alt={photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'auto'}
        onError={onMediaError('photo', photo.file)}
      />
      <span className="photo__missing" aria-hidden="true">
        Missing: {photo.file}
      </span>
      {showHint && (
        <span className="click-hint" aria-hidden="true">
          View
        </span>
      )}
    </button>
  )

  const classes = [
    'frame',
    `frame--${variant}`,
    'taped' === variant ? 'taped' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (variant === 'polaroid') {
    return (
      <figure className={classes} style={style}>
        {inner}
        <div className="polaroid__lip">
          <span className="polaroid__caption">{caption}</span>
          {total ? <span className="polaroid__index">{String(index + 1).padStart(2, '0')}</span> : null}
        </div>
      </figure>
    )
  }

  if (variant === 'film') {
    return (
      <figure className={classes} style={style}>
        <div className="film">{inner}</div>
        {caption ? (
          <figcaption className="note" style={{ marginTop: '0.7rem' }}>
            {caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return (
    <figure className={classes} style={style}>
      {inner}
      {caption ? <figcaption className="note" style={{ marginTop: '0.7rem' }}>{caption}</figcaption> : null}
    </figure>
  )
}
