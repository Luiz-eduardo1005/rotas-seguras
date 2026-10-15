import { distanciaM } from '../domain/geo'
import type { LatLng } from '../domain/tipos'
import { gerarId } from '../lib/gerarId'
import type { PontoRota } from './armazenamento'

const CHAVE_HISTORICO = 'rotas-seguras:v1:historico'
export const HISTORICO_MAX = 8
const RAIO_IGUAL_M = 50

export interface EntradaHistorico {
  id: string
  origem: PontoRota
  destino: PontoRota
  /** ISO 8601 */
  quando: string
}

const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

function pontoValido(p: unknown): p is PontoRota {
  if (!p || typeof p !== 'object') return false
  const o = p as Record<string, unknown>
  const c = o.coord as Record<string, unknown> | undefined
  return typeof o.nome === 'string' && !!c && num(c.lat) && num(c.lng)
}

function entradaValida(e: unknown): e is EntradaHistorico {
  if (!e || typeof e !== 'object') return false
  const o = e as Record<string, unknown>
  return typeof o.id === 'string' && typeof o.quando === 'string' && pontoValido(o.origem) && pontoValido(o.destino)
}

const perto = (a: LatLng, b: LatLng) => distanciaM(a, b) <= RAIO_IGUAL_M

/** Insere/move para o topo (dedupe por par origem/destino a ≤50 m) e limita a HISTORICO_MAX. Pura. */
export function adicionarAoHistorico(
  lista: EntradaHistorico[],
  origem: PontoRota,
  destino: PontoRota,
  quando: string,
  id: string = gerarId(),
): EntradaHistorico[] {
  const resto = lista.filter((e) => !(perto(e.origem.coord, origem.coord) && perto(e.destino.coord, destino.coord)))
  return [{ id, origem, destino, quando }, ...resto].slice(0, HISTORICO_MAX)
}

export function carregarHistorico(): EntradaHistorico[] {
  try {
    const bruto = localStorage.getItem(CHAVE_HISTORICO)
    const v: unknown = bruto ? JSON.parse(bruto) : null
    return Array.isArray(v) ? v.filter(entradaValida).slice(0, HISTORICO_MAX) : []
  } catch {
    return []
  }
}

function gravar(lista: EntradaHistorico[]): void {
  try {
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(lista))
  } catch {
    /* armazenamento cheio/bloqueado: segue em memória */
  }
}

/** Registra uma busca e devolve a lista atualizada. */
export function registrarBusca(origem: PontoRota, destino: PontoRota): EntradaHistorico[] {
  const lista = adicionarAoHistorico(carregarHistorico(), origem, destino, new Date().toISOString())
  gravar(lista)
  return lista
}

export function removerDoHistorico(id: string): EntradaHistorico[] {
  const lista = carregarHistorico().filter((e) => e.id !== id)
  gravar(lista)
  return lista
}

export function limparHistorico(): EntradaHistorico[] {
  gravar([])
  return []
}
