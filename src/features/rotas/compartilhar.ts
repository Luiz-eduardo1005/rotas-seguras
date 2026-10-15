import type { LatLng, Periodo } from '../../domain/tipos'
import type { PontoRota } from '../../services/armazenamento'

export type ResultadoCompartilhar = 'compartilhado' | 'copiado' | 'erro'

export interface LinkRota {
  origem: PontoRota
  destino: PontoRota
  periodo?: Periodo
}

const fmt = (c: LatLng) => `${c.lat.toFixed(5)},${c.lng.toFixed(5)}`

function baseAtual(): string {
  return typeof location === 'undefined' ? 'http://localhost/' : location.origin + location.pathname
}

export function montarLinkRota(origem: PontoRota, destino: PontoRota, periodo: Periodo, base = baseAtual()): string {
  const q = new URLSearchParams({
    o: fmt(origem.coord),
    on: origem.nome,
    d: fmt(destino.coord),
    dn: destino.nome,
    p: periodo,
  })
  return `${base}?${q.toString()}`
}

function lerCoord(v: string | null): LatLng | null {
  if (!v) return null
  const partes = v.split(',')
  if (partes.length !== 2 || partes.some((p) => p.trim() === '')) return null
  const lat = Number(partes[0])
  const lng = Number(partes[1])
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
  return { lat, lng }
}

/** Lê `?o=lat,lng&on=nome&d=lat,lng&dn=nome&p=dia|noite`. Retorna null se origem/destino faltam ou são inválidos. */
export function lerLinkRota(search: string): LinkRota | null {
  const q = new URLSearchParams(search)
  const o = lerCoord(q.get('o'))
  const d = lerCoord(q.get('d'))
  if (!o || !d) return null
  const p = q.get('p')
  return {
    origem: { nome: q.get('on')?.slice(0, 80) || 'Origem', coord: o },
    destino: { nome: q.get('dn')?.slice(0, 80) || 'Destino', coord: d },
    periodo: p === 'dia' || p === 'noite' ? p : undefined,
  }
}

export async function compartilharRota(
  origem: PontoRota,
  destino: PontoRota,
  periodo: Periodo,
): Promise<ResultadoCompartilhar> {
  const url = montarLinkRota(origem, destino, periodo)
  const text = `Estou indo por este trajeto: ${origem.nome} → ${destino.nome}`
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'Rotas Seguras', text, url })
      return 'compartilhado'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'erro'
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`)
    return 'copiado'
  } catch {
    return 'erro'
  }
}
