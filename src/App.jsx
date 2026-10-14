import { useEffect, useRef, useState } from 'react'
import { MotionContext } from './lib/motion-context.js'
import { useMotionPreference, useScrollProgress, scrollToId } from './lib/hooks.js'
import { galleryPhotos } from './lib/captions.js'
import Opening from './components/Opening.jsx'
import SiteNav from './components/SiteNav.jsx'
import Journey from './components/Journey.jsx'
import Lightbox from './components/Lightbox.jsx'
import Films from './components/Films.jsx'
import TimeCounter from './components/TimeCounter.jsx'
import Letter from './components/Letter.jsx'
import Finale from './components/Finale.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const motion = useMotionPreference()
  const progress = useScrollProgress()

  /** sealed → leaving → open */
  const [phase, setPhase] = useState('sealed')
  /** bumping this key resets the letter, the box and every animation */
  const [resetKey, setResetKey] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const timers = useRef([])

  const opened = phase !== 'sealed'

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Calm mode is honoured in CSS as well as in JS.
  useEffect(() => {
    document.documentElement.classList.toggle('calm', motion.calm)
  }, [motion.calm])

  const begin = ({ jump = false } = {}) => {
    if (phase !== 'sealed') return
    if (jump || motion.motionOff) {
      setPhase('open')
      scrollToId('journal', { instant: true })
      return
    }
    setPhase('leaving')
    // Start moving at the same moment the opening begins to fade, so the
    // journey is already arriving — never a blank screen in between.
    scrollToId('journal')
    timers.current.push(window.setTimeout(() => setPhase('open'), 1150))
  }

  const replay = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setLightbox(null)
    setPhase('sealed')
    setResetKey((key) => key + 1)
    window.scrollTo({ top: 0, behavior: motion.motionOff ? 'auto' : 'smooth' })
    timers.current.push(window.setTimeout(() => window.scrollTo(0, 0), 500))
  }

  const navigateLightbox = (step) =>
    setLightbox((current) =>
      current === null ? current : (current + step + galleryPhotos.length) % galleryPhotos.length,
    )

  // Pressing Enter or Space on the opening screen opens it too.
  useEffect(() => {
    if (opened) return
    const onKey = (event) => {
      const tag = document.activeElement?.tagName
      if ((event.key === 'Enter' || event.key === ' ') && (tag === 'BODY' || tag === undefined)) {
        event.preventDefault()
        begin()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, phase, motion.motionOff])

  return (
    <MotionContext.Provider value={motion}>
      <a className="skip-link" href="#journal">
        Skip to the memories
      </a>

      <SiteNav
        visible={opened}
        progress={progress}
        calm={motion.calm}
        onToggleCalm={() => motion.setCalm(!motion.calm)}
        onReplay={replay}
      />

      <main>
        <Opening phase={phase} onOpen={() => begin()} onSkip={() => begin({ jump: true })} />

        {opened ? (
          <div key={resetKey}>
            <Journey onOpenPhoto={setLightbox} />
            <Films />
            <TimeCounter />
            <Letter />
            <Finale onReplay={replay} />
          </div>
        ) : null}
      </main>

      <Footer />

      {lightbox !== null ? (
        <Lightbox
          photos={galleryPhotos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={navigateLightbox}
        />
      ) : null}

      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </MotionContext.Provider>
  )
}
