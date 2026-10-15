import { MapContainer, TileLayer } from 'react-leaflet'
import { Layers, LocateFixed, Map as MapIcon, Bookmark, User } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

const MANAUS: [number, number] = [-3.1019, -60.025]

const NAV = [
  { label: 'Mapa', Icon: MapIcon },
  { label: 'Camadas', Icon: Layers },
  { label: 'Salvos', Icon: Bookmark },
  { label: 'Perfil', Icon: User },
]

export default function App() {
  return (
    <div className="relative h-full w-full">
      <MapContainer center={MANAUS} zoom={12} zoomControl={false} className="absolute inset-0 z-0">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
      </MapContainer>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-3">
        <h1 className="pointer-events-auto inline-block rounded-card border border-line bg-surface px-4 py-2 text-base font-semibold backdrop-blur">
          Rotas <span className="text-route">Seguras</span>
        </h1>
      </header>

      <button
        aria-label="Minha localização"
        className="absolute bottom-24 right-4 z-[1000] grid size-12 place-items-center rounded-full border border-line bg-surface-solid text-route shadow-glow"
      >
        <LocateFixed size={22} />
      </button>

      <nav className="absolute inset-x-3 bottom-3 z-[1000] flex justify-around rounded-card border border-line bg-surface p-2 backdrop-blur">
        {NAV.map(({ label, Icon }, i) => (
          <button key={label} className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs ${i === 0 ? 'text-route' : 'text-ink-dim'}`}>
            <Icon size={22} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
