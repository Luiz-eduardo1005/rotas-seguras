import { aplicarAvaliacoes, alvoIdParaCoord, type AgregadoAlvo } from './avaliacoes'
import { amostrarPolilinha, areaDoPonto, comprimentoM, distanciaM, distanciaPontoSegmentoM } from './geo'
import type {
  AmostraPontuada,
  Area,
  Cenario,
  Fatores,
  LatLng,
  Nivel,
  Periodo,
  PontoApoio,
  ResultadoRota,
  SegmentoRota,
  Trecho,
} from './tipos'

export const NEUTRO: Fatores = { luz: 0.5, fluxo: 0.5, risco: 0.5 }
const RAIO_TRECHO_M = 60
const RAIO_APOIO_M = 150
const BONUS_POR_APOIO = 2
const BONUS_MAX = 10

type Agregados = Map<string, AgregadoAlvo>

const PESOS: Record<Periodo, Fatores> = {
  noite: { luz: 0.45, fluxo: 0.35, risco: 0.2 },
  dia: { luz: 0.15, fluxo: 0.45, risco: 0.4 },
}

export function notaFatores(f: Fatores, periodo: Periodo): number {
  const p = PESOS[periodo]
  return 100 * (p.luz * f.luz + p.fluxo * f.fluxo + p.risco * (1 - f.risco))
}

export function nivelDaNota(nota: number): Nivel {
  if (nota >= 70) return 'verde'
  if (nota >= 45) return 'amarelo'
  return 'vermelho'
}

/** Nível de um fator médio (0..1); `inverso` para fatores em que menor é melhor (risco). */
export function nivelDoFator(v: number, inverso = false): Nivel {
  const x = inverso ? 1 - v : v
  return x >= 0.6 ? 'verde' : x >= 0.4 ? 'amarelo' : 'vermelho'
}

/** Texto-resumo da rota (por que a nota é essa), coerente com `nivelDaNota`. */
export function resumoRota(r: Pick<ResultadoRota, 'nota' | 'fatoresMedios' | 'pontosApoioProximos'>): string {
  const { luz, fluxo, risco } = r.fatoresMedios
  const partes: string[] = []
  if (luz >= 0.6) partes.push('iluminada')
  if (fluxo >= 0.6) partes.push('com movimento')
  if (risco <= 0.4) partes.push('com poucos relatos de risco')
  const n = r.pontosApoioProximos.length
  const apoio = n ? `${n} ponto${n > 1 ? 's' : ''} de apoio no caminho` : 'nenhum ponto de apoio perto'
  if (!partes.length) {
    return nivelDaNota(r.nota) === 'vermelho'
      ? `Trechos escuros ou isolados; ${apoio}. Redobre a atenção.`
      : `Condições medianas; ${apoio}.`
  }
  const lista = partes.length > 1 ? `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]}` : partes[0]
  return `Mais ${lista}; ${apoio}.`.replace('Mais com', 'Com').replace('Mais iluminada e com', 'Iluminada, com')
}

function distanciaAoTrechoM(coord: LatLng, trecho: Trecho): number {
  const c = trecho.coords
  if (c.length === 0) return Infinity
  if (c.length === 1) return distanciaM(coord, c[0])
  let min = Infinity
  for (let i = 1; i < c.length; i++) {
    min = Math.min(min, distanciaPontoSegmentoM(coord, c[i - 1], c[i]))
  }
  return min
}

const soFatores = (x: Fatores): Fatores => ({ luz: x.luz, fluxo: x.fluxo, risco: x.risco })

export function fatoresNoPonto(coord: LatLng, cenario: Cenario, agregado: Agregados): Fatores {
  let base: Fatores = NEUTRO
  let alvoId: string | undefined

  let melhorD = Infinity
  for (const t of cenario.trechos) {
    const d = distanciaAoTrechoM(coord, t)
    if (d <= RAIO_TRECHO_M && d < melhorD) {
      melhorD = d
      base = soFatores(t)
      alvoId = t.id
    }
  }
  if (!alvoId) {
    const a = areaDoPonto(coord, cenario.areas)
    if (a) {
      base = soFatores(a)
      alvoId = a.id
    }
  }

  let f = base
  if (alvoId) f = aplicarAvaliacoes(f, agregado.get(alvoId))
  return aplicarAvaliacoes(f, agregado.get(alvoIdParaCoord(coord)))
}

export function nivelDoTrecho(trecho: Trecho, agregado: Agregados, periodo: Periodo): Nivel {
  const f = aplicarAvaliacoes(soFatores(trecho), agregado.get(trecho.id))
  return nivelDaNota(notaFatores(f, periodo))
}

export function nivelDaArea(area: Area, agregado: Agregados, periodo: Periodo): Nivel {
  const f = aplicarAvaliacoes(soFatores(area), agregado.get(area.id))
  return nivelDaNota(notaFatores(f, periodo))
}

function agruparSegmentos(amostras: AmostraPontuada[]): SegmentoRota[] {
  const segs: SegmentoRota[] = []
  for (const a of amostras) {
    const atual = segs[segs.length - 1]
    if (atual && atual.nivel === a.nivel) {
      atual.coords.push(a.coord)
    } else {
      // novo segmento comeca no ultimo ponto do anterior: linha continua
      const inicio = atual ? [atual.coords[atual.coords.length - 1], a.coord] : [a.coord]
      segs.push({ coords: inicio, nivel: a.nivel })
    }
  }
  return segs
}

function apoiosProximos(pontos: LatLng[], apoios: PontoApoio[]): PontoApoio[] {
  return apoios.filter((p) => pontos.some((a) => distanciaM(a, p.coord) < RAIO_APOIO_M))
}

export function pontuarRota(
  coords: LatLng[],
  cenario: Cenario,
  avaliacoes: Agregados,
  periodo: Periodo,
): ResultadoRota {
  const pontos = amostrarPolilinha(coords, 50)
  const amostras: AmostraPontuada[] = pontos.map((coord) => {
    const fatores = fatoresNoPonto(coord, cenario, avaliacoes)
    return { coord, fatores, nivel: nivelDaNota(notaFatores(fatores, periodo)) }
  })
  const n = amostras.length
  const fatoresMedios: Fatores = n
    ? {
        luz: amostras.reduce((s, a) => s + a.fatores.luz, 0) / n,
        fluxo: amostras.reduce((s, a) => s + a.fatores.fluxo, 0) / n,
        risco: amostras.reduce((s, a) => s + a.fatores.risco, 0) / n,
      }
    : soFatores(NEUTRO)
  const pontosApoioProximos = apoiosProximos(pontos, cenario.pontosApoio)
  const bonusApoio = Math.min(BONUS_MAX, BONUS_POR_APOIO * pontosApoioProximos.length)
  const bruta = notaFatores(fatoresMedios, periodo) + bonusApoio
  const nota = Math.round(Math.max(0, Math.min(100, bruta)))
  return {
    nota,
    nivel: nivelDaNota(nota),
    fatoresMedios,
    bonusApoio,
    pontosApoioProximos,
    segmentos: agruparSegmentos(amostras),
    comprimentoM: comprimentoM(coords),
  }
}

/** Maior nota primeiro; empate -> menor comprimento. Nao muta a entrada. */
export function ordenarRotas<T extends ResultadoRota>(resultados: T[]): T[] {
  return [...resultados].sort((a, b) => b.nota - a.nota || a.comprimentoM - b.comprimentoM)
}
