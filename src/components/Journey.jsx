import { useMemo, useRef } from 'react'
import { chapters, content } from '../content/site.js'
import { galleryPhotos } from '../lib/captions.js'
import PhotoFrame from './PhotoFrame.jsx'
import Reveal from './Reveal.jsx'

/**
 * SECTION B — the memory journey.
 *
 * Six compositions, each one different on purpose: a featured frame with two
 * snapshots, scattered polaroids, a film strip you push sideways, an editorial
 * spread, one near-full-screen moment, and a closing pair. Eighteen originals,
 * none of them cropped, all reachable full size in the lightbox.
 */
export default function Journey({ onOpenPhoto }) {
  const { byId, indexOf, captionOf } = useMemo(() => {
    const byIdMap = new Map()
    const indexMap = new Map()
    const captionMap = new Map()
    galleryPhotos.forEach((photo, i) => {
      byIdMap.set(photo.id, photo)
      indexMap.set(photo.id, i)
      captionMap.set(photo.id, photo.caption)
    })
    return { byId: byIdMap, indexOf: indexMap, captionOf: captionMap }
  }, [])

  const open = (id) => onOpenPhoto(indexOf.get(id))
  const total = galleryPhotos.length

  return (
    <section className="section journal" id="journal" aria-labelledby="journey-heading">
      <div className="page">
        <Reveal className="journal__head section-head">
          <p className="eyebrow">{content.journey.eyebrow}</p>
          <h2 className="h1" id="journey-heading">
            {content.journey.heading}
          </h2>
          <p className="lede">{content.journey.lede}</p>
          <p className="small">{content.journey.lightboxHint}</p>
        </Reveal>

        {chapters.map((chapter) => (
          <section className="chapter" key={chapter.id} aria-labelledby={`${chapter.id}-title`}>
            <Reveal className="chapter__head">
              <p className="eyebrow">{chapter.label}</p>
              <h3 className="h2" id={`${chapter.id}-title`}>
                {chapter.title}
              </h3>
              <p className="chapter__note">{chapter.note}</p>
            </Reveal>

            <Chapter
              chapter={chapter}
              byId={byId}
              indexOf={indexOf}
              captionOf={captionOf}
              total={total}
              open={open}
            />

            {chapter.footnote ? (
              <Reveal as="p" className="chapter__footnote">
                {chapter.footnote}
              </Reveal>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  )
}

function Chapter({ chapter, byId, indexOf, captionOf, total, open }) {
  const frameProps = (id) => {
    const photo = byId.get(id)
    return {
      photo,
      caption: captionOf.get(id),
      index: indexOf.get(id),
      total,
      onOpen: () => open(id),
    }
  }

  switch (chapter.layout) {
    /* one big frame, two smaller ones beside it */
    case 'feature': {
      const [first, second] = chapter.photoIds
      return (
        <div className="layout-feature">
          <Reveal className="layout-feature__main">
            <PhotoFrame {...frameProps(chapter.featureId)} variant="taped" priority />
          </Reveal>
          <div className="layout-feature__side">
            <Reveal delay={1}>
              <PhotoFrame {...frameProps(first)} variant="matt" height="min(38svh, 22rem)" />
            </Reveal>
            <Reveal delay={2}>
              <PhotoFrame {...frameProps(second)} variant="matt" height="min(38svh, 22rem)" />
            </Reveal>
          </div>
        </div>
      )
    }

    /* four polaroids, the way they landed on a table */
    case 'polaroids':
      return (
        <div className="layout-polaroids">
          {chapter.photoIds.map((id, i) => {
            const photo = byId.get(id)
            const wide = photo.w > photo.h
            return (
              <Reveal key={id} delay={Math.min(i, 3)} className={wide ? 'polaroid--wide' : ''}>
                <PhotoFrame {...frameProps(id)} variant="polaroid" />
              </Reveal>
            )
          })}
        </div>
      )

    /* a film strip you push sideways */
    case 'strip':
      return <Strip chapter={chapter} frameProps={frameProps} />

    /* an editorial spread: a tall frame, a wide one, a small taped one */
    case 'spread': {
      const [tall, wide, small] = chapter.photoIds
      return (
        <div className="layout-spread">
          <Reveal className="layout-spread__tall">
            <PhotoFrame {...frameProps(tall)} variant="matt" height="min(62svh, 34rem)" />
          </Reveal>
          <Reveal delay={1} className="layout-spread__wide">
            <PhotoFrame {...frameProps(wide)} variant="plain" />
          </Reveal>
          <Reveal delay={2} className="layout-spread__caption">
            <div className="layout-spread__quote">
              <p className="h3">{chapter.pullQuote}</p>
            </div>
            <PhotoFrame {...frameProps(small)} variant="taped" className="layout-spread__small" />
          </Reveal>
        </div>
      )
    }

    /* one moment, given the whole frame */
    case 'theatre': {
      const [only] = chapter.photoIds
      const photo = byId.get(only)
      const position = indexOf.get(only) + 1
      return (
        <Reveal className="moment">
          <div className="moment__stage">
            <PhotoFrame {...frameProps(only)} variant="matt" showHint />
          </div>
          <p className="note moment__note">{captionOf.get(only)}</p>
          <span className="moment__index">
            {String(position).padStart(2, '0')} of {String(total).padStart(2, '0')}
          </span>
          <span className="sr-only">{photo?.file}</span>
        </Reveal>
      )
    }

    /* the closing pair */
    case 'diptych': {
      const [left, right] = chapter.photoIds
      return (
        <div className="layout-diptych">
          <Reveal>
            <PhotoFrame {...frameProps(left)} variant="matt" height="min(58svh, 32rem)" />
          </Reveal>
          <Reveal delay={1}>
            <PhotoFrame {...frameProps(right)} variant="matt" height="min(58svh, 32rem)" />
          </Reveal>
          <Reveal className="layout-diptych__line" delay={2}>
            <span className="rule rule--narrow">
              <span className="rule__mark" aria-hidden="true">
                ✦
              </span>
            </span>
            <p className="hand">{chapter.note}</p>
          </Reveal>
        </div>
      )
    }

    default:
      return null
  }
}

function Strip({ chapter, frameProps }) {
  const stripRef = useRef(null)

  const scrollByFrame = (direction) => {
    const strip = stripRef.current
    if (!strip) return
    const frame = strip.querySelector('.strip__frame')
    const step = frame ? frame.getBoundingClientRect().width + 20 : strip.clientWidth * 0.8
    strip.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  return (
    <div className="layout-strip">
      <div
        className="strip"
        ref={stripRef}
        tabIndex={0}
        role="group"
        aria-label="Film strip of five photographs — use the arrow buttons or scroll sideways"
      >
        {chapter.photoIds.map((id) => (
          <div className="strip__frame" key={id}>
            <PhotoFrame {...frameProps(id)} variant="film" />
          </div>
        ))}
      </div>
      <div className="strip__controls">
        <button
          type="button"
          className="strip__btn"
          onClick={() => scrollByFrame(-1)}
          aria-label="Scroll the film strip backwards"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="strip__btn"
          onClick={() => scrollByFrame(1)}
          aria-label="Scroll the film strip forwards"
        >
          <span aria-hidden="true">→</span>
        </button>
        <p className="strip__caption">{chapter.note}</p>
      </div>
    </div>
  )
}
