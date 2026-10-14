import { useEffect, useMemo, useRef, useState } from 'react'
import { content } from '../content/site.js'
import { scrollToId } from '../lib/hooks.js'
import Envelope from './Envelope.jsx'

/**
 * SECTION A — the opening.
 *
 * A sealed envelope, the name, and one way in. The rest of the journey is not
 * mounted until the seal is broken, so this first screen is instant even on a
 * slow phone. There is always a way past the animation: the skip link, and a
 * second button.
 */
export default function Opening({ phase, onOpen, onSkip }) {
  const [broken, setBroken] = useState(false)
  const timers = useRef([])
  const opened = phase === 'open'

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Floating specks of light — deterministic values, so nothing flickers.
  const motes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: `${((i * 37) % 96) + 2}%`,
        bottom: `${(i * 53) % 60}%`,
        duration: `${9 + ((i * 7) % 9)}s`,
        delay: `${(i * 1.3) % 9}s`,
        scale: 0.6 + (i % 4) * 0.22,
      })),
    [],
  )

  const open = () => {
    if (opened) return
    setBroken(true)
    timers.current.push(setTimeout(() => onOpen(), 900))
  }

  return (
    <section className="opening" data-phase={phase} aria-labelledby="opening-name">
      <div className="wash" aria-hidden="true" />
      <div className="motes" aria-hidden="true">
        {motes.map((mote, i) => (
          <span
            key={i}
            className="mote"
            style={{
              left: mote.left,
              bottom: mote.bottom,
              animationDuration: mote.duration,
              animationDelay: mote.delay,
              transform: `scale(${mote.scale})`,
            }}
          />
        ))}
      </div>

      <div className="page opening__inner">
        <p className="eyebrow opening__label">{content.opening.kicker}</p>

        <h1 className="display opening__name" id="opening-name">
          {content.opening.name}
        </h1>

        <p className="opening__sub">{content.opening.subline}</p>

        <Envelope
          broken={broken}
          note={content.opening.envelopeNote}
          onOpen={open}
          label={content.opening.cta}
        />

        <p className="opening__message">{content.opening.message}</p>

        <div className="opening__actions">
          {opened ? (
            <button type="button" className="btn btn--ink" onClick={() => scrollToId('journal')}>
              Back to the memories
            </button>
          ) : (
            <>
              <button type="button" className="btn btn--ink" onClick={open}>
                {content.opening.cta}
              </button>
              <button type="button" className="btn btn--ghost" onClick={onSkip}>
                {content.opening.skip}
              </button>
              <p className="opening__hint">{content.opening.hint}</p>
            </>
          )}
        </div>

        <span className="cue" aria-hidden="true">
          <span className="cue__line" />
          {opened ? 'the album' : 'scroll'}
        </span>
      </div>
    </section>
  )
}
