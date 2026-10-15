import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pin.svg'],
      manifest: {
        name: 'Rotas Seguras',
        short_name: 'Rotas Seguras',
        description: 'Rota a pé mais segura à noite em Manaus.',
        lang: 'pt-BR',
        theme_color: '#060b16',
        background_color: '#060b16',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pin.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'pin.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
