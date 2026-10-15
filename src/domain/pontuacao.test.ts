import { describe, expect, it } from 'vitest'
import { agregarAvaliacoes, alvoIdParaCoord } from './avaliacoes'
import { amostrarPolilinha, comprimentoM, distanciaM, distanciaPontoSegmentoM } from './geo'
import {
  fatoresNoPonto,
  nivelDaArea,
  nivelDaNota,
  nivelDoTrecho,
  notaFatores,
  ordenarRotas,
  pontuarRota,
} from './pontuacao'
import type { Area, Avaliacao, Cenario, LatLng, PontoApoio, Trecho } from './tipos'

const vazio = new Map()
const L = -60.02
const linha = (lat: number, lngIni = L, lngFim = L + 0.004): LatLng[] => [
  { lat, lng: lngIni },
  { lat, lng: lngFim },
]
const trecho = (id: string, lat: number, luz: number, fluxo: number, risco: number): Trecho => ({
  id,
  nome: id,
  bairro: 'Centro',
  coords: linha(lat),
  luz,
  fluxo,
  risco,
  fonte: 'estimativa',
})
const cenarioVazio: Cenario = { trechos: [], areas: [], pontosApoio: [] }
const apoio = (id: string, lng: number): PontoApoio => ({
  id,
  nome: id,
  tipo: 'delegacia',
  coord: { lat: -3.1, lng },
  bairro: 'Centro',
})

describe('geo', () => {
  it('haversine ~111 km por grau de latitude', () => {
    const d = distanciaM({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })
    expect(d).toBeGreaterThan(110500)
    expect(d).toBeLessThan(111900)
  })
  it('distancia ponto-segmento: perpendicular e extremidade', () => {
    const a = { lat: -3.1, lng: -60.02 }
    const b = { lat: -3.1, lng: -60.01 }
    const lat1m = 1 / 111195
    expect(distanciaPontoSegmentoM({ lat: -3.1 + 100 * lat1m, lng: -60.015 }, a, b)).toBeCloseTo(100, 0)
    expect(distanciaPontoSegmentoM({ lat: -3.1, lng: -60.03 }, a, b)).toBeCloseTo(distanciaM({ lat: -3.1, lng: -60.03 }, a), -1)
  })
  it('amostragem inclui inicio e fim e respeita o passo', () => {
    const rota = linha(-3.1, L, L + 0.002)
    const am = amostrarPolilinha(rota, 50)
    expect(am[0]).toEqual(rota[0])
    expect(am[am.length - 1]).toEqual(rota[1])
    expect(am.length).toBe(Math.ceil(comprimentoM(rota) / 50) + 1)
    expect(amostrarPolilinha([rota[0]], 50)).toEqual([rota[0]])
    expect(amostrarPolilinha([], 50)).toEqual([])
  })
})

describe('notaFatores / nivelDaNota', () => {
  it('pesos de noite e dia', () => {
    expect(notaFatores({ luz: 1, fluxo: 1, risco: 0 }, 'noite')).toBeCloseTo(100)
    expect(notaFatores({ luz: 0.5, fluxo: 0.5, risco: 0.5 }, 'dia')).toBeCloseTo(50)
    expect(notaFatores({ luz: 1, fluxo: 0, risco: 1 }, 'noite')).toBeCloseTo(45)
    expect(notaFatores({ luz: 1, fluxo: 0, risco: 1 }, 'dia')).toBeCloseTo(15)
  })
  it('limites de nivel', () => {
    expect(nivelDaNota(70)).toBe('verde')
    expect(nivelDaNota(69.9)).toBe('amarelo')
    expect(nivelDaNota(45)).toBe('amarelo')
    expect(nivelDaNota(44.9)).toBe('vermelho')
  })
})

describe('fatoresNoPonto', () => {
  it('ponto fora de tudo = neutro', () => {
    expect(fatoresNoPonto({ lat: -3.1, lng: L }, cenarioVazio, vazio)).toEqual({ luz: 0.5, fluxo: 0.5, risco: 0.5 })
  })
  it('usa trecho ate 60 m, senao area, senao neutro', () => {
    const cen: Cenario = {
      trechos: [trecho('t1', -3.1, 0.9, 0.8, 0.1)],
      areas: [{ id: 'a1', bairro: 'X', zona: 'Z', centro: { lat: -3.11, lng: L }, raioM: 300, luz: 0.2, fluxo: 0.3, risco: 0.9, fonte: 'estimativa' }],
      pontosApoio: [],
    }
    expect(fatoresNoPonto({ lat: -3.1002, lng: L + 0.002 }, cen, vazio).luz).toBe(0.9)
    expect(fatoresNoPonto({ lat: -3.1101, lng: L }, cen, vazio).luz).toBe(0.2)
    expect(fatoresNoPonto({ lat: -3.13, lng: L }, cen, vazio).luz).toBe(0.5)
  })
  it('aplica avaliacoes do trecho e da celula', () => {
    const cen: Cenario = { ...cenarioVazio, trechos: [trecho('t1', -3.1, 0.5, 0.5, 0.5)] }
    const p = { lat: -3.1, lng: L + 0.002 }
    const ag = agregarAvaliacoes([{ id: 'x', alvoId: 't1', tipo: 'atencao', coord: p, criadoEm: '' }])
    expect(fatoresNoPonto(p, cen, ag).risco).toBeGreaterThan(0.5)
    const ag2 = agregarAvaliacoes([{ id: 'y', alvoId: alvoIdParaCoord(p), tipo: 'luz', coord: p, criadoEm: '' }])
    expect(fatoresNoPonto(p, cen, ag2).luz).toBeGreaterThan(0.5)
  })
})

describe('pontuarRota', () => {
  const cen: Cenario = {
    trechos: [trecho('boa', -3.1, 0.95, 0.9, 0.1), trecho('ruim', -3.11, 0.1, 0.1, 0.9)],
    areas: [],
    pontosApoio: [],
  }
  it('rota em trecho bem iluminado > rota em area de risco a noite', () => {
    const boa = pontuarRota(linha(-3.1), cen, vazio, 'noite')
    const ruim = pontuarRota(linha(-3.11), cen, vazio, 'noite')
    expect(boa.nota).toBeGreaterThan(ruim.nota)
    expect(boa.nivel).toBe('verde')
    expect(ruim.nivel).toBe('vermelho')
    expect(Number.isInteger(boa.nota)).toBe(true)
  })
  it('dia vs noite mudam a ordem', () => {
    const c: Cenario = {
      trechos: [trecho('A', -3.1, 1, 0.1, 0.3), trecho('B', -3.11, 0.1, 0.9, 0.1)],
      areas: [],
      pontosApoio: [],
    }
    const a = (p: 'dia' | 'noite') => pontuarRota(linha(-3.1), c, vazio, p)
    const b = (p: 'dia' | 'noite') => pontuarRota(linha(-3.11), c, vazio, p)
    expect(a('noite').nota).toBeGreaterThan(b('noite').nota)
    expect(b('dia').nota).toBeGreaterThan(a('dia').nota)
  })
  it('bonus de apoio: +2 por ponto distinto, teto 10', () => {
    const rota = linha(-3.1, L, L + 0.006)
    const sem = pontuarRota(rota, cenarioVazio, vazio, 'noite')
    const tres = pontuarRota(rota, { ...cenarioVazio, pontosApoio: [apoio('1', L), apoio('2', L + 0.003), apoio('3', L + 0.006)] }, vazio, 'noite')
    const muitos = pontuarRota(
      rota,
      { ...cenarioVazio, pontosApoio: [1, 2, 3, 4, 5, 6, 7].map((i) => apoio(`p${i}`, L + i * 0.0008)) },
      vazio,
      'noite',
    )
    expect(sem.nota).toBe(50)
    expect(sem.bonusApoio).toBe(0)
    expect(tres.bonusApoio).toBe(6)
    expect(tres.nota).toBe(56)
    expect(muitos.pontosApoioProximos.length).toBe(7)
    expect(muitos.bonusApoio).toBe(10)
    expect(muitos.nota).toBe(60)
  })
  it('apoio longe (>150 m) nao conta', () => {
    const longe = { ...apoio('l', L), coord: { lat: -3.1 + 0.002, lng: L } }
    expect(pontuarRota(linha(-3.1), { ...cenarioVazio, pontosApoio: [longe] }, vazio, 'noite').bonusApoio).toBe(0)
  })
  it('votos atencao derrubam a nota', () => {
    const c: Cenario = { ...cenarioVazio, trechos: [trecho('t', -3.1, 0.6, 0.6, 0.4)] }
    const votos: Avaliacao[] = [1, 2, 3, 4].map((i) => ({
      id: `v${i}`,
      alvoId: 't',
      tipo: 'atencao',
      coord: { lat: -3.1, lng: L },
      criadoEm: '',
    }))
    const antes = pontuarRota(linha(-3.1), c, vazio, 'noite').nota
    const depois = pontuarRota(linha(-3.1), c, agregarAvaliacoes(votos), 'noite').nota
    expect(depois).toBeLessThan(antes)
  })
  it('segmenta por cor com linha continua', () => {
    const c: Cenario = {
      trechos: [
        { ...trecho('v', -3.1, 0.95, 0.9, 0.1), coords: linha(-3.1, L, L + 0.002) },
        { ...trecho('r', -3.1, 0.05, 0.05, 0.95), coords: linha(-3.1, L + 0.002, L + 0.004) },
      ],
      areas: [],
      pontosApoio: [],
    }
    const r = pontuarRota(linha(-3.1), c, vazio, 'noite')
    const niveis = r.segmentos.map((s) => s.nivel)
    expect(niveis[0]).toBe('verde')
    expect(niveis[niveis.length - 1]).toBe('vermelho')
    for (let i = 1; i < niveis.length; i++) expect(niveis[i]).not.toBe(niveis[i - 1])
    for (let i = 1; i < r.segmentos.length; i++) {
      const ant = r.segmentos[i - 1].coords
      expect(r.segmentos[i].coords[0]).toEqual(ant[ant.length - 1])
    }
  })
  it('rota fora de tudo = nota neutra 50', () => {
    expect(pontuarRota(linha(-3.2), cenarioVazio, vazio, 'noite').nota).toBe(50)
  })
})

describe('ordenarRotas / nivelDoTrecho', () => {
  it('maior nota primeiro, empate -> menor comprimento, sem mutar', () => {
    const base = pontuarRota(linha(-3.1), cenarioVazio, vazio, 'noite')
    const a = { ...base, nota: 60, comprimentoM: 900 }
    const b = { ...base, nota: 60, comprimentoM: 500 }
    const c = { ...base, nota: 80, comprimentoM: 2000 }
    const entrada = [a, b, c]
    expect(ordenarRotas(entrada)).toEqual([c, b, a])
    expect(entrada[0]).toBe(a)
  })
  it('nivelDoTrecho reage a avaliacoes e periodo', () => {
    const t = trecho('t', -3.1, 0.6, 0.6, 0.4)
    expect(nivelDoTrecho(t, vazio, 'noite')).toBe('amarelo')
    const ag = agregarAvaliacoes(Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, alvoId: 't', tipo: 'atencao' as const, coord: { lat: 0, lng: 0 }, criadoEm: '' })))
    expect(nivelDoTrecho(t, ag, 'noite')).toBe('vermelho')
  })
})

describe('nivelDaArea', () => {
  const area: Area = {
    id: 'a1', bairro: 'Centro', zona: 'Centro-Sul', centro: { lat: 0, lng: L }, raioM: 300,
    luz: 0.5, fluxo: 0.5, risco: 0.5, fonte: 'estimativa',
  }
  it('usa votos da comunidade no id da area', () => {
    expect(nivelDaArea(area, vazio, 'noite')).toBe('amarelo')
    const votos = Array.from({ length: 30 }, (_, i): Avaliacao => ({
      id: String(i), alvoId: 'a1', tipo: 'atencao', coord: area.centro, criadoEm: '',
    }))
    expect(nivelDaArea(area, agregarAvaliacoes(votos), 'noite')).toBe('vermelho')
  })
})
