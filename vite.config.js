import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * `base: './'` keeps every built asset path *relative*.
 *
 * That matters because this site is published on GitHub Pages under a
 * repository sub-path (https://<user>.github.io/Neenii-s-birthday/) while it
 * also has to work when served from a domain root or from a local preview.
 * A relative base works in all three cases — nothing is hard-coded to one
 * repository name, so renaming the repo will not break the media.
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Media in `public/` is copied verbatim (originals untouched).
    copyPublicDir: true,
    // Photographs and videos are large; keep warnings focused on code only.
    chunkSizeWarningLimit: 900,
  },
  server: {
    host: true,
    // The dev/preview server is reached through a proxied sandbox hostname,
    // so the host check has to accept it (and anything else it is served as).
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
})
