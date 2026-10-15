import { describe, expect, it } from 'vitest'
import {
  agregarAvaliacoes,
  alvoIdParaCoord,
  aplicarAvaliacoes,
  AUTOR_LOCAL,
  podeExcluir,
  relatosProximos,
  tempoRelativo,
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
  autorId: AUTOR_LOCAL,
  autorNome: 'Você',
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

describe('relatosProximos', () => {
  const longe = { lat: -3.12, lng: -60.02 }
  const mk = (id: string, alvoId: string, c: typeof coord, criadoEm: string): Avaliacao => ({
    ...av(alvoId, 'luz'), id, coord: c, criadoEm,
  })
  it('inclui alvo ou raio, ordena do mais recente e informa distância', () => {
    const lista = [
      mk('a', 'x', coord, '2026-10-01T00:00:00Z'),
      mk('b', 'y', { lat: coord.lat + 0.001, lng: coord.lng }, '2026-10-10T00:00:00Z'),
      mk('c', 'alvo', longe, '2026-10-05T00:00:00Z'),
      mk('d', 'z', longe, '2026-10-12T00:00:00Z'),
    ]
    const r = relatosProximos(coord, lista, 300, 'alvo')
    expect(r.map((x) => x.avaliacao.id)).toEqual(['b', 'c', 'a'])
    expect(r[0].distanciaM).toBeGreaterThan(90)
    expect(r[0].distanciaM).toBeLessThan(130)
  })
})

describe('tempoRelativo', () => {
  const agora = Date.parse('2026-10-15T12:00:00Z')
  const f = (ms: number) => tempoRelativo(new Date(agora - ms).toISOString(), agora)
  it('formata faixas', () => {
    expect(f(10_000)).toBe('agora')
    expect(f(5 * 60_000)).toBe('há 5 min')
    expect(f(3 * 3_600_000)).toBe('há 3 h')
    expect(f(2 * 86_400_000)).toBe('há 2 dias')
    expect(f(21 * 86_400_000)).toBe('há 3 semanas')
    expect(f(65 * 86_400_000)).toBe('há 2 meses')
  })
})

describe('podeExcluir', () => {
  it('só avaliações locais não-semente', () => {
    expect(podeExcluir(av('t', 'luz'))).toBe(true)
    expect(podeExcluir({ ...av('t', 'luz'), semente: true })).toBe(false)
    expect(podeExcluir({ ...av('t', 'luz'), autorId: 'outro' })).toBe(false)
  })
})
