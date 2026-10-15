import { memo, useState, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import { CircleMarker, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { Bus, Cross, Shield, Store, Trees } from 'lucide-react'
import { pontosApoio } from '../../data/apoio'
import type { TipoApoio } from '../../domain/tipos'
import { rendererCanvas } from './rendererCanvas'

const CFG: Record<TipoApoio, { rotulo: string; cor: string; icone: ReactElement }> = {
  delegacia: { rotulo: 'Delegacia', cor: '#22d3ee', icone: <Shield size={16} /> },
  saude: { rotulo: 'Saúde', cor: '#22d3ee', icone: <Cross size={16} /> },
  terminal: { rotulo: 'Terminal de ônibus', cor: '#22d3ee', icone: <Bus size={16} /> },
  comercio24h: { rotulo: 'Comércio 24h', cor: '#f5b544', icone: <Store size={16} /> },
  praca: { rotulo: 'Praça', cor: '#f5b544', icone: <Trees size={16} /> },
}

function criarIcone(tipo: TipoApoio): L.DivIcon {
  const { cor, icone } = CFG[tipo]
  const svg = renderToStaticMarkup(icone)
  return L.divIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    html: `<div style="width:30px;height:30px;border-radius:50%;background:#0d1526;border:2px solid ${cor};color:${cor};display:grid;place-items:center;box-shadow:0 0 10px ${cor}80">${svg}</div>`,
  })
}

const cacheIcones = new Map<TipoApoio, L.DivIcon>()
function iconeDe(tipo: TipoApoio): L.DivIcon {
  let i = cacheIcones.get(tipo)
  if (!i) cacheIcones.set(tipo, (i = criarIcone(tipo)))
  return i
}

const ZOOM_ICONES = 13

function CamadaApoio() {
  const map = useMap()
  const [detalhado, setDetalhado] = useState(() => map.getZoom() >= ZOOM_ICONES)
  useMapEvents({ zoomend: () => setDetalhado(map.getZoom() >= ZOOM_ICONES) })
  if (!detalhado) {
    return (
      <>
        {pontosApoio.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.coord.lat, p.coord.lng]}
            radius={3}
            renderer={rendererCanvas}
            interactive={false}
            pathOptions={{ color: CFG[p.tipo].cor, fillColor: CFG[p.tipo].cor, fillOpacity: 0.9, weight: 1 }}
          />
        ))}
      </>
    )
  }
  return (
    <>
      {pontosApoio.map((p) => (
        <Marker key={p.id} position={[p.coord.lat, p.coord.lng]} icon={iconeDe(p.tipo)} title={p.nome}>
          <Popup>
            <strong>{p.nome}</strong>
            <br />
            {CFG[p.tipo].rotulo} · {p.bairro}
          </Popup>
        </Marker>
      ))}
    </>
  )
}
export default memo(CamadaApoio)
