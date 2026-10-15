import { distanciaM } from './geo'
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

/** Autor das avaliações feitas neste aparelho (exibido como "Você"). */
export const AUTOR_LOCAL = 'local'

export function podeExcluir(av: Avaliacao): boolean {
  return av.autorId === AUTOR_LOCAL && !av.semente
}

export interface RelatoProximo {
  avaliacao: Avaliacao
  distanciaM: number
}

/** Relatos do alvo OU a até `raioM` da coordenada; mais recentes primeiro. */
export function relatosProximos(
  coord: LatLng,
  avaliacoes: Avaliacao[],
  raioM = 300,
  alvoId?: string,
): RelatoProximo[] {
  const saida: RelatoProximo[] = []
  for (const avaliacao of avaliacoes) {
    const d = distanciaM(coord, avaliacao.coord)
    if ((alvoId !== undefined && avaliacao.alvoId === alvoId) || d <= raioM) {
      saida.push({ avaliacao, distanciaM: Math.round(d) })
    }
  }
  return saida.sort((a, b) => Date.parse(b.avaliacao.criadoEm) - Date.parse(a.avaliacao.criadoEm))
}

export interface OpcoesRelatos {
  alvoId?: string
  areaId?: string
  raioM?: number
}

/**
 * Relatos para um ponto: `proximos` (do alvo ou a até `raioM`) e `doBairro`
 * (do bairro `areaId` que não estão em `proximos`); ambos mais recentes primeiro.
 */
export function relatosParaPonto(
  coord: LatLng,
  avaliacoes: Avaliacao[],
  { alvoId, areaId, raioM = 300 }: OpcoesRelatos = {},
): { proximos: RelatoProximo[]; doBairro: RelatoProximo[] } {
  const proximos = relatosProximos(coord, avaliacoes, raioM, alvoId)
  if (areaId === undefined) return { proximos, doBairro: [] }
  const ids = new Set(proximos.map((r) => r.avaliacao.id))
  const doBairro = avaliacoes
    .filter((a) => a.alvoId === areaId && !ids.has(a.id))
    .map((avaliacao) => ({ avaliacao, distanciaM: Math.round(distanciaM(coord, avaliacao.coord)) }))
    .sort((a, b) => Date.parse(b.avaliacao.criadoEm) - Date.parse(a.avaliacao.criadoEm))
  return { proximos, doBairro }
}

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** "Nome · Bairro", sem repetir o bairro quando o nome já o contém. */
export function tituloTrecho(nome: string, bairro: string): string {
  if (!bairro || semAcento(nome).includes(semAcento(bairro))) return nome
  return `${nome} · ${bairro}`
}

/** Contagem por tipo dos relatos informados. */
export function contarRelatos(relatos: RelatoProximo[]): AgregadoAlvo {
  const ag: AgregadoAlvo = { luz: 0, fluxo: 0, atencao: 0, total: 0 }
  for (const { avaliacao } of relatos) {
    ag[avaliacao.tipo] += 1
    ag.total += 1
  }
  return ag
}

export function tempoRelativo(isoData: string, agora: number | Date = Date.now()): string {
  const t = Date.parse(isoData)
  const ref = typeof agora === 'number' ? agora : agora.getTime()
  if (!Number.isFinite(t)) return ''
  const min = Math.floor((ref - t) / 60_000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h} h`
  const dias = Math.floor(h / 24)
  if (dias < 7) return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`
  if (dias < 30) {
    const sem = Math.floor(dias / 7)
    return `há ${sem} ${sem === 1 ? 'semana' : 'semanas'}`
  }
  const meses = Math.floor(dias / 30)
  return `há ${meses} ${meses === 1 ? 'mês' : 'meses'}`
}
