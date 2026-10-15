import { memo, useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import { Marker, Tooltip } from 'react-leaflet'
import { AlertTriangle, Lightbulb, Users } from 'lucide-react'
import type { LatLng, TipoAvaliacao } from '../../domain/tipos'
import { useAppEstado } from '../estado/AppEstado'

const CFG = {
  luz: { cor: '#f5b544', icone: <Lightbulb size={14} /> },
  fluxo: { cor: '#22d3ee', icone: <Users size={14} /> },
  atencao: { cor: '#f0504d', icone: <AlertTriangle size={14} /> },
}

interface Grupo {
  alvoId: string
  coord: LatLng
  total: number
  tipo: TipoAvaliacao
}

const cacheIcones = new Map<string, L.DivIcon>()

function criarIcone(tipo: TipoAvaliacao, total: number): L.DivIcon {
  const chave = `${tipo}:${total}`
  const existente = cacheIcones.get(chave)
  if (existente) return existente
  const { cor, icone } = CFG[tipo]
  const svg = renderToStaticMarkup(icone)
  const icone_ = L.divIcon({
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    html: `<div style="position:relative;width:26px;height:26px;border-radius:50%;background:#0d1526;border:2px solid ${cor};color:${cor};display:grid;place-items:center;box-shadow:0 0 8px ${cor}80">${svg}<span style="position:absolute;top:-7px;right:-7px;min-width:16px;height:16px;padding:0 3px;border-radius:8px;background:${cor};color:#060b16;font:700 10px/16px system-ui;text-align:center">${total}</span></div>`,
  })
  cacheIcones.set(chave, icone_)
  return icone_
}

/** Dentro do MapContainer: 1 pin por alvo de célula (`cel:`) com avaliações da comunidade. */
interface Props {
  onSelecionar?: (alvoId: string, coord: LatLng) => void
}

function CamadaAvaliacoes({ onSelecionar }: Props) {
  const { avaliacoes } = useAppEstado()
  const grupos = useMemo(() => {
    const m = new Map<string, Grupo & { cont: Record<TipoAvaliacao, number> }>()
    for (const a of avaliacoes) {
      if (!a.alvoId.startsWith('cel:')) continue
      const g = m.get(a.alvoId) ?? {
        alvoId: a.alvoId,
        coord: a.coord,
        total: 0,
        tipo: a.tipo,
        cont: { luz: 0, fluxo: 0, atencao: 0 },
      }
      g.total++
      g.cont[a.tipo]++
      m.set(a.alvoId, g)
    }
    return [...m.values()].map((g): Grupo => {
      const tipo = (Object.keys(g.cont) as TipoAvaliacao[]).reduce((x, y) => (g.cont[y] > g.cont[x] ? y : x))
      return { alvoId: g.alvoId, coord: g.coord, total: g.total, tipo }
    })
  }, [avaliacoes])

  return (
    <>
      {grupos.map((g) => (
        <Marker key={`${g.alvoId}-${g.tipo}-${g.total}`} position={[g.coord.lat, g.coord.lng]} icon={criarIcone(g.tipo, g.total)}
          bubblingMouseEvents={false}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e)
              onSelecionar?.(g.alvoId, g.coord)
            },
          }}
        >
          <Tooltip direction="top" offset={[0, -14]}>
            {g.total} {g.total === 1 ? 'avaliação' : 'avaliações'} da comunidade
          </Tooltip>
        </Marker>
      ))}
    </>
  )
}

export default memo(CamadaAvaliacoes)
