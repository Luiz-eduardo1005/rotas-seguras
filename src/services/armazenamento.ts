import { AUTOR_LOCAL } from '../domain/avaliacoes'
import type { Avaliacao, LatLng, Periodo } from '../domain/tipos'

const CHAVE_AVALIACOES = 'rotas-seguras:v1:avaliacoes'
const CHAVE_PREFS = 'rotas-seguras:v1:preferencias'
// chave própria: o AppEstado regrava as preferências inteiras ao trocar período e apagaria as rotas salvas
const CHAVE_ROTAS_SALVAS = 'rotas-seguras:v1:rotas-salvas'

export interface PontoRota {
  nome: string
  coord: LatLng
}

export interface RotaSalva {
  id: string
  nome: string
  origem: PontoRota
  destino: PontoRota
}

export interface Preferencias {
  periodo: Periodo
  onboardingVisto: boolean
}

const PADRAO: Preferencias = { periodo: 'noite', onboardingVisto: false }

function ler(chave: string): unknown {
  try {
    const bruto = localStorage.getItem(chave)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    return null
  }
}

/** false se o armazenamento estiver cheio ou bloqueado (segue em memória). */
function gravar(chave: string, valor: unknown): boolean {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

function avaliacaoValida(a: unknown): a is Avaliacao {
  if (!a || typeof a !== 'object') return false
  const o = a as Record<string, unknown>
  const c = o.coord as Record<string, unknown> | undefined
  return (
    typeof o.id === 'string' &&
    typeof o.alvoId === 'string' &&
    (o.tipo === 'luz' || o.tipo === 'fluxo' || o.tipo === 'atencao') &&
    typeof o.criadoEm === 'string' &&
    !!c && num(c.lat) && num(c.lng)
  )
}

export function carregarAvaliacoes(): Avaliacao[] {
  const dados = ler(CHAVE_AVALIACOES)
  if (!Array.isArray(dados)) return []
  // migração: avaliações antigas não tinham autor
  return dados.filter(avaliacaoValida).map((a) => ({
    ...a,
    autorId: typeof a.autorId === 'string' ? a.autorId : AUTOR_LOCAL,
    autorNome: typeof a.autorNome === 'string' ? a.autorNome : 'Você',
  }))
}

export function salvarAvaliacoes(avaliacoes: Avaliacao[]): boolean {
  return gravar(CHAVE_AVALIACOES, avaliacoes)
}

export function carregarPreferencias(): Preferencias {
  const d = ler(CHAVE_PREFS)
  if (!d || typeof d !== 'object') return { ...PADRAO }
  const o = d as Record<string, unknown>
  return {
    periodo: o.periodo === 'dia' ? 'dia' : 'noite',
    onboardingVisto: o.onboardingVisto === true,
  }
}

export function salvarPreferencias(prefs: Preferencias): void {
  gravar(CHAVE_PREFS, prefs)
}

function pontoValido(p: unknown): p is PontoRota {
  if (!p || typeof p !== 'object') return false
  const o = p as Record<string, unknown>
  const c = o.coord as Record<string, unknown> | undefined
  return typeof o.nome === 'string' && !!c && num(c.lat) && num(c.lng)
}

export function carregarRotasSalvas(): RotaSalva[] {
  const d = ler(CHAVE_ROTAS_SALVAS)
  if (!Array.isArray(d)) return []
  return d.filter(
    (r): r is RotaSalva =>
      !!r && typeof r.id === 'string' && typeof r.nome === 'string' && pontoValido(r.origem) && pontoValido(r.destino),
  )
}

export function gravarRotasSalvas(rotas: RotaSalva[]): void {
  gravar(CHAVE_ROTAS_SALVAS, rotas)
}
