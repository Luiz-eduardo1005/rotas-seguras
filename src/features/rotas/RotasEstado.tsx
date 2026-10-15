import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ResultadoRota } from '../../domain/tipos'
import { ordenarRotas, pontuarRota } from '../../domain/pontuacao'
import { buscarRotaPregravada, cenario, lugares, rotasModelo } from '../../data'
import { buscarRotasAPe, ErroRotasApi, type RotaBruta } from '../../services/rotasApi'
import {
  carregarRotasSalvas,
  gravarRotasSalvas,
  type PontoRota,
  type RotaSalva,
} from '../../services/armazenamento'
import { useAppEstado } from '../estado/AppEstado'
import { lerLinkRota } from './compartilhar'
import { mesclarRotas } from './mesclarRotas'

export type { PontoRota, RotaSalva }
export type ModoEscolha = 'origem' | 'destino' | null
export type OrigemDados = 'ao-vivo' | 'offline'
export type RotaAvaliada = ResultadoRota & RotaBruta

interface RotasValor {
  origem: PontoRota | null
  destino: PontoRota | null
  setOrigem: (p: PontoRota | null) => void
  setDestino: (p: PontoRota | null) => void
  inverter: () => void
  modoEscolha: ModoEscolha
  setModoEscolha: (m: ModoEscolha) => void
  escolherPontoNoMapa: (coord: PontoRota['coord']) => boolean
  buscar: () => Promise<void>
  carregando: boolean
  erro: string | null
  origemDados: OrigemDados | null
  resultados: RotaAvaliada[]
  /** incrementa a cada novo conjunto de resultados (gatilho de fitBounds) */
  versaoResultados: number
  selecionadaIdx: number
  selecionar: (i: number) => void
  usarRotaModelo: (id: string) => void
  /** painel expandido (persiste entre abas); recolhe ao chegar resultado */
  painelAberto: boolean
  setPainelAberto: (a: boolean) => void
  limpar: () => void
  rotasSalvas: RotaSalva[]
  salvarRotaAtual: () => boolean
  removerSalva: (id: string) => void
  abrirSalva: (id: string) => void
}

const Ctx = createContext<RotasValor | null>(null)

const MSG_ERRO =
  'Não foi possível buscar a rota: sem conexão com o serviço e sem rota pré-gravada para este trajeto. Tente um dos trajetos de exemplo.'

export function RotasProvider({ children }: { children: ReactNode }) {
  const { periodo, setPeriodo, agregado } = useAppEstado()
  const [origem, setOrigem] = useState<PontoRota | null>(null)
  const [destino, setDestino] = useState<PontoRota | null>(null)
  const [modoEscolha, setModoEscolha] = useState<ModoEscolha>(null)
  const [brutas, setBrutas] = useState<RotaBruta[]>([])
  const [origemDados, setOrigemDados] = useState<OrigemDados | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [selecionadaIdx, setSelecionadaIdx] = useState(0)
  const [versaoResultados, setVersao] = useState(0)
  const [painelAberto, setPainelAberto] = useState(true)
  const [rotasSalvas, setRotasSalvas] = useState<RotaSalva[]>(carregarRotasSalvas)
  const ctrl = useRef<AbortController | null>(null)

  const resultados = useMemo<RotaAvaliada[]>(
    () => ordenarRotas(brutas.map((b) => ({ ...pontuarRota(b.coords, cenario, agregado, periodo), ...b }))),
    [brutas, agregado, periodo],
  )

  const executar = useCallback(async (o: PontoRota, d: PontoRota) => {
    ctrl.current?.abort()
    const c = new AbortController()
    ctrl.current = c
    setCarregando(true)
    setErro(null)
    const aplicar = (rotas: RotaBruta[], fonte: OrigemDados) => {
      setBrutas(rotas)
      setOrigemDados(fonte)
      setSelecionadaIdx(0)
      setVersao((v) => v + 1)
      setPainelAberto(false)
    }
    const off = buscarRotaPregravada(o.coord, d.coord)
    try {
      const vivas = await buscarRotasAPe(o.coord, d.coord, c.signal)
      aplicar(off?.length ? mesclarRotas(off, vivas) : vivas, 'ao-vivo')
    } catch (e) {
      if (c.signal.aborted || (e instanceof ErroRotasApi && e.motivo === 'cancelado')) return
      if (off?.length) aplicar(off, 'offline')
      else {
        setBrutas([])
        setOrigemDados(null)
        setErro(MSG_ERRO)
      }
    } finally {
      if (ctrl.current === c) setCarregando(false)
    }
  }, [])

  const buscar = useCallback(async () => {
    if (!origem || !destino) {
      setErro('Defina origem e destino para buscar a rota.')
      return
    }
    await executar(origem, destino)
  }, [origem, destino, executar])

  // deep link: ?o=lat,lng&on=nome&d=lat,lng&dn=nome&p=dia|noite
  useEffect(() => {
    const link = lerLinkRota(window.location.search)
    if (!link) return
    setOrigem(link.origem)
    setDestino(link.destino)
    if (link.periodo) setPeriodo(link.periodo)
    void executar(link.origem, link.destino)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => ctrl.current?.abort(), [])

  const escolherPontoNoMapa = useCallback(
    (coord: PontoRota['coord']) => {
      if (!modoEscolha) return false
      const p = { nome: 'Ponto no mapa', coord }
      if (modoEscolha === 'origem') setOrigem(p)
      else setDestino(p)
      setModoEscolha(null)
      return true
    },
    [modoEscolha],
  )

  const inverter = useCallback(() => {
    setOrigem(destino)
    setDestino(origem)
  }, [origem, destino])

  const limpar = useCallback(() => {
    ctrl.current?.abort()
    setOrigem(null)
    setDestino(null)
    setBrutas([])
    setOrigemDados(null)
    setErro(null)
    setCarregando(false)
    setModoEscolha(null)
    setSelecionadaIdx(0)
  }, [])

  const buscarEntre = useCallback(
    (o: PontoRota, d: PontoRota) => {
      setOrigem(o)
      setDestino(d)
      void executar(o, d)
    },
    [executar],
  )

  const usarRotaModelo = useCallback(
    (id: string) => {
      const m = rotasModelo.find((r) => r.id === id)
      const lo = lugares.find((l) => l.id === m?.origemId)
      const ld = lugares.find((l) => l.id === m?.destinoId)
      if (!m || !lo || !ld) return
      buscarEntre({ nome: lo.nome, coord: lo.coord }, { nome: ld.nome, coord: ld.coord })
    },
    [buscarEntre],
  )

  const persistir = useCallback((rotas: RotaSalva[]) => {
    setRotasSalvas(rotas)
    gravarRotasSalvas(rotas)
  }, [])

  const salvarRotaAtual = useCallback(() => {
    if (!origem || !destino) return false
    const nome = `${origem.nome} → ${destino.nome}`
    if (rotasSalvas.some((r) => r.nome === nome)) return true
    persistir([{ id: crypto.randomUUID(), nome, origem, destino }, ...rotasSalvas])
    return true
  }, [origem, destino, rotasSalvas, persistir])

  const removerSalva = useCallback(
    (id: string) => persistir(rotasSalvas.filter((r) => r.id !== id)),
    [rotasSalvas, persistir],
  )

  const abrirSalva = useCallback(
    (id: string) => {
      const r = rotasSalvas.find((s) => s.id === id)
      if (r) buscarEntre(r.origem, r.destino)
    },
    [rotasSalvas, buscarEntre],
  )

  const valor: RotasValor = {
    origem, destino, setOrigem, setDestino, inverter, modoEscolha, setModoEscolha, escolherPontoNoMapa,
    buscar, painelAberto, setPainelAberto, carregando, erro, origemDados, resultados, versaoResultados, selecionadaIdx,
    selecionar: setSelecionadaIdx, usarRotaModelo, limpar, rotasSalvas, salvarRotaAtual, removerSalva, abrirSalva,
  }
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRotas(): RotasValor {
  const v = useContext(Ctx)
  if (!v) throw new Error('useRotas fora de RotasProvider')
  return v
}
