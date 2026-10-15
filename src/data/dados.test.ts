import { describe, expect, it } from 'vitest'
import { agregarAvaliacoes } from '../domain/avaliacoes'
import { pontuarRota } from '../domain/pontuacao'
import { mesclarRotas } from '../features/rotas/mesclarRotas'
import { avaliacoesSemente, REFERENCIA } from './comunidadeSemente'
import { buscarRotaPregravada, cenario, lugares, rotasModelo, rotasPregravadas } from './index'

const dentro = (c: { lat: number; lng: number }) =>
  c.lat >= -3.25 && c.lat <= -2.90 && c.lng >= -60.15 && c.lng <= -59.80
const unicos = (ids: string[]) => new Set(ids).size === ids.length

const BAIRROS_CHAVE = [
  'Tarumã', 'Lago Azul', 'Nova Cidade', 'Santa Etelvina', 'Colônia Terra Nova', 'Monte das Oliveiras', 'Cidade de Deus',
  'Novo Aleixo', 'Gilberto Mestrinho', 'Mauazinho', 'Puraquequara', 'Ponta Negra', 'Planalto', 'Redenção', 'Coroado',
  'Armando Mendes', 'Compensa', 'Centro', 'Zumbi dos Palmares', 'Jorge Teixeira',
]

describe('dados mock de Manaus', () => {
  it('ids únicos', () => {
    expect(unicos(cenario.trechos.map((t) => t.id))).toBe(true)
    expect(unicos(cenario.areas.map((t) => t.id))).toBe(true)
    expect(unicos(cenario.pontosApoio.map((t) => t.id))).toBe(true)
    expect(unicos(lugares.map((t) => t.id))).toBe(true)
    expect(unicos(rotasModelo.map((t) => t.id))).toBe(true)
    expect(unicos(avaliacoesSemente.map((t) => t.id))).toBe(true)
  })

  it('contagens mínimas e fatores em 0..1', () => {
    expect(cenario.areas.length).toBeGreaterThanOrEqual(60)
    expect(cenario.trechos.length).toBeGreaterThanOrEqual(90)
    expect(cenario.trechos.length).toBeLessThanOrEqual(140)
    for (const x of [...cenario.trechos, ...cenario.areas]) {
      for (const v of [x.luz, x.fluxo, x.risco]) expect(v >= 0 && v <= 1).toBe(true)
    }
    for (const t of cenario.trechos) expect(t.coords.length).toBeLessThanOrEqual(40)
  })

  it('cobertura: bairros-chave têm área e toda zona tem >=5 trechos', () => {
    const bairros = new Set(cenario.areas.map((a) => a.bairro))
    for (const b of BAIRROS_CHAVE) expect(bairros.has(b)).toBe(true)
    const zonas = new Set(cenario.areas.map((a) => a.zona))
    expect(zonas.size).toBeGreaterThanOrEqual(6)
    for (const z of zonas) {
      const n = cenario.trechos.filter((t) => cenario.areas.find((a) => a.bairro === t.bairro)?.zona === z).length
      expect(n).toBeGreaterThanOrEqual(5)
    }
    for (const t of cenario.trechos) expect(bairros.has(t.bairro)).toBe(true)
  })

  it('coordenadas dentro do bbox de Manaus', () => {
    for (const t of cenario.trechos) t.coords.forEach((c) => expect(dentro(c)).toBe(true))
    for (const a of cenario.areas) expect(dentro(a.centro)).toBe(true)
    for (const p of cenario.pontosApoio) expect(dentro(p.coord)).toBe(true)
    for (const l of lugares) expect(dentro(l.coord)).toBe(true)
    for (const r of rotasPregravadas) r.rotas.forEach((x) => x.coords.forEach((c) => expect(dentro(c)).toBe(true)))
    for (const a of avaliacoesSemente) expect(dentro(a.coord)).toBe(true)
  })

  it('relatos semente: cobertura em todo trecho (>=3) e área (>=5), 650..1100, todos semente, alvos válidos e datas até a referência', () => {
    expect(avaliacoesSemente.length).toBeGreaterThanOrEqual(650)
    expect(avaliacoesSemente.length).toBeLessThanOrEqual(1100)
    const alvos = new Set([...cenario.trechos.map((t) => t.id), ...cenario.areas.map((a) => a.id)])
    const cont = (id: string) => avaliacoesSemente.filter((a) => a.alvoId === id).length
    for (const t of cenario.trechos) expect(cont(t.id)).toBeGreaterThanOrEqual(3)
    for (const a of cenario.areas) expect(cont(a.id)).toBeGreaterThanOrEqual(5)
    const ref = Date.parse(REFERENCIA)
    for (const a of avaliacoesSemente) {
      expect(a.semente).toBe(true)
      expect(alvos.has(a.alvoId) || a.alvoId.startsWith('cel:')).toBe(true)
      const t = Date.parse(a.criadoEm)
      expect(t).toBeLessThanOrEqual(ref)
      expect(t).toBeGreaterThanOrEqual(ref - 121 * 864e5)
    }
    const tipos = new Set(avaliacoesSemente.map((a) => a.tipo))
    expect(tipos.size).toBe(3)
    expect(new Set(avaliacoesSemente.map((a) => a.autorNome)).size).toBeGreaterThanOrEqual(60)
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

  it('rotas-modelo (com relatos semente): diferença >=15 à noite e a gravada segura presente', () => {
    const agregado = agregarAvaliacoes(avaliacoesSemente)
    const falhas: unknown[] = []
    for (const m of rotasModelo) {
      const o = lugares.find((l) => l.id === m.origemId)!.coord
      const d = lugares.find((l) => l.id === m.destinoId)!.coord
      const gravadas = buscarRotaPregravada(o, d)!
      const nota = (c: { lat: number; lng: number }[]) => pontuarRota(c, cenario, agregado, 'noite').nota
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
