import { describe, expect, it } from 'vitest'
import { pontuarRota } from '../domain/pontuacao'
import { mesclarRotas } from '../features/rotas/mesclarRotas'
import { buscarRotaPregravada, cenario, lugares, rotasModelo, rotasPregravadas } from './index'

const dentro = (c: { lat: number; lng: number }) =>
  c.lat >= -3.25 && c.lat <= -2.95 && c.lng >= -60.15 && c.lng <= -59.85
const unicos = (ids: string[]) => new Set(ids).size === ids.length

describe('dados mock de Manaus', () => {
  it('ids únicos', () => {
    expect(unicos(cenario.trechos.map((t) => t.id))).toBe(true)
    expect(unicos(cenario.areas.map((t) => t.id))).toBe(true)
    expect(unicos(cenario.pontosApoio.map((t) => t.id))).toBe(true)
    expect(unicos(lugares.map((t) => t.id))).toBe(true)
    expect(unicos(rotasModelo.map((t) => t.id))).toBe(true)
  })

  it('contagens mínimas e fatores em 0..1', () => {
    expect(cenario.areas.length).toBeGreaterThanOrEqual(17)
    expect(cenario.trechos.length).toBeGreaterThanOrEqual(25)
    expect(cenario.trechos.length).toBeLessThanOrEqual(40)
    for (const x of [...cenario.trechos, ...cenario.areas]) {
      for (const v of [x.luz, x.fluxo, x.risco]) expect(v >= 0 && v <= 1).toBe(true)
    }
  })

  it('coordenadas dentro do bbox de Manaus', () => {
    for (const t of cenario.trechos) t.coords.forEach((c) => expect(dentro(c)).toBe(true))
    for (const a of cenario.areas) expect(dentro(a.centro)).toBe(true)
    for (const p of cenario.pontosApoio) expect(dentro(p.coord)).toBe(true)
    for (const l of lugares) expect(dentro(l.coord)).toBe(true)
    for (const r of rotasPregravadas) r.rotas.forEach((x) => x.coords.forEach((c) => expect(dentro(c)).toBe(true)))
  })

  it('rotas-modelo apontam para lugares existentes e têm pré-gravadas', () => {
    for (const m of rotasModelo) {
      expect(lugares.some((l) => l.id === m.origemId)).toBe(true)
      expect(lugares.some((l) => l.id === m.destinoId)).toBe(true)
      expect(rotasPregravadas.find((r) => r.rotaModeloId === m.id)?.rotas.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('buscarRotaPregravada casa por proximidade das pontas', () => {
    const m = rotasModelo[0]
    const o = lugares.find((l) => l.id === m.origemId)!.coord
    const d = lugares.find((l) => l.id === m.destinoId)!.coord
    expect(buscarRotaPregravada(o, d)?.length).toBeGreaterThanOrEqual(2)
    expect(buscarRotaPregravada({ lat: -3.2, lng: -59.9 }, d)).toBeUndefined()
  })

  it('rotas-modelo: o que o usuário vê (casa + mescla) tem diferença >=15 à noite e a gravada segura presente', () => {
    const falhas: unknown[] = []
    for (const m of rotasModelo) {
      const o = lugares.find((l) => l.id === m.origemId)!.coord
      const d = lugares.find((l) => l.id === m.destinoId)!.coord
      const gravadas = buscarRotaPregravada(o, d)!
      const nota = (c: { lat: number; lng: number }[]) => pontuarRota(c, cenario, new Map(), 'noite').nota
      const melhorGravada = Math.max(...gravadas.map((r) => nota(r.coords)))
      // vivas fake: duplicata da primeira gravada (deve ser descartada) e uma rota deslocada
      const deslocada = gravadas[0].coords.map((c) => ({ lat: c.lat + 0.01, lng: c.lng }))
      const vivas = [
        { coords: gravadas[0].coords, distanciaM: 1, duracaoS: 1 },
        { coords: deslocada, distanciaM: 1, duracaoS: 1 },
      ]
      for (const v of [[], vivas]) {
        const vistas = mesclarRotas(gravadas, v)
        const notas = vistas.map((r) => nota(r.coords))
        const ok =
          gravadas.every((g) => vistas.includes(g)) &&
          vistas.length <= 3 &&
          Math.max(...notas) === melhorGravada &&
          Math.max(...notas) - Math.min(...notas) >= 15
        if (!ok) falhas.push({ id: m.id, notas })
      }
    }
    expect(falhas).toEqual([])
  })
})
