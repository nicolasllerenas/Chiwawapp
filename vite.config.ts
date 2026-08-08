import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Local dev/build/preview always run at "/". Only the GitHub Actions
// deploy workflow sets BASE_PATH=/Chiwawapp/, since GitHub Pages serves
// this project from https://<user>.github.io/Chiwawapp/ instead of a
// domain root. Deriving everything from one value keeps local testing
// working out of the box while the deployed build gets correct asset URLs.
const base = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
      includeAssets: ['icons/favicon-32.png'],
      manifest: {
        name: 'Chiwawapp',
        short_name: 'Chiwawapp',
        description: 'Tu compañero diario: tareas, checklist de bolso y chiwawapuntos.',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'any',
        background_color: '#FFF8F0',
        theme_color: '#F4A261',
        lang: 'es-PE',
        icons: [
          { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: `${base}icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
