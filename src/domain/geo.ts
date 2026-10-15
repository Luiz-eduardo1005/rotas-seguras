import type { LatLng } from './tipos'

const RAIO_TERRA_M = 6371000
const rad = (g: number) => (g * Math.PI) / 180

export function distanciaM(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * RAIO_TERRA_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Projeção equiretangular local (metros) com origem em `ref`. */
function paraMetros(p: LatLng, ref: LatLng): { x: number; y: number } {
  return {
    x: rad(p.lng - ref.lng) * RAIO_TERRA_M * Math.cos(rad(ref.lat)),
    y: rad(p.lat - ref.lat) * RAIO_TERRA_M,
  }
}

export function distanciaPontoSegmentoM(p: LatLng, a: LatLng, b: LatLng): number {
  // com origem em p, o ponto é (0,0)
  const pa = paraMetros(a, p)
  const pb = paraMetros(b, p)
  const dx = pb.x - pa.x
  const dy = pb.y - pa.y
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return Math.hypot(pa.x, pa.y)
  const t = Math.max(0, Math.min(1, -(pa.x * dx + pa.y * dy) / len2))
  return Math.hypot(pa.x + t * dx, pa.y + t * dy)
}

export function comprimentoM(coords: LatLng[]): number {
  let total = 0
  for (let i = 1; i < coords.length; i++) total += distanciaM(coords[i - 1], coords[i])
  return total
}

/** Amostra a polilinha a cada `passoM`, incluindo início e fim. */
export function amostrarPolilinha(coords: LatLng[], passoM = 50): LatLng[] {
  if (coords.length === 0) return []
  const saida: LatLng[] = [coords[0]]
  let faltaM = passoM
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1]
    const b = coords[i]
    const seg = distanciaM(a, b)
    let pos = 0
    while (seg > 0 && seg - pos >= faltaM) {
      pos += faltaM
      const t = pos / seg
      saida.push({ lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t })
      faltaM = passoM
    }
    faltaM -= seg - pos
  }
  const ultimo = coords[coords.length - 1]
  const fim = saida[saida.length - 1]
  if (fim.lat !== ultimo.lat || fim.lng !== ultimo.lng) saida.push(ultimo)
  return saida
}
