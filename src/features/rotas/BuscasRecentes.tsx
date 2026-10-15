import { memo } from 'react'
import { History, X } from 'lucide-react'
import type { EntradaHistorico } from './RotasEstado'

function tempoRelativo(iso: string): string {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (!Number.isFinite(min) || min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h} h`
  const d = Math.floor(h / 24)
  return d === 1 ? 'há 1 dia' : `há ${d} dias`
}

interface Props {
  itens: EntradaHistorico[]
  onRepetir: (e: EntradaHistorico) => void
  onRemover: (id: string) => void
  onLimpar: () => void
}

function BuscasRecentes({ itens, onRepetir, onRemover, onLimpar }: Props) {
  if (!itens.length) return null
  return (
    <section aria-label="Buscas recentes" className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-dim">
          <History size={14} aria-hidden /> Buscas recentes
        </h3>
        <button
          onClick={onLimpar}
          className="min-h-11 px-2 text-xs text-route focus-visible:ring-2 focus-visible:ring-route"
        >
          Limpar
        </button>
      </div>
      <ul className="painel-rolagem flex flex-col">
        {itens.map((e) => (
          <li key={e.id} className="flex items-center border-t border-line first:border-t-0">
            <button
              onClick={() => onRepetir(e)}
              className="flex min-h-11 min-w-0 flex-1 flex-col justify-center py-1 text-left focus-visible:ring-2 focus-visible:ring-route"
            >
              <span className="truncate text-sm text-ink">
                {e.origem.nome} → {e.destino.nome}
              </span>
              <span className="text-xs text-ink-dim">{tempoRelativo(e.quando)}</span>
            </button>
            <button
              onClick={() => onRemover(e.id)}
              aria-label={`Remover ${e.origem.nome} para ${e.destino.nome} do histórico`}
              className="grid size-11 shrink-0 place-items-center text-ink-dim hover:text-ink focus-visible:ring-2 focus-visible:ring-route"
            >
              <X size={16} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default memo(BuscasRecentes)
