import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Avaliacao, Periodo } from '../../domain/tipos'
import { agregarAvaliacoes, type AgregadoAlvo } from '../../domain/avaliacoes'
import {
  carregarAvaliacoes,
  carregarPreferencias,
  salvarAvaliacoes,
  salvarPreferencias,
  type Preferencias,
} from '../../services/armazenamento'

export type Aba = 'mapa' | 'camadas' | 'salvos' | 'perfil'
export interface CamadasVisiveis {
  trechos: boolean
  areas: boolean
  apoio: boolean
}
export type NovaAvaliacao = Omit<Avaliacao, 'id' | 'criadoEm'>

interface AppEstadoValor {
  periodo: Periodo
  setPeriodo: (p: Periodo) => void
  avaliacoes: Avaliacao[]
  adicionarAvaliacao: (dados: NovaAvaliacao) => void
  agregado: Map<string, AgregadoAlvo>
  onboardingVisto: boolean
  marcarOnboarding: () => void
  abaAtiva: Aba
  setAbaAtiva: (a: Aba) => void
  camadasVisiveis: CamadasVisiveis
  alternarCamada: (c: keyof CamadasVisiveis) => void
}

const Ctx = createContext<AppEstadoValor | null>(null)

export function AppEstadoProvider({ children }: { children: ReactNode }) {
  const [prefs] = useState(carregarPreferencias)
  const [periodo, setPeriodoState] = useState<Periodo>(prefs.periodo)
  const [onboardingVisto, setOnboardingVisto] = useState(prefs.onboardingVisto)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(carregarAvaliacoes)
  const [abaAtiva, setAbaAtiva] = useState<Aba>('mapa')
  const [camadasVisiveis, setCamadas] = useState<CamadasVisiveis>({ trechos: true, areas: true, apoio: true })

  // ref com as preferências atuais: setters nunca regravam valor antigo
  const prefsRef = useRef<Preferencias>(prefs)
  const atualizarPrefs = useCallback((parcial: Partial<Preferencias>) => {
    prefsRef.current = { ...prefsRef.current, ...parcial }
    salvarPreferencias(prefsRef.current)
  }, [])

  const setPeriodo = useCallback(
    (p: Periodo) => {
      setPeriodoState(p)
      atualizarPrefs({ periodo: p })
    },
    [atualizarPrefs],
  )

  const marcarOnboarding = useCallback(() => {
    setOnboardingVisto(true)
    atualizarPrefs({ onboardingVisto: true })
  }, [atualizarPrefs])

  const adicionarAvaliacao = useCallback((dados: NovaAvaliacao) => {
    const nova: Avaliacao = { ...dados, id: crypto.randomUUID(), criadoEm: new Date().toISOString() }
    setAvaliacoes((atual) => {
      const prox = [...atual, nova]
      salvarAvaliacoes(prox)
      return prox
    })
  }, [])

  const alternarCamada = useCallback(
    (c: keyof CamadasVisiveis) => setCamadas((v) => ({ ...v, [c]: !v[c] })),
    [],
  )

  const agregado = useMemo(() => agregarAvaliacoes(avaliacoes), [avaliacoes])

  const valor: AppEstadoValor = {
    periodo, setPeriodo, avaliacoes, adicionarAvaliacao, agregado,
    onboardingVisto, marcarOnboarding, abaAtiva, setAbaAtiva, camadasVisiveis, alternarCamada,
  }
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppEstado(): AppEstadoValor {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAppEstado fora de AppEstadoProvider')
  return v
}
