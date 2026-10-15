import { describe, expect, it } from 'vitest'
import { pontuarRota } from '../domain/pontuacao'
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

  it('todas as rotas-modelo têm diferença >=15 pontos entre melhor e pior alternativa à noite', () => {
    const diffs = rotasPregravadas.map((rp) => {
      const notas = rp.rotas.map((r) => pontuarRota(r.coords, cenario, new Map(), 'noite').nota)
      return { id: rp.rotaModeloId, notas, diff: Math.max(...notas) - Math.min(...notas) }
    })
    expect(diffs.filter((d) => d.diff < 15)).toEqual([])
  })
})
