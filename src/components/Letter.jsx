import { useEffect, useRef, useState } from 'react'
import { content } from '../content/site.js'
import { useMotion } from '../lib/motion-context.js'
import Reveal from './Reveal.jsx'

/**
 * SECTION E — the letter.
 *
 * Closed: a folded note with a wax seal. Open: stationery, ruled lines, the
 * words in a serif face and a handwritten signature. Every word comes from
 * `content.letter.lines` in site.js, so nothing here claims anything you have
 * not written yourself.
 */
export default function Letter() {
  const { motionOff } = useMotion()
  const [open, setOpen] = useState(false)
  const [foldedGone, setFoldedGone] = useState(false)
  const timer = useRef(null)
  const { letter } = content

  useEffect(() => () => clearTimeout(timer.current), [])

  const toggle = () => {
    const next = !open
    setOpen(next)
    clearTimeout(timer.current)
    if (next) {
      if (motionOff) {
        setFoldedGone(true)
      } else {
        setFoldedGone(false)
        timer.current = setTimeout(() => setFoldedGone(true), letter.unfoldMs)
      }
    } else {
      setFoldedGone(false)
    }
  }

  return (
    <section className="section letter" id="letter" aria-labelledby="letter-heading" data-open={open}>
      <div className="page letter__stage">
        <Reveal className="letter__intro">
          <p className="eyebrow">{letter.eyebrow}</p>
          <h2 className="h1" id="letter-heading">
            {letter.heading}
          </h2>
          <p className="lede">{letter.lede}</p>
        </Reveal>

        <div className="folded" hidden={foldedGone && open} aria-hidden={open}>
          <div className="folded__paper">
            <span className="folded__tag eyebrow">{letter.closedLabel}</span>
          </div>
          <span className="folded__seal" aria-hidden="true">
            N
          </span>
          <span className="folded__note hand" aria-hidden="true">
            {letter.sealedNote}
          </span>
        </div>

        {open ? (
          <article className="stationery" id="letter-stationery" aria-label="The letter">
            <header className="stationery__head">
              <span className="eyebrow">Read slowly</span>
              <span className="small">sealed and delivered by hand</span>
              <span className="stationery__stamp" aria-hidden="true">
                Neenii
              </span>
            </header>

            <div className="stationery__lines">
              {letter.lines.map((line, i) => (
                <p key={i} style={{ animationDelay: `${180 + i * 130}ms` }}>
                  {line}
                </p>
              ))}
            </div>

            <div className="stationery__sign">
              <span className="hand">{letter.signature}</span>
            </div>
          </article>
        ) : null}

        <div className="letter__actions">
          <button
            type="button"
            className={`btn${open ? '' : ' btn--ink'}`}
            onClick={toggle}
            aria-expanded={open}
            aria-controls="letter-stationery"
          >
            {open ? letter.buttonAgain : letter.button}
          </button>
        </div>
      </div>
    </section>
  )
}
