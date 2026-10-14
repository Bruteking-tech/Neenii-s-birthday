/**
 * A very small confetti burst on a canvas.
 *
 * Deliberately restrained: warm paper colours, a couple of hundred particles,
 * a soft fall, and it stops itself. It is only ever called when motion is on,
 * it never covers controls, and it does nothing at all when the visitor has
 * asked for reduced motion.
 */

const PALETTE = ['#d6a79a', '#be8f7f', '#8c9a7b', '#c3cbb6', '#e7d9c0', '#6b4a3a', '#f3e8d6']

export function burst(canvas, { count = 140, duration = 4200, palette = PALETTE } = {}) {
  if (!canvas) return () => {}

  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = Math.max(1, Math.floor(width * dpr))
  canvas.height = Math.max(1, Math.floor(height * dpr))
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const start = performance.now()
  const rand = (min, max) => min + Math.random() * (max - min)

  const particles = Array.from({ length: count }, () => {
    const size = rand(4, 11)
    return {
      x: width / 2 + rand(-width * 0.12, width * 0.12),
      y: height * 0.62 + rand(-14, 14),
      vx: rand(-1.9, 1.9),
      vy: rand(-9.5, -3.6),
      w: size,
      h: size * rand(0.5, 0.95),
      angle: rand(0, Math.PI * 2),
      spin: rand(-0.16, 0.16),
      colour: palette[Math.floor(Math.random() * palette.length)],
      sway: rand(0.6, 1.7),
      life: 1,
    }
  })

  let frame = 0
  let stopped = false

  const draw = (time) => {
    if (stopped) return
    const elapsed = time - start
    const progress = Math.min(1, elapsed / duration)

    ctx.clearRect(0, 0, width, height)

    particles.forEach((p) => {
      const gravity = 0.24
      p.vy += gravity
      p.vx *= 0.995
      p.x += p.vx + Math.sin((elapsed / 620) * p.sway) * 0.6
      p.y += p.vy
      p.angle += p.spin
      // Fade out over the last third of the burst.
      p.life = progress < 0.66 ? 1 : Math.max(0, 1 - (progress - 0.66) / 0.34)

      if (p.y - p.h > height + 40 || p.life <= 0) return

      ctx.save()
      ctx.globalAlpha = p.life
      ctx.translate(p.x, p.y)
      ctx.rotate(p.angle)
      ctx.fillStyle = p.colour
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    })

    if (progress < 1) {
      frame = requestAnimationFrame(draw)
    } else {
      ctx.clearRect(0, 0, width, height)
    }
  }

  frame = requestAnimationFrame(draw)

  return () => {
    stopped = true
    cancelAnimationFrame(frame)
    ctx.clearRect(0, 0, width, height)
  }
}
