import { describe, expect, it } from 'vitest'
import {
  agregarAvaliacoes,
  alvoIdParaCoord,
  aplicarAvaliacoes,
  pesoComunidade,
  PESO_MAX_COMUNIDADE,
} from './avaliacoes'
import type { Avaliacao, Fatores, TipoAvaliacao } from './tipos'

const coord = { lat: -3.1, lng: -60.02 }
const av = (alvoId: string, tipo: TipoAvaliacao, i = 0): Avaliacao => ({
  id: `a${i}`,
  alvoId,
  tipo,
  coord,
  criadoEm: '2026-10-15T20:00:00Z',
})
const base: Fatores = { luz: 0.5, fluxo: 0.5, risco: 0.5 }

describe('agregarAvaliacoes', () => {
  it('conta votos por alvo e tipo', () => {
    const m = agregarAvaliacoes([av('t1', 'luz', 1), av('t1', 'luz', 2), av('t1', 'atencao', 3), av('t2', 'fluxo', 4)])
    expect(m.get('t1')).toEqual({ luz: 2, fluxo: 0, atencao: 1, total: 3 })
    expect(m.get('t2')).toEqual({ luz: 0, fluxo: 1, atencao: 0, total: 1 })
  })
})

describe('pesoComunidade', () => {
  it('cresce com votos e respeita o teto de 0.7', () => {
    expect(pesoComunidade(0)).toBe(0)
    expect(pesoComunidade(3)).toBeCloseTo(0.5)
    expect(pesoComunidade(1000)).toBe(PESO_MAX_COMUNIDADE)
  })
})

describe('aplicarAvaliacoes', () => {
  it('sem votos mantem a base', () => {
    expect(aplicarAvaliacoes(base, undefined)).toEqual(base)
  })
  it('votos luz sobem luz; fluxo sobem fluxo', () => {
    const l = aplicarAvaliacoes(base, { luz: 3, fluxo: 0, atencao: 0, total: 3 })
    expect(l.luz).toBeGreaterThan(0.5)
    const f = aplicarAvaliacoes(base, { luz: 0, fluxo: 3, atencao: 0, total: 3 })
    expect(f.fluxo).toBeGreaterThan(0.5)
  })
  it('atencao derruba luz e sobe risco', () => {
    const r = aplicarAvaliacoes(base, { luz: 0, fluxo: 0, atencao: 5, total: 5 })
    expect(r.luz).toBeLessThan(0.5)
    expect(r.risco).toBeGreaterThan(0.5)
  })
  it('resultado fica entre 0 e 1 e comunidade nunca passa de 70%', () => {
    const r = aplicarAvaliacoes({ luz: 0, fluxo: 0, risco: 1 }, { luz: 500, fluxo: 0, atencao: 0, total: 500 })
    expect(r.luz).toBeCloseTo(0.7)
    expect(r.luz).toBeLessThanOrEqual(1)
    const s = aplicarAvaliacoes({ luz: 1, fluxo: 1, risco: 0 }, { luz: 0, fluxo: 0, atencao: 500, total: 500 })
    expect(s.luz).toBeCloseTo(0.3)
    expect(s.risco).toBeCloseTo(0.7)
  })
})

describe('alvoIdParaCoord', () => {
  it('gera id de celula estavel (~100 m)', () => {
    expect(alvoIdParaCoord({ lat: -3.10004, lng: -60.02001 })).toBe(alvoIdParaCoord({ lat: -3.09996, lng: -60.01996 }))
    expect(alvoIdParaCoord(coord)).toBe('cel:-3.100:-60.020')
  })
})
