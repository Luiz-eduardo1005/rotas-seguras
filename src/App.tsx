import { MapContainer, TileLayer } from 'react-leaflet'
import { LocateFixed } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { AppEstadoProvider, useAppEstado, type CamadasVisiveis } from './features/estado/AppEstado'
import BarraNavegacao from './components/BarraNavegacao'
import AvisoOnboarding, { AvisoRodape } from './components/AvisoOnboarding'
import Legenda from './components/Legenda'
import SeletorPeriodo from './components/SeletorPeriodo'
import Painel from './components/Painel'

const MANAUS: [number, number] = [-3.1019, -60.025]

const CAMADAS: { id: keyof CamadasVisiveis; label: string }[] = [
  { id: 'trechos', label: 'Trechos avaliados' },
  { id: 'areas', label: 'Áreas por bairro' },
  { id: 'apoio', label: 'Pontos de apoio' },
]

function PainelAba() {
  const { abaAtiva, setAbaAtiva, camadasVisiveis, alternarCamada } = useAppEstado()
  const fechar = () => setAbaAtiva('mapa')
  if (abaAtiva === 'camadas')
    return (
      <Painel titulo="Camadas" onFechar={fechar}>
        <ul className="space-y-1">
          {CAMADAS.map(({ id, label }) => (
            <li key={id}>
              <label className="flex min-h-11 items-center justify-between">
                {label}
                <input
                  type="checkbox"
                  checked={camadasVisiveis[id]}
                  onChange={() => alternarCamada(id)}
                  className="size-5 accent-route"
                />
              </label>
            </li>
          ))}
        </ul>
      </Painel>
    )
  if (abaAtiva === 'salvos')
    return (
      <Painel titulo="Salvos" onFechar={fechar}>
        <p className="text-sm text-ink-dim">Rotas salvas aparecem aqui.</p>
      </Painel>
    )
  if (abaAtiva === 'perfil')
    return (
      <Painel titulo="Perfil" onFechar={fechar}>
        <h3 className="mb-1 text-sm font-semibold text-lamp">Como funciona</h3>
        <p className="mb-3 text-sm">
          Você escolhe origem e destino, o app compara rotas a pé e pontua cada trecho por luz, fluxo de pessoas e
          risco, combinando dados de base com avaliações da comunidade.
        </p>
        <h3 className="mb-1 text-sm font-semibold text-lamp">Fontes reais</h3>
        <ul className="mb-3 list-disc space-y-1 pl-5 text-sm">
          <li>SSP-AM / CIESP: bairros com maior incidência (2017-2023).</li>
          <li>OpenStreetMap: tags lit e street_lamp (cobertura baixa).</li>
          <li>Manaus+Luz / Ageman: iluminação pública, 0800-201-0001.</li>
          <li>Rotas a pé: OSRM (routing.openstreetmap.de).</li>
        </ul>
        <p className="text-xs text-ink-dim">
          Não garante segurança e não substitui o 190. Dados desta versão são simulados para demonstração.
        </p>
      </Painel>
    )
  return null
}

function Casca() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer center={MANAUS} zoom={12} zoomControl={false} className="absolute inset-0 z-0">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {/* camadas do mapa e painel de rotas: T4/T5 */}
      </MapContainer>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-[1000] flex items-center justify-between p-3">
        <h1 className="pointer-events-auto rounded-card border border-line bg-surface px-4 py-2 text-base font-semibold backdrop-blur">
          Rotas <span className="text-route">Seguras</span>
        </h1>
        <SeletorPeriodo />
      </header>

      <Legenda />

      <button
        aria-label="Minha localização"
        className="absolute bottom-[calc(7.5rem+env(safe-area-inset-bottom))] right-4 z-[1000] grid size-12 place-items-center rounded-full border border-line bg-surface-solid text-route shadow-glow"
      >
        <LocateFixed size={22} />
      </button>

      {/* camadas do mapa e painel de rotas: T4/T5 (painel de rotas entra aqui, acima da barra) */}
      <PainelAba />
      <AvisoRodape />
      <BarraNavegacao />
      <AvisoOnboarding />
    </div>
  )
}

export default function App() {
  return (
    <AppEstadoProvider>
      <Casca />
    </AppEstadoProvider>
  )
}
