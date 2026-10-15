import { memo, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { Bus, Cross, Shield, Store, Trees } from 'lucide-react'
import { pontosApoio } from '../../data/apoio'
import type { TipoApoio } from '../../domain/tipos'

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

function CamadaApoio() {
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
