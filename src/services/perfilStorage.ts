export type Deslocamento = 'estudante-noturno' | 'trabalho' | 'visitante' | 'acompanho-crianca' | 'outro'
export type Retorno = 'antes-18h' | '18-22h' | 'apos-22h'

export interface ContatoConfianca {
  nome: string
  /** só dígitos, 10–13 */
  telefone: string
}

export interface Perfil {
  apelido: string
  deslocamento: Deslocamento
  retorno: Retorno
  bairroCasaId?: string
  contatoConfianca?: ContatoConfianca
  criadoEm: string
}

const CHAVE_PERFIL = 'rotas-seguras:v1:perfil'
const CHAVE_PULADO = 'rotas-seguras:v1:perfil-pulado'
const PREFIXO = 'rotas-seguras:'

const DESLOCAMENTOS: Deslocamento[] = ['estudante-noturno', 'trabalho', 'visitante', 'acompanho-crianca', 'outro']
const RETORNOS: Retorno[] = ['antes-18h', '18-22h', 'apos-22h']

export const soDigitos = (v: string) => v.replace(/\D/g, '')
export const apelidoValido = (v: string) => v.trim().length >= 1 && v.trim().length <= 24
export const telefoneValido = (v: string) => /^\d{10,13}$/.test(v)

export function perfilValido(p: unknown): p is Perfil {
  if (!p || typeof p !== 'object') return false
  const o = p as Record<string, unknown>
  if (typeof o.apelido !== 'string' || !apelidoValido(o.apelido)) return false
  if (!DESLOCAMENTOS.includes(o.deslocamento as Deslocamento)) return false
  if (!RETORNOS.includes(o.retorno as Retorno)) return false
  if (typeof o.criadoEm !== 'string') return false
  if (o.bairroCasaId !== undefined && typeof o.bairroCasaId !== 'string') return false
  if (o.contatoConfianca !== undefined) {
    const c = o.contatoConfianca as Record<string, unknown> | null
    if (!c || typeof c.nome !== 'string' || typeof c.telefone !== 'string' || !telefoneValido(c.telefone)) return false
  }
  return true
}

export function carregarPerfil(): Perfil | null {
  try {
    const bruto = localStorage.getItem(CHAVE_PERFIL)
    const dados: unknown = bruto ? JSON.parse(bruto) : null
    return perfilValido(dados) ? dados : null
  } catch {
    return null
  }
}

export function salvarPerfil(p: Perfil): boolean {
  try {
    localStorage.setItem(CHAVE_PERFIL, JSON.stringify(p))
    return true
  } catch {
    return false
  }
}

export function carregarPerfilPulado(): boolean {
  try {
    return localStorage.getItem(CHAVE_PULADO) === '1'
  } catch {
    return false
  }
}

export function salvarPerfilPulado(): void {
  try {
    localStorage.setItem(CHAVE_PULADO, '1')
  } catch {
    /* segue em memória */
  }
}

/** Remove TODAS as chaves rotas-seguras:* (avaliações, prefs, rotas, perfil...). */
export function apagarTodosOsDados(): void {
  try {
    const chaves: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(PREFIXO)) chaves.push(k)
    }
    chaves.forEach((k) => localStorage.removeItem(k))
  } catch {
    /* armazenamento indisponível */
  }
}

export const ROTULO_DESLOCAMENTO: Record<Deslocamento, string> = {
  'estudante-noturno': 'Estudante noturno',
  trabalho: 'Trabalho',
  visitante: 'Visitante',
  'acompanho-crianca': 'Acompanho criança',
  outro: 'Outro',
}

export const ROTULO_RETORNO: Record<Retorno, string> = {
  'antes-18h': 'Antes das 18h',
  '18-22h': 'Entre 18h e 22h',
  'apos-22h': 'Após as 22h',
}
