import { useInView } from '../lib/hooks.js'
import { useMotion } from '../lib/motion-context.js'

/**
 * Fades a block in the first time it is scrolled to.
 * When motion is switched off (system preference or calm mode) it is simply
 * visible from the start — no transition, no delay, nothing to wait for.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
  threshold = 0.15,
  ...rest
}) {
  const { motionOff } = useMotion()
  const [ref, inView] = useInView({ threshold, enabled: !motionOff })

  const classes = [
    'reveal',
    delay ? `reveal--delay-${delay}` : '',
    inView ? 'is-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  )
}
