import { Bookmark, Layers, MapPin, User } from 'lucide-react'
import { useAppEstado, type Aba } from '../features/estado/AppEstado'

const ABAS: { id: Aba; label: string; Icon: typeof MapPin }[] = [
  { id: 'mapa', label: 'Mapa', Icon: MapPin },
  { id: 'camadas', label: 'Camadas', Icon: Layers },
  { id: 'salvos', label: 'Salvos', Icon: Bookmark },
  { id: 'perfil', label: 'Perfil', Icon: User },
]

export default function BarraNavegacao() {
  const { abaAtiva, setAbaAtiva } = useAppEstado()
  return (
    <nav
      aria-label="Navegação principal"
      className="absolute inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[1200] flex justify-around rounded-card border border-line bg-surface p-1 backdrop-blur"
    >
      {ABAS.map(({ id, label, Icon }) => {
        const ativa = abaAtiva === id
        return (
          <button
            key={id}
            onClick={() => setAbaAtiva(id)}
            aria-current={ativa ? 'page' : undefined}
            className={`flex min-h-12 min-w-16 flex-col items-center justify-center gap-0.5 rounded-xl px-3 text-xs ${
              ativa ? 'text-route' : 'text-ink-dim'
            }`}
          >
            <Icon size={22} className={ativa ? 'drop-shadow-[0_0_6px_#22d3ee]' : ''} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
