import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import { Bus, History, Home, GraduationCap, Landmark, LocateFixed, MapPin, Shield, Crosshair, type LucideIcon } from 'lucide-react'
import { lugares, type Lugar } from '../../data'
import { areas } from '../../data/areas'
import { usePerfil } from '../perfil/PerfilEstado'
import { useRotas, type PontoRota } from './RotasEstado'

interface Props {
  qual: 'origem' | 'destino'
  rotulo: string
  valor: PontoRota | null
  onEscolher: (p: PontoRota) => void
}

const ICONES: Record<Lugar['tipo'], LucideIcon> = {
  escola: GraduationCap,
  terminal: Bus,
  bairro: MapPin,
  apoio: Shield,
  referencia: Landmark,
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

type Opcao = { tipo: 'casa'; ponto: PontoRota } | { tipo: 'recente'; ponto: PontoRota } | { tipo: 'lugar'; lugar: Lugar } | { tipo: 'gps' } | { tipo: 'mapa' }

export default function CampoLugar({ qual, rotulo, valor, onEscolher }: Props) {
  const { setModoEscolha, historico } = useRotas()
  const { perfil } = usePerfil()
  const id = useId()
  const [texto, setTexto] = useState<string | null>(null) // null = não está editando
  const [ativo, setAtivo] = useState(0)
  const [erroGps, setErroGps] = useState<string | null>(null)
  const [localizando, setLocalizando] = useState(false)

  const opcoes = useMemo<Opcao[]>(() => {
    const q = norm(texto ?? '').trim()
    const achados = q
      ? lugares.filter((l) => norm(`${l.nome} ${l.bairro}`).includes(q)).slice(0, 6)
      : []
    const recentes: Opcao[] = []
    if (!q) {
      const vistos = new Set<string>()
      for (const e of historico) {
        for (const ponto of [e.destino, e.origem]) {
          if (recentes.length >= 3 || vistos.has(ponto.nome)) continue
          vistos.add(ponto.nome)
          recentes.push({ tipo: 'recente', ponto })
        }
      }
    }
    const area = perfil?.bairroCasaId ? areas.find((a) => a.id === perfil.bairroCasaId) : undefined
    const casa: Opcao[] =
      area && (!q || 'casa'.includes(q) || q.includes('casa'))
        ? [{ tipo: 'casa', ponto: { nome: `Casa · ${area.bairro}`, coord: area.centro } }]
        : []
    return [
      ...casa,
      ...recentes,
      ...achados.map((lugar): Opcao => ({ tipo: 'lugar', lugar })),
      { tipo: 'gps' },
      { tipo: 'mapa' },
    ]
  }, [texto, historico, perfil])

  const aberto = texto !== null

  const fechar = () => {
    setTexto(null)
    setAtivo(0)
  }

  const escolher = (o: Opcao) => {
    if (o.tipo === 'recente' || o.tipo === 'casa') {
      onEscolher(o.ponto)
      setErroGps(null)
    } else if (o.tipo === 'lugar') {
      onEscolher({ nome: o.lugar.nome, coord: o.lugar.coord })
      setErroGps(null)
    } else if (o.tipo === 'mapa') {
      setErroGps(null)
      setModoEscolha(qual)
    } else {
      localizar()
    }
    fechar()
  }

  const localizar = () => {
    if (!window.isSecureContext) {
      setErroGps('Localização precisa de conexão segura (https). Abra pelo link publicado.')
      return
    }
    if (!('geolocation' in navigator)) {
      setErroGps('Seu aparelho não oferece localização.')
      return
    }
    setLocalizando(true)
    setErroGps(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalizando(false)
        onEscolher({ nome: 'Minha localização', coord: { lat: pos.coords.latitude, lng: pos.coords.longitude } })
      },
      (e) => {
        setLocalizando(false)
        setErroGps(
          e.code === e.PERMISSION_DENIED
            ? 'Permissão de localização negada. Escolha no mapa ou digite um lugar.'
            : 'Não foi possível obter sua localização. Tente de novo ou escolha no mapa.',
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    )
  }

  const aoTeclar = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!aberto) setTexto(valor?.nome ?? '')
      else setAtivo((a) => (a + 1) % opcoes.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setAtivo((a) => (a - 1 + opcoes.length) % opcoes.length)
    } else if (e.key === 'Enter' && aberto) {
      e.preventDefault()
      escolher(opcoes[ativo] ?? opcoes[0])
    } else if (e.key === 'Escape' && aberto) {
      e.preventDefault()
      fechar()
    }
  }

  const listaId = `${id}-lista`
  return (
    <div>
      <label htmlFor={`${id}-in`} className="mb-1 block text-xs font-medium text-ink-dim">
        {rotulo}
      </label>
      <input
        id={`${id}-in`}
        role="combobox"
        aria-expanded={aberto}
        aria-controls={listaId}
        aria-autocomplete="list"
        aria-activedescendant={aberto ? `${id}-op-${ativo}` : undefined}
        autoComplete="off"
        value={texto ?? valor?.nome ?? ''}
        placeholder={qual === 'origem' ? 'De onde você sai?' : 'Para onde você vai?'}
        onFocus={() => setTexto(valor?.nome ?? '')}
        onBlur={fechar}
        onChange={(e) => {
          setTexto(e.target.value)
          setAtivo(0)
        }}
        onKeyDown={aoTeclar}
        className="min-h-11 w-full rounded-xl border border-line bg-surface-solid px-3 text-sm text-ink placeholder:text-ink-dim focus:border-route focus:outline-none focus-visible:ring-2 focus-visible:ring-route"
      />
      {aberto && (
        <ul
          id={listaId}
          role="listbox"
          aria-label={`Sugestões de ${rotulo.toLowerCase()}`}
          className="painel-rolagem mt-1 max-h-56 overflow-y-auto rounded-xl border border-line bg-surface-solid p-1"
        >
          {opcoes.map((o, i) => {
            const Icone =
              o.tipo === 'casa' ? Home : o.tipo === 'recente' ? History : o.tipo === 'lugar' ? ICONES[o.lugar.tipo] : o.tipo === 'gps' ? LocateFixed : Crosshair
            const nome =
              o.tipo === 'recente' || o.tipo === 'casa' ? o.ponto.nome : o.tipo === 'lugar' ? o.lugar.nome : o.tipo === 'gps' ? 'Minha localização' : 'Escolher no mapa'
            return (
              <li
                key={o.tipo === 'lugar' ? o.lugar.id : o.tipo === 'recente' ? `r-${o.ponto.nome}` : o.tipo === 'casa' ? 'casa' : o.tipo}
                id={`${id}-op-${i}`}
                role="option"
                aria-selected={i === ativo}
                onMouseDown={(e) => {
                  e.preventDefault()
                  escolher(o)
                }}
                onMouseEnter={() => setAtivo(i)}
                className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm ${
                  i === ativo ? 'bg-route/15 text-ink' : 'text-ink'
                } ${o.tipo === 'gps' || o.tipo === 'mapa' ? 'text-route' : ''}`}
              >
                <Icone size={18} className="shrink-0 text-route" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{nome}</span>
                {o.tipo === 'lugar' && <span className="shrink-0 text-xs text-ink-dim">{o.lugar.bairro}</span>}
              </li>
            )
          })}
        </ul>
      )}
      {localizando && <p className="mt-1 text-xs text-ink-dim">Obtendo localização…</p>}
      {erroGps && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {erroGps}
        </p>
      )}
    </div>
  )
}
