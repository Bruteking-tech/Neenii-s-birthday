import { content, counter, referenceDate, referenceLabel } from '../content/site.js'
import { useElapsed } from '../lib/hooks.js'
import { groupDigits, pad2 } from '../lib/time.js'
import Reveal from './Reveal.jsx'

/**
 * SECTION D — the live counter.
 *
 * Recomputed from the clock every second (never accumulated), so it stays
 * correct across midnight, month ends, leap days and long naps in a pocket.
 * The reference date itself is a single value at the top of `site.js`.
 */
export default function TimeCounter({ compact = false, onDark = false }) {
  const { days, hours, minutes, seconds } = useElapsed(referenceDate)

  const units = [
    { label: counter.units[0], value: groupDigits(days) },
    { label: counter.units[1], value: pad2(hours) },
    { label: counter.units[2], value: pad2(minutes) },
    { label: counter.units[3], value: pad2(seconds), seconds: true },
  ]

  const spoken = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds since ${referenceLabel}`

  if (compact) {
    return (
      <p className="footer__recap">
        <span>{referenceLabel} —</span>
        <span className="footer__day">{groupDigits(days)}</span>
        <span>days and counting</span>
        <span className="sr-only">({spoken})</span>
      </p>
    )
  }

  return (
    <section className={`section time${onDark ? ' time--dark' : ''}`} id="time" aria-labelledby="time-heading">
      <div className="page">
        <Reveal className="time__panel">
          <div className="time__head">
            <p className="eyebrow">{counter.eyebrow}</p>
            <h2 className="h1" id="time-heading">
              {counter.heading}
            </h2>
            <p className="time__since">
              counting since {referenceLabel}
            </p>
            <p className="body" style={{ maxWidth: '46ch' }}>
              {counter.lede}
            </p>
          </div>

          <div
            className="time__grid"
            role="group"
            aria-label={`Elapsed time since ${referenceLabel}`}
          >
            {units.map((unit) => (
              <div className="time__unit" key={unit.label}>
                <span className={`time__value${unit.seconds ? ' time__value--seconds' : ''}`}>
                  {unit.value}
                </span>
                <span className="time__label">{unit.label}</span>
                <span className="time__rule" aria-hidden="true" />
              </div>
            ))}
          </div>

          <p className="time__live">
            <span className="time__dot" aria-hidden="true" />
            {counter.footnote}
          </p>

          <div className="time__foot">
            <p className="small" style={{ maxWidth: '44ch' }}>
              {content.closing.note}
            </p>
            <p className="small">Updates every second, from {referenceLabel}.</p>
          </div>

          <span className="sr-only" aria-live="off">
            {spoken}
          </span>
        </Reveal>
      </div>
    </section>
  )
}
