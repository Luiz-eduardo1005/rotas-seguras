import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { AppEstadoProvider, useAppEstado, type CamadasVisiveis } from './features/estado/AppEstado'
import BarraNavegacao from './components/BarraNavegacao'
import AvisoOnboarding, { AvisoRodape } from './components/AvisoOnboarding'
import Legenda from './components/Legenda'
import SeletorPeriodo from './components/SeletorPeriodo'
import Painel from './components/Painel'
import CamadasMapa from './features/mapa/CamadasMapa'
import BotaoLocalizar from './features/mapa/BotaoLocalizar'
import CamadaRotas from './features/rotas/CamadaRotas'
import ListaSalvos from './features/rotas/ListaSalvos'
import PainelRotas from './features/rotas/PainelRotas'
import AbaPerfil, { iniciais } from './features/perfil/AbaPerfil'
import { PerfilProvider, usePerfil } from './features/perfil/PerfilEstado'
import { RotasProvider, useRotas } from './features/rotas/RotasEstado'

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
        <ListaSalvos />
      </Painel>
    )
  if (abaAtiva === 'perfil')
    return (
      <Painel titulo="Perfil" onFechar={fechar}>
        <AbaPerfil />
      </Painel>
    )
  return null
}

const REDUZIR =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const ANIMACOES = REDUZIR ? { zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false } : {}

function Casca() {
  const { abaAtiva, periodo } = useAppEstado()
  const { escolherPontoNoMapa, resultados } = useRotas()
  const { perfil } = usePerfil()
  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer center={MANAUS} zoom={12} zoomControl={false} {...ANIMACOES} className="absolute inset-0 z-0">
        <TileLayer
          key={periodo}
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          updateWhenZooming={false}
          updateWhenIdle
          keepBuffer={4}
          className={periodo === 'dia' ? 'tiles-dia' : 'tiles-noite'}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <CamadasMapa onToqueMapa={escolherPontoNoMapa} atenuar={resultados.length > 0} />
        <CamadaRotas />
        {/* botão fixo no canto superior direito (abaixo do header): nunca colide com o painel de rotas */}
        <div className="pointer-events-none absolute inset-0 [&>div]:pointer-events-auto [&>div]:top-[4.25rem]! [&>div]:bottom-auto! [&>div]:flex-col-reverse!">
          <BotaoLocalizar />
        </div>
      </MapContainer>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-[1000] flex items-center justify-between p-3">
        <h1 className="pointer-events-auto rounded-card border border-line bg-surface px-4 py-2 text-base font-semibold backdrop-blur">
          Rotas <span className="text-route">Seguras</span>
        </h1>
        <div className="pointer-events-auto flex items-center gap-2">
          {perfil && (
            <span
              title={`Olá, ${perfil.apelido}`}
              aria-label={`Olá, ${perfil.apelido}`}
              role="img"
              className="grid size-9 place-items-center rounded-full border border-line bg-surface text-xs font-semibold text-route backdrop-blur"
            >
              {iniciais(perfil.apelido)}
            </span>
          )}
          <SeletorPeriodo />
        </div>
      </header>

      <Legenda compacta={resultados.length > 0} />

      {abaAtiva === 'mapa' && <PainelRotas />}
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
      <PerfilProvider>
        <RotasProvider>
          <Casca />
        </RotasProvider>
      </PerfilProvider>
    </AppEstadoProvider>
  )
}
