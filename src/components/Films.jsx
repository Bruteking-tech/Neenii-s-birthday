import { useRef, useState } from 'react'
import { content } from '../content/site.js'
import { reels } from '../lib/captions.js'
import { videoUrl, onMediaError } from '../lib/media.js'
import { useInView } from '../lib/hooks.js'
import Reveal from './Reveal.jsx'

/**
 * SECTION C — the moving memories.
 *
 * Seven real files, seven real HTML5 players: controls, `playsinline`,
 * `preload="metadata"`, and never an autoplay. The video element is only
 * created once its frame is close to the viewport, so a phone is not asked to
 * fetch metadata for everything at once. Until then, and until the visitor
 * presses play, a designed poster frame stands in — typography drawn here,
 * never an invented picture.
 */
export default function Films() {
  return (
    <section className="section films" id="films" aria-labelledby="films-heading">
      <div className="page">
        <Reveal className="films__head section-head">
          <p className="eyebrow">{content.film.eyebrow}</p>
          <h2 className="h1" id="films-heading">
            {content.film.heading}
          </h2>
          <p className="lede">{content.film.lede}</p>
        </Reveal>

        <div className="reels">
          {reels.map((video, index) => (
            <Reel
              key={video.id}
              video={video}
              index={index}
              total={reels.length}
              caption={video.caption}
            />
          ))}
        </div>

        <div className="films__foot">
          <p className="small">{content.film.footLeft}</p>
          <p className="small">{content.film.footRight}</p>
        </div>
      </div>
    </section>
  )
}

function Reel({ video, index, total, caption }) {
  const [ref, inView] = useInView({ rootMargin: '420px 0px', threshold: 0, once: true })
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)
  const portrait = video.ratio < 1

  const start = () => {
    const node = videoRef.current
    setPlaying(true)
    if (node) {
      const attempt = node.play()
      if (attempt?.catch) attempt.catch(() => {})
    }
  }

  return (
    <article className="reel" ref={ref}>
      <div className="reel__frame">
        <div
          className="reel__stage"
          data-ratio={portrait ? 'portrait' : 'landscape'}
          style={portrait ? { aspectRatio: String(video.ratio) } : undefined}
        >
          {inView ? (
            <video
              ref={videoRef}
              src={videoUrl(video.file)}
              controls
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onError={onMediaError('video', video.file)}
            >
              {/* No captions file exists for these clips — nothing is invented. */}
              <p className="small">This film could not be played — {video.file}</p>
            </video>
          ) : null}

          <button
            type="button"
            className="reel__poster"
            hidden={playing}
            onClick={start}
            aria-label={`Play film ${index + 1} of ${total}`}
          >
            <span className="reel__poster-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="reel__poster-ring" aria-hidden="true">
              <svg viewBox="0 0 12 14" focusable="false">
                <path d="M0 0l12 7-12 7z" />
              </svg>
            </span>
            <span className="reel__poster-label">
              film {index + 1} of {total}
              {video.seconds ? ` · ${video.seconds} seconds` : ''}
            </span>
            <span className="reel__poster-hint">press to play</span>
          </button>
        </div>
      </div>

      <div className="reel__meta">
        <span className="reel__index">
          Film {String(index + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}
        </span>
        <span className="reel__caption">{caption}</span>
      </div>
    </article>
  )
}
