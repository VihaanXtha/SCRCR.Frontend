import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'SCRC Community App',
        short_name: 'SCRC',
        description: 'SCRC Community Application',
        theme_color: '#1e3a8a',
        icons: [
          {
            src: 'https://placehold.co/192x192/1e3a8a/ffffff?text=SCRC',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://placehold.co/512x512/1e3a8a/ffffff?text=SCRC',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    cssMinify: 'esbuild'
  }
})
