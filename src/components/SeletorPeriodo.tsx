import { Moon, Sun } from 'lucide-react'
import { useAppEstado } from '../features/estado/AppEstado'
import type { Periodo } from '../domain/tipos'

const OPCOES: { id: Periodo; label: string; Icon: typeof Sun }[] = [
  { id: 'dia', label: 'Dia', Icon: Sun },
  { id: 'noite', label: 'Noite', Icon: Moon },
]

export default function SeletorPeriodo() {
  const { periodo, setPeriodo } = useAppEstado()
  return (
    <div
      role="group"
      aria-label="Período"
      className="pointer-events-auto flex rounded-full border border-line bg-surface p-0.5 backdrop-blur"
    >
      {OPCOES.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setPeriodo(id)}
          aria-pressed={periodo === id}
          className={`flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm ${
            periodo === id ? 'bg-route/15 text-route' : 'text-ink-dim'
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  )
}
