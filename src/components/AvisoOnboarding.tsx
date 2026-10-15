import { useAppEstado } from '../features/estado/AppEstado'

const CARDS = [
  {
    t: 'O que o app faz',
    d: 'Compara rotas a pé em Manaus e mostra qual trecho é mais iluminado e movimentado à noite. A comunidade avalia luz, fluxo e pontos de atenção.',
  },
  { t: 'Como ler as cores', d: 'Verde: mais iluminado/movimentado. Amarelo: atenção. Vermelho: evitar à noite.' },
  {
    t: 'Importante',
    d: 'Não garante segurança e não substitui o 190/emergência. Os dados desta versão são SIMULADOS, para demonstração.',
  },
]

export function AvisoRodape() {
  return (
    <p className="pointer-events-none absolute inset-x-0 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-[900] px-4 text-center text-[11px] text-ink-dim [text-shadow:0_1px_3px_#000]">
      Informação de apoio · não garante segurança · Emergência 190
    </p>
  )
}

export default function AvisoOnboarding() {
  const { onboardingVisto, marcarOnboarding } = useAppEstado()
  if (onboardingVisto) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Boas-vindas"
      className="absolute inset-0 z-[2000] grid place-items-center bg-night/80 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm space-y-3">
        <h2 className="text-xl font-semibold">
          Rotas <span className="text-route">Seguras</span>
        </h2>
        {CARDS.map(({ t, d }) => (
          <div key={t} className="rounded-card border border-line bg-surface p-4">
            <h3 className="mb-1 text-sm font-semibold text-lamp">{t}</h3>
            <p className="text-sm text-ink">{d}</p>
          </div>
        ))}
        <button
          onClick={marcarOnboarding}
          className="min-h-12 w-full rounded-full bg-route font-semibold text-night shadow-glow"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
