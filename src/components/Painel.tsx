import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  titulo: string
  onFechar: () => void
  children: ReactNode
}

/** Painel glass reutilizável, ancorado acima da barra de navegação. */
export default function Painel({ titulo, onFechar, children }: Props) {
  return (
    <section
      role="dialog"
      aria-label={titulo}
      className="absolute inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[1100] max-h-[60%] overflow-y-auto rounded-card border border-line bg-surface p-4 shadow-lg backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{titulo}</h2>
        <button
          onClick={onFechar}
          aria-label="Fechar painel"
          className="grid size-11 place-items-center rounded-full text-ink-dim hover:text-ink"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </section>
  )
}
