import { createContext, useContext } from 'react'

/** Motion settings shared by every section. */
export const MotionContext = createContext({
  motionOff: false,
  systemReduced: false,
  calm: false,
  setCalm: () => {},
})

export const useMotion = () => useContext(MotionContext)
