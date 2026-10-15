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
  const { abaAtiva, periodo } = useAppEstado()
  const { escolherPontoNoMapa, resultados } = useRotas()
  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer center={MANAUS} zoom={12} zoomControl={false} className="absolute inset-0 z-0">
        <TileLayer
          key={periodo}
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          className={periodo === 'dia' ? 'tiles-dia' : 'tiles-noite'}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <CamadasMapa onToqueMapa={escolherPontoNoMapa} />
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
        <SeletorPeriodo />
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
      <RotasProvider>
        <Casca />
      </RotasProvider>
    </AppEstadoProvider>
  )
}
