import { beforeEach, describe, expect, it } from 'vitest'
import {
  adicionarAoHistorico,
  carregarHistorico,
  HISTORICO_MAX,
  limparHistorico,
  registrarBusca,
  removerDoHistorico,
} from './historicoStorage'

const p = (nome: string, lat: number, lng = -60) => ({ nome, coord: { lat, lng } })

describe('adicionarAoHistorico', () => {
  it('move par repetido (≤50 m) para o topo e atualiza quando', () => {
    const a = adicionarAoHistorico([], p('A', -3), p('B', -3.01), '2026-01-01T00:00:00Z', 'x')
    const b = adicionarAoHistorico(a, p('C', -3.05), p('D', -3.06), '2026-01-02T00:00:00Z', 'y')
    const c = adicionarAoHistorico(b, p('A2', -3.0001), p('B2', -3.0101), '2026-01-03T00:00:00Z', 'z')
    expect(c).toHaveLength(2)
    expect(c[0].id).toBe('z')
    expect(c[0].quando).toBe('2026-01-03T00:00:00Z')
  })
  it('não funde pares distintos', () => {
    const a = adicionarAoHistorico([], p('A', -3), p('B', -3.01), 't', 'x')
    expect(adicionarAoHistorico(a, p('A', -3), p('C', -3.1), 't', 'y')).toHaveLength(2)
  })
  it('limita a 8', () => {
    let l = [] as ReturnType<typeof adicionarAoHistorico>
    for (let i = 0; i < 12; i++) l = adicionarAoHistorico(l, p('o', -3 - i * 0.01), p('d', -3.5), 't')
    expect(l).toHaveLength(HISTORICO_MAX)
  })
})

describe('persistência', () => {
  beforeEach(() => localStorage.clear())
  it('registra, remove e limpa', () => {
    registrarBusca(p('A', -3), p('B', -3.01))
    const l = registrarBusca(p('C', -3.1), p('D', -3.2))
    expect(carregarHistorico()).toHaveLength(2)
    expect(removerDoHistorico(l[0].id)).toHaveLength(1)
    expect(limparHistorico()).toEqual([])
    expect(carregarHistorico()).toEqual([])
  })
  it('ignora JSON corrompido', () => {
    localStorage.setItem('rotas-seguras:v1:historico', '{x')
    expect(carregarHistorico()).toEqual([])
  })
})
