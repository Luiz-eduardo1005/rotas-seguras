import { describe, expect, it } from 'vitest'
import { mesclarRotas, rotasSemelhantes } from './mesclarRotas'
import type { RotaBruta } from '../../services/rotasApi'

const linha = (lat: number): RotaBruta => ({
  coords: [
    { lat, lng: -60.0 },
    { lat, lng: -59.99 },
  ],
  distanciaM: 1000,
  duracaoS: 700,
})

describe('mesclarRotas', () => {
  it('detecta rotas praticamente idênticas', () => {
    expect(rotasSemelhantes(linha(-3).coords, linha(-3.0001).coords)).toBe(true)
    expect(rotasSemelhantes(linha(-3).coords, linha(-3.01).coords)).toBe(false)
  })
  it('descarta duplicatas e mantém gravadas primeiro', () => {
    const g = [linha(-3), linha(-3.01)]
    const v = [linha(-3.0001), linha(-3.02)]
    const r = mesclarRotas(g, v)
    expect(r).toHaveLength(3)
    expect(r[0]).toBe(g[0])
    expect(r[2]).toBe(v[1])
  })
  it('limita a 3 rotas', () => {
    expect(mesclarRotas([linha(-3), linha(-3.01), linha(-3.02)], [linha(-3.03)])).toHaveLength(3)
  })
  it('gravada que é subconjunto de outra gravada continua presente', () => {
    const curta = { coords: [{ lat: -3, lng: -60 }, { lat: -3, lng: -59.995 }], distanciaM: 500, duracaoS: 300 }
    const longa = {
      coords: [{ lat: -3, lng: -60 }, { lat: -3, lng: -59.99 }, { lat: -3.01, lng: -59.99 }],
      distanciaM: 2000,
      duracaoS: 1400,
    }
    const r = mesclarRotas([curta, longa], [])
    expect(r).toEqual([curta, longa])
  })
})
