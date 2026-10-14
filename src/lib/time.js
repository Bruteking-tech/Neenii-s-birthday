/* Time maths for the live counter. Pure functions, so they can be tested. */

/** Parse the configured reference date into a Date. */
export function parseReference(value) {
  if (value instanceof Date) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    console.warn(`[neenii] The counter date "${value}" could not be read — using 1970-01-01.`)
    return new Date(0)
  }
  return parsed
}

/**
 * Break the elapsed time down into whole days / hours / minutes / seconds.
 *
 * Always derived from a fresh `now`, never accumulated tick by tick, so the
 * numbers stay correct after the tab has been asleep for hours, and across
 * midnight, month and year boundaries. If `now` is somehow *before* the
 * reference date the result is zeroed rather than going negative.
 */
export function elapsedSince(reference, now = Date.now()) {
  const start = parseReference(reference).getTime()
  const elapsedMs = Math.max(0, now - start)

  const totalSeconds = Math.floor(elapsedMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor(totalSeconds / 3600) % 24
  const minutes = Math.floor(totalSeconds / 60) % 60
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, totalSeconds, elapsedMs }
}

/** 1234 → "1,234" without relying on the visitor's locale. */
export function groupDigits(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** Always two digits: 7 → "07". */
export const pad2 = (value) => String(value).padStart(2, '0')

/** "15 October 2007" — long, editorial, unambiguous. */
export function formatLongDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
