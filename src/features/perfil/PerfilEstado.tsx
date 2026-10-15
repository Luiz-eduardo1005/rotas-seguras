import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useAppEstado } from '../estado/AppEstado'
import {
  apagarTodosOsDados,
  carregarPerfil,
  carregarPerfilPulado,
  salvarPerfil,
  salvarPerfilPulado,
  type Perfil,
} from '../../services/perfilStorage'

interface PerfilValor {
  perfil: Perfil | null
  /** false se o armazenamento falhou (perfil segue em memória) */
  salvar: (p: Perfil) => boolean
  pularPerfil: () => void
  precisaCriar: boolean
  apagarDados: () => void
}

const Ctx = createContext<PerfilValor | null>(null)

export function PerfilProvider({ children }: { children: ReactNode }) {
  const { onboardingVisto, setPeriodo } = useAppEstado()
  const [perfil, setPerfil] = useState<Perfil | null>(carregarPerfil)
  const [pulado, setPulado] = useState(carregarPerfilPulado)

  const salvar = useCallback(
    (p: Perfil) => {
      setPerfil(p)
      setPeriodo(p.retorno === 'antes-18h' ? 'dia' : 'noite')
      return salvarPerfil(p)
    },
    [setPeriodo],
  )

  const pularPerfil = useCallback(() => {
    setPulado(true)
    salvarPerfilPulado()
  }, [])

  const apagarDados = useCallback(() => {
    apagarTodosOsDados()
    location.reload()
  }, [])

  const valor = useMemo(
    () => ({ perfil, salvar, pularPerfil, apagarDados, precisaCriar: onboardingVisto && !perfil && !pulado }),
    [perfil, salvar, pularPerfil, apagarDados, onboardingVisto, pulado],
  )
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePerfil(): PerfilValor {
  const v = useContext(Ctx)
  if (!v) throw new Error('usePerfil fora do PerfilProvider')
  return v
}
