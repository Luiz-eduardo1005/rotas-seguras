import type { Avaliacao, Fatores, LatLng } from './tipos'

export interface AgregadoAlvo {
  luz: number
  fluxo: number
  atencao: number
  total: number
}

export const PESO_MAX_COMUNIDADE = 0.7
const K_COMUNIDADE = 3

const limitar01 = (v: number) => Math.max(0, Math.min(1, v))

export function agregarAvaliacoes(avaliacoes: Avaliacao[]): Map<string, AgregadoAlvo> {
  const mapa = new Map<string, AgregadoAlvo>()
  for (const av of avaliacoes) {
    const ag = mapa.get(av.alvoId) ?? { luz: 0, fluxo: 0, atencao: 0, total: 0 }
    ag[av.tipo] += 1
    ag.total += 1
    mapa.set(av.alvoId, ag)
  }
  return mapa
}

/** Peso da comunidade: total/(total+3), com teto de 0.7. */
export function pesoComunidade(total: number): number {
  if (total <= 0) return 0
  return Math.min(PESO_MAX_COMUNIDADE, total / (total + K_COMUNIDADE))
}

/**
 * Voto 'luz' puxa luz->1; 'fluxo' puxa fluxo->1; 'atencao' puxa luz->0 e risco->1.
 * Votos que nao dizem nada sobre um fator mantem o valor base nesse fator.
 */
export function aplicarAvaliacoes(base: Fatores, agregado?: AgregadoAlvo): Fatores {
  if (!agregado || agregado.total <= 0) return base
  const { luz, fluxo, atencao, total } = agregado
  const peso = pesoComunidade(total)
  const comunidade: Fatores = {
    luz: (luz + base.luz * fluxo) / total,
    fluxo: (fluxo + base.fluxo * (luz + atencao)) / total,
    risco: (atencao + base.risco * (luz + fluxo)) / total,
  }
  return {
    luz: limitar01(base.luz * (1 - peso) + comunidade.luz * peso),
    fluxo: limitar01(base.fluxo * (1 - peso) + comunidade.fluxo * peso),
    risco: limitar01(base.risco * (1 - peso) + comunidade.risco * peso),
  }
}

/** Id de celula de grade (~100 m) para avaliacoes fora de trecho conhecido. */
export function alvoIdParaCoord(coord: LatLng): string {
  return `cel:${coord.lat.toFixed(3)}:${coord.lng.toFixed(3)}`
}
