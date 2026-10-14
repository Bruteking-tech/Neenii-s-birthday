import { useEffect, useState } from 'react'
import { content } from '../content/site.js'
import { scrollToId } from '../lib/hooks.js'

const SECTIONS = [
  { id: 'journal', label: 'Memories', sub: 'Eighteen photographs' },
  { id: 'films', label: 'Films', sub: 'Seven moving ones' },
  { id: 'time', label: 'Time', sub: 'A little counter' },
  { id: 'letter', label: 'Letter', sub: 'A written word' },
  { id: 'wish', label: 'Last', sub: 'The final surprise' },
]

/** Quiet top bar: where you are, where you can go, and the calm switch. */
export default function SiteNav({ visible, progress, calm, onToggleCalm, onReplay }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const go = (id) => (event) => {
    event.preventDefault()
    setMenuOpen(false)
    scrollToId(id)
  }

  return (
    <header className="nav" data-hidden={!visible}>
      <nav className="nav__bar" aria-label="Sections">
        <span className="nav__brand">
          N
          <small>{content.recipient}</small>
        </span>

        <span className="nav__spacer" />

        <div className="nav__links">
          {SECTIONS.map((section) => (
            <a key={section.id} className="nav__link" href={`#${section.id}`} onClick={go(section.id)}>
              {section.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="nav__icon-btn"
          onClick={onReplay}
          aria-label="Replay the journey from the beginning"
        >
          <span className="nav__icon" aria-hidden="true">
            ↺
          </span>
          <span className="nav__icon-btn-text">Replay</span>
        </button>

        <button
          type="button"
          className="nav__icon-btn"
          aria-pressed={calm}
          onClick={onToggleCalm}
          title={content.calm.hint}
          aria-label={`${content.calm.label} — ${content.calm.hint}`}
        >
          <span className="nav__switch" aria-hidden="true" />
          <span className="nav__icon-btn-text">{content.calm.label}</span>
        </button>

        <button
          type="button"
          className="nav__icon-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          aria-label="Open the section list"
        >
          <span className="nav__icon" aria-hidden="true">
            ☰
          </span>
          <span className="nav__icon-btn-text">Sections</span>
        </button>

        <span className="nav__progress" style={{ width: `${Math.round(progress * 100)}%` }} />
      </nav>

      {menuOpen ? (
        <div className="nav__menu" id="nav-menu">
          {SECTIONS.map((section) => (
            <a key={section.id} href={`#${section.id}`} onClick={go(section.id)}>
              <span className="eyebrow">{section.label}</span>
              <span className="h3">{section.sub}</span>
            </a>
          ))}
        </div>
      ) : null}
    </header>
  )
}
