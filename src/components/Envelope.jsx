/**
 * The sealed envelope on the opening screen.
 * Drawn entirely in markup + CSS: no images, no libraries.
 */
export default function Envelope({ broken, note, onOpen, label }) {
  return (
    <button
      type="button"
      className="envelope"
      data-seal={broken ? 'broken' : 'sealed'}
      onClick={onOpen}
      aria-label={broken ? 'The envelope is open' : `${label} — break the seal`}
    >
      <span className="envelope__body" aria-hidden="true" />
      <span className="envelope__letter" aria-hidden="true">
        <span className="eyebrow">For Neenii</span>
        <hr />
        <span className="envelope__heartline">a little world, inside</span>
      </span>
      <span className="envelope__pocket" aria-hidden="true" />
      <span className="envelope__flap" aria-hidden="true" />
      <span className="envelope__seal" aria-hidden="true">
        N
      </span>
      <span className="envelope__note" aria-hidden="true">
        {note}
      </span>
    </button>
  )
}
