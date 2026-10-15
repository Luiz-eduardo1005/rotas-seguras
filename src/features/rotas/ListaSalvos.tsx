import { Footprints, Trash2 } from 'lucide-react'
import { useAppEstado } from '../estado/AppEstado'
import { useRotas } from './RotasEstado'

/** Conteúdo da aba Salvos. */
export default function ListaSalvos() {
  const { rotasSalvas, abrirSalva, removerSalva } = useRotas()
  const { setAbaAtiva } = useAppEstado()

  if (!rotasSalvas.length) {
    return <p className="text-sm text-ink-dim">Nenhuma rota salva ainda. Busque uma rota e toque em Salvar.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {rotasSalvas.map((r) => (
        <li key={r.id} className="flex items-center gap-1 rounded-xl border border-line bg-surface-solid">
          <button
            onClick={() => {
              abrirSalva(r.id)
              setAbaAtiva('mapa')
            }}
            className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-route/10 focus-visible:ring-2 focus-visible:ring-route"
          >
            <Footprints size={20} className="shrink-0 text-route" aria-hidden />
            <span className="min-w-0 text-sm">
              <span className="block truncate font-medium text-ink">{r.origem.nome}</span>
              <span className="block truncate text-xs text-ink-dim">até {r.destino.nome}</span>
            </span>
          </button>
          <button
            onClick={() => removerSalva(r.id)}
            aria-label={`Remover rota ${r.nome}`}
            className="grid size-11 shrink-0 place-items-center rounded-full text-ink-dim hover:text-danger focus-visible:ring-2 focus-visible:ring-route"
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  )
}
