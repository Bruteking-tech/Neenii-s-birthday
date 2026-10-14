import { content } from '../content/site.js'
import TimeCounter from './TimeCounter.jsx'
import { scrollToId } from '../lib/hooks.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="page footer__inner">
        <span className="rule rule--narrow">
          <span className="rule__mark" aria-hidden="true">
            ✦
          </span>
        </span>

        <p className="hand" style={{ fontSize: '1.4rem' }}>
          {content.closing.line}
        </p>

        <TimeCounter compact />

        <div className="footer__meta">
          <span>{content.recipient}</span>
          <span aria-hidden="true">·</span>
          <span>{content.opening.subline}</span>
          <span aria-hidden="true">·</span>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => scrollToId('opening')}>
            Back to the beginning
          </button>
        </div>
      </div>
    </footer>
  )
}
