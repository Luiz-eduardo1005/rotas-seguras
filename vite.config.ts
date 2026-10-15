import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const DIA = 60 * 60 * 24

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pin.svg', 'favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Rotas Seguras',
        short_name: 'Rotas Seguras',
        description:
          'Sugere a rota a pé mais segura à noite em Manaus. Dados simulados para demonstração acadêmica.',
        lang: 'pt-BR',
        theme_color: '#060b16',
        background_color: '#060b16',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tiles-osm',
              expiration: { maxEntries: 500, maxAgeSeconds: 7 * DIA },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/routing\.openstreetmap\.de\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'rotas-osrm',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 50, maxAgeSeconds: DIA },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
