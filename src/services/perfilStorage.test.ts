import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apagarTodosOsDados, carregarPerfil, perfilValido, salvarPerfil, type Perfil } from './perfilStorage'

const base: Perfil = { apelido: 'Ana', deslocamento: 'trabalho', retorno: '18-22h', criadoEm: '2026-01-01T00:00:00Z' }

describe('perfilStorage', () => {
  beforeEach(() => {
    const m = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      get length() {
        return m.size
      },
      key: (i: number) => [...m.keys()][i] ?? null,
      getItem: (k: string) => m.get(k) ?? null,
      setItem: (k: string, v: string) => void m.set(k, v),
      removeItem: (k: string) => void m.delete(k),
      clear: () => m.clear(),
    })
  })

  it('valida apelido e telefone', () => {
    expect(perfilValido(base)).toBe(true)
    expect(perfilValido({ ...base, apelido: '' })).toBe(false)
    expect(perfilValido({ ...base, apelido: 'x'.repeat(25) })).toBe(false)
    expect(perfilValido({ ...base, contatoConfianca: { nome: 'Mãe', telefone: '123' } })).toBe(false)
    expect(perfilValido({ ...base, contatoConfianca: { nome: 'Mãe', telefone: '92999998888' } })).toBe(true)
  })

  it('salva, carrega e rejeita inválido', () => {
    expect(salvarPerfil(base)).toBe(true)
    expect(carregarPerfil()).toEqual(base)
    localStorage.setItem('rotas-seguras:v1:perfil', '{"apelido":1}')
    expect(carregarPerfil()).toBeNull()
  })

  it('apaga só chaves do app', () => {
    localStorage.setItem('rotas-seguras:v1:a', '1')
    localStorage.setItem('outra', '1')
    apagarTodosOsDados()
    expect(localStorage.getItem('rotas-seguras:v1:a')).toBeNull()
    expect(localStorage.getItem('outra')).toBe('1')
  })
})
