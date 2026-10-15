import { describe, expect, it } from 'vitest'
import { lerLinkRota, montarLinkRota } from './compartilhar'

const o = { nome: 'Escola Júlia', coord: { lat: -3.1086, lng: -60.0516 } }
const d = { nome: 'Centro & Praça', coord: { lat: -3.1316, lng: -60.0233 } }

describe('link de rota', () => {
  it('ida e volta preserva pontos e período', () => {
    const link = montarLinkRota(o, d, 'noite', 'https://x.app/')
    const r = lerLinkRota(link.slice(link.indexOf('?')))
    expect(r?.origem.nome).toBe(o.nome)
    expect(r?.destino.nome).toBe(d.nome)
    expect(r?.origem.coord.lat).toBeCloseTo(o.coord.lat, 5)
    expect(r?.destino.coord.lng).toBeCloseTo(d.coord.lng, 5)
    expect(r?.periodo).toBe('noite')
  })
  it('rejeita coordenadas ausentes ou inválidas', () => {
    expect(lerLinkRota('')).toBeNull()
    expect(lerLinkRota('?o=abc,1&d=1,2')).toBeNull()
    expect(lerLinkRota('?o=95,1&d=1,2')).toBeNull()
    expect(lerLinkRota('?o=1,2')).toBeNull()
  })
  it('nomes e período têm padrão', () => {
    const r = lerLinkRota('?o=-3.1,-60&d=-3.2,-60.1&p=x')
    expect(r?.origem.nome).toBe('Origem')
    expect(r?.periodo).toBeUndefined()
  })
})

describe('limites do deep link', () => {
  it('rejeita coordenadas fora de Manaus', () => {
    expect(lerLinkRota('?o=0,0&d=-3.13,-60.02')).toBeNull()
    expect(lerLinkRota('?o=-3.10,-60.05&d=-23.5,-46.6')).toBeNull()
  })
  it('remove caracteres de controle dos nomes', () => {
    const r = lerLinkRota('?o=-3.10,-60.05&on=A%00B%1F&d=-3.13,-60.02&dn=C%0AD')
    expect(r?.origem.nome).toBe('AB')
    expect(r?.destino.nome).toBe('CD')
  })
})
