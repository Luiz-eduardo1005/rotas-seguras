import type { Avaliacao, Periodo } from '../domain/tipos'

const CHAVE_AVALIACOES = 'rotas-seguras:v1:avaliacoes'
const CHAVE_PREFS = 'rotas-seguras:v1:preferencias'

export interface Preferencias {
  periodo: Periodo
  onboardingVisto: boolean
  rotasSalvas?: unknown[]
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

function gravar(chave: string, valor: unknown): void {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    /* armazenamento indisponível ou cheio: segue em memória */
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
  return Array.isArray(dados) ? dados.filter(avaliacaoValida) : []
}

export function salvarAvaliacoes(avaliacoes: Avaliacao[]): void {
  gravar(CHAVE_AVALIACOES, avaliacoes)
}

export function carregarPreferencias(): Preferencias {
  const d = ler(CHAVE_PREFS)
  if (!d || typeof d !== 'object') return { ...PADRAO }
  const o = d as Record<string, unknown>
  return {
    periodo: o.periodo === 'dia' ? 'dia' : 'noite',
    onboardingVisto: o.onboardingVisto === true,
    rotasSalvas: Array.isArray(o.rotasSalvas) ? o.rotasSalvas : undefined,
  }
}

export function salvarPreferencias(prefs: Preferencias): void {
  gravar(CHAVE_PREFS, prefs)
}
