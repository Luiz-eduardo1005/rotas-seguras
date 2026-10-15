// Gera os PNGs de ícone da PWA a partir de public/pin.svg.
// Uso: npm run icones
import sharp from 'sharp'
import { copyFile, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(raiz, 'public')
const FUNDO = '#060b16'

const fonte = (await readFile(join(pub, 'pin.svg'), 'utf8')).trim()
// Extrai só o desenho do pin (sem o rect de fundo) para recompor cada variante.
const pino = fonte
  .replace(/^<svg[^>]*>/, '')
  .replace(/<\/svg>$/, '')
  .replace(/<rect[^>]*\/>/, '')

function svgIcone({ escala, cantos }) {
  const rx = cantos ? 112 : 0
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">` +
    `<rect width="512" height="512" rx="${rx}" fill="${FUNDO}"/>` +
    `<g transform="translate(256 256) scale(${escala}) translate(-256 -256)">${pino}</g>` +
    `</svg>`
  )
}

async function png(nome, tamanho, opcoes) {
  await sharp(Buffer.from(svgIcone(opcoes)), { density: 300 })
    .resize(tamanho, tamanho)
    .png()
    .toFile(join(pub, nome))
}

await png('pwa-192.png', 192, { escala: 1, cantos: true })
await png('pwa-512.png', 512, { escala: 1, cantos: true })
// Maskable: fundo sem cantos (o SO aplica a máscara) e pin dentro da safe zone (~60%).
await png('maskable-512.png', 512, { escala: 0.6, cantos: false })
// Apple: sem transparência (iOS arredonda sozinho); pin levemente menor.
await png('apple-touch-icon.png', 180, { escala: 0.8, cantos: false })
await copyFile(join(pub, 'pin.svg'), join(pub, 'favicon.svg'))
