// utilitários compartilhados pelos geradores de dados (geometria, OSRM com cache, PRNG determinístico)
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

const CACHE = join(tmpdir(), 'rotas-cache')
mkdirSync(CACHE, { recursive: true })
const R = 6371000
export const rad = (g) => (g * Math.PI) / 180
export const ll = ([lat, lng]) => ({ lat, lng })
export const r5 = (n) => Math.round(n * 1e5) / 1e5
export function dist(a, b) {
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
export function distSeg(p, a, b) {
  const k = Math.cos(rad(p.lat))
  const X = (q) => ({ x: rad(q.lng) * k * R, y: rad(q.lat) * R })
  const P = X(p), A = X(a), B = X(b)
  const dx = B.x - A.x, dy = B.y - A.y, l2 = dx * dx + dy * dy
  const t = l2 ? Math.max(0, Math.min(1, ((P.x - A.x) * dx + (P.y - A.y) * dy) / l2)) : 0
  return Math.hypot(P.x - (A.x + t * dx), P.y - (A.y + t * dy))
}
export const distPoli = (p, poli) => Math.min(...poli.slice(1).map((q, i) => distSeg(p, poli[i], q)))
export const comprimento = (c) => c.slice(1).reduce((s, p, i) => s + dist(c[i], p), 0)
/** Desloca um ponto em metros (leste, norte). */
export const desloca = (p, leste, norte) => ({ lat: p.lat + norte / 111320, lng: p.lng + leste / (111320 * Math.cos(rad(p.lat))) })
/** Ponto a `d` metros do início da polilinha. */
export function pontoAoLongo(c, d) {
  let acc = 0
  for (let i = 1; i < c.length; i++) {
    const s = dist(c[i - 1], c[i])
    if (acc + s >= d && s > 0) {
      const t = (d - acc) / s
      return { lat: c[i - 1].lat + (c[i].lat - c[i - 1].lat) * t, lng: c[i - 1].lng + (c[i].lng - c[i - 1].lng) * t }
    }
    acc += s
  }
  return c[c.length - 1]
}
function dp(c, tol) {
  if (c.length < 3) return c
  let maxD = 0, idx = 0
  for (let i = 1; i < c.length - 1; i++) {
    const d = distSeg(c[i], c[0], c[c.length - 1])
    if (d > maxD) { maxD = d; idx = i }
  }
  if (maxD <= tol) return [c[0], c[c.length - 1]]
  return [...dp(c.slice(0, idx + 1), tol).slice(0, -1), ...dp(c.slice(idx), tol)]
}
export function simplificar(c, max) {
  let tol = 2, out = dp(c, tol)
  while (out.length > max) { tol *= 1.4; out = dp(c, tol) }
  return out.map((p) => ({ lat: r5(p.lat), lng: r5(p.lng) }))
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms))
export async function osrm(pts, alternativas = false) {
  const path = pts.map((p) => `${p.lng},${p.lat}`).join(';')
  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${path}?overview=full&geometries=geojson${alternativas ? '&alternatives=3' : ''}`
  const f = join(CACHE, createHash('md5').update(url).digest('hex') + '.json')
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'))
  for (let t = 0; t < 4; t++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'RotasSeguras-faculdade' } })
      const j = await r.json()
      if (j.code === 'Ok') { writeFileSync(f, JSON.stringify(j)); await espera(400); return j }
    } catch { /* tenta de novo */ }
    await espera(1500)
  }
  throw new Error('OSRM falhou: ' + url)
}
/** Como osrm(), mas devolve null em vez de lançar. */
export const osrmOuNulo = (pts) => osrm(pts).catch(() => null)
export const geom = (rt) => rt.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
export const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
export const jit = (id, k, amp = 0.05) => ((hash(id + k) % 1000) / 1000) * 2 * amp - amp
export const cl = (v) => Math.round(Math.max(0.02, Math.min(0.98, v)) * 100) / 100
export const linhas = (arr) => arr.map((x) => '  ' + JSON.stringify(x)).join(',\n')
export const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
