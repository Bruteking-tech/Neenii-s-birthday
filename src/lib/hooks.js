import { useEffect, useMemo, useRef, useState } from 'react'
import { elapsedSince } from './time.js'

/** True when the visitor has asked their system for less motion. */
export function useSystemReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event) => setReduced(event.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  return reduced
}

/**
 * Motion preference = system setting OR the little "calm mode" switch.
 * Exposed through App so every section can honour it.
 */
export function useMotionPreference() {
  const systemReduced = useSystemReducedMotion()
  const [calm, setCalm] = useState(false)
  return { systemReduced, calm, setCalm, motionOff: systemReduced || calm }
}

/** Adds `.is-visible` once an element scrolls into view (progressive reveal). */
export function useInView({ threshold = 0.18, rootMargin = '0px 0px -8% 0px', once = true, enabled = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(!enabled)

  useEffect(() => {
    const node = ref.current
    if (!node || !enabled) {
      setInView(true)
      return
    }
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        })
      },
      { threshold, rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once, enabled])

  return [ref, inView]
}

/** Locks page scroll (lightbox) without the layout jumping sideways. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [locked])
}

/** 0 → 1 reading progress, throttled to animation frames. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max)))
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}

/**
 * Live elapsed-time hook for the counter.
 *
 * Each tick re-reads the clock from scratch (so the numbers stay true even
 * after the phone has been asleep for an hour) and the next tick is scheduled
 * on the wall-clock second boundary (so it never drifts). It also refreshes
 * the moment the tab wakes up.
 */
export function useElapsed(referenceDate, { intervalMs = 1000 } = {}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let timer
    let cancelled = false

    const schedule = () => {
      const delay = intervalMs - (Date.now() % intervalMs)
      timer = window.setTimeout(() => {
        if (cancelled) return
        setNow(Date.now())
        schedule()
      }, delay)
    }
    schedule()

    const refresh = () => setNow(Date.now())
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)
    window.addEventListener('pageshow', refresh)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
      window.removeEventListener('pageshow', refresh)
    }
  }, [intervalMs])

  return useMemo(() => elapsedSince(referenceDate, now), [referenceDate, now])
}

/** Smooth scroll to an element id, honouring reduced motion. */
export function scrollToId(id, { instant = false } = {}) {
  const node = document.getElementById(id)
  if (!node) return
  const behavior = instant ? 'auto' : 'smooth'
  node.scrollIntoView({ behavior, block: 'start' })
}
