import { useEffect, useRef, useState } from 'react'
import { content } from '../content/site.js'
import { useMotion } from '../lib/motion-context.js'
import { burst } from '../lib/confetti.js'
import Reveal from './Reveal.jsx'

/**
 * SECTION F — the final surprise.
 *
 * A little box. Lift the lid and the last wish is there, with a short, quiet
 * confetti fall if — and only if — motion is welcome.
 */
export default function Finale({ onReplay }) {
  const { motionOff } = useMotion()
  const [open, setOpen] = useState(false)
  const canvasRef = useRef(null)
  const stopRef = useRef(null)
  const { finale } = content

  useEffect(
    () => () => {
      stopRef.current?.()
    },
    [],
  )

  const openBox = () => {
    setOpen(true)
    if (motionOff) return
    // Let the lid lift first, then let a little confetti fall.
    window.setTimeout(() => {
      stopRef.current?.()
      stopRef.current = burst(canvasRef.current, { count: 150 })
    }, 420)
  }

  return (
    <section className="section finale" id="wish" aria-labelledby="wish-heading">
      <canvas className="confetti-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="page finale__stage">
        <Reveal className="section-head section-head--center">
          <p className="eyebrow">{finale.eyebrow}</p>
          <h2 className="h1" id="wish-heading">
            {open ? finale.wishKicker : finale.heading}
          </h2>
          {open ? null : <p className="lede">{finale.lede}</p>}
        </Reveal>

        {!open ? (
          <button
            type="button"
            className="gift"
            data-open="false"
            onClick={openBox}
            aria-label={finale.button}
          >
            <span className="gift__glow" aria-hidden="true" />
            <span className="gift__box" aria-hidden="true" />
            <span className="gift__ribbon" aria-hidden="true" />
            <span className="gift__lid" aria-hidden="true" />
            <span className="gift__bow" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="gift__hint" aria-hidden="true">
              {finale.closedNote}
            </span>
          </button>
        ) : (
          <div className="gift" data-open="true" aria-hidden="true">
            <span className="gift__glow" aria-hidden="true" />
            <span className="gift__box" aria-hidden="true" />
            <span className="gift__ribbon" aria-hidden="true" />
            <span className="gift__lid" aria-hidden="true" />
          </div>
        )}

        {open ? (
          <div className="wish" role="status">
            <h3 className="wish__name">{finale.wishName}</h3>
            <div className="wish__lines">
              {finale.wishLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className="wish__sign">{finale.signoff}</p>
            <button type="button" className="btn btn--ink" onClick={onReplay}>
              {finale.replay}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => window.scrollTo({ top: 0, behavior: motionOff ? 'auto' : 'smooth' })}>
              {finale.again}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
