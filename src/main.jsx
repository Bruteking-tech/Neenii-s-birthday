import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Fonts are self-hosted (no external requests, works offline / behind filters).
import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/caveat/400.css'

import './styles/base.css'
import './styles/sections.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Remove the first-paint placeholder now that React has taken over.
document.getElementById('boot')?.remove()
