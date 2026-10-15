// DADOS SIMULADOS para demonstração acadêmica — ver docs/pesquisa/manaus.md
import type { Cenario, LatLng } from '../domain/tipos'
import { distanciaM } from '../domain/geo'
import { areas } from './areas'
import { pontosApoio } from './apoio'
import { trechos } from './trechos'
import { lugares, rotasModelo } from './lugares'
import { rotasPregravadas, type RotaPregravada } from './rotasPregravadas'

export type { Lugar, RotaModelo } from './lugares'
export type { RotaPregravada } from './rotasPregravadas'
export { lugares, rotasModelo, rotasPregravadas }

export const cenario: Cenario = { trechos, areas, pontosApoio }

const TOLERANCIA_M = 300

/** Alternativas gravadas cujas pontas estão a <=300 m de origem/destino (ou do inverso, com geometria invertida). */
export function buscarRotaPregravada(origem: LatLng, destino: LatLng): RotaPregravada[] | undefined {
  const coordDe = (id: string) => lugares.find((l) => l.id === id)?.coord
  for (const m of rotasModelo) {
    const o = coordDe(m.origemId)
    const d = coordDe(m.destinoId)
    if (!o || !d) continue
    const direto = distanciaM(o, origem) <= TOLERANCIA_M && distanciaM(d, destino) <= TOLERANCIA_M
    const inverso = distanciaM(o, destino) <= TOLERANCIA_M && distanciaM(d, origem) <= TOLERANCIA_M
    if (!direto && !inverso) continue
    const rotas = rotasPregravadas.find((r) => r.rotaModeloId === m.id)?.rotas
    if (!rotas) continue
    return direto ? rotas : rotas.map((r) => ({ ...r, coords: [...r.coords].reverse() }))
  }
  return undefined
}
