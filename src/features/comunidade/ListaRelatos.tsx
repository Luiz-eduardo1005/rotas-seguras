import { useState } from 'react'
import { AlertTriangle, Lightbulb, Trash2, Users, type LucideIcon } from 'lucide-react'
import { AUTOR_LOCAL, podeExcluir, tempoRelativo, type RelatoProximo } from '../../domain/avaliacoes'
import type { TipoAvaliacao } from '../../domain/tipos'
import { useAppEstado } from '../estado/AppEstado'

// eslint-disable-next-line react-refresh/only-export-components
export const ICONE_TIPO: Record<TipoAvaliacao, { Icone: LucideIcon; cor: string; rotulo: string }> = {
  luz: { Icone: Lightbulb, cor: '#f5b544', rotulo: 'Luz' },
  fluxo: { Icone: Users, cor: '#22d3ee', rotulo: 'Fluxo' },
  atencao: { Icone: AlertTriangle, cor: '#f0504d', rotulo: 'Atenção' },
}

interface Props {
  relatos: RelatoProximo[]
  /** Quantidade inicial visível; "ver mais" mostra o resto. */
  limite?: number
}

export default function ListaRelatos({ relatos, limite = 5 }: Props) {
  const { removerAvaliacao } = useAppEstado()
  const [agora] = useState(() => Date.now())
  const [todos, setTodos] = useState(false)
  const [confirmando, setConfirmando] = useState<string | null>(null)

  if (relatos.length === 0) {
    return <p className="py-2 text-sm text-ink-dim">Ninguém relatou este ponto ainda. Seja o primeiro.</p>
  }
  const visiveis = todos ? relatos : relatos.slice(0, limite)

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {visiveis.map(({ avaliacao: av, distanciaM }) => {
          const { Icone, cor, rotulo } = ICONE_TIPO[av.tipo]
          const meu = podeExcluir(av)
          return (
            <li key={av.id} className="flex gap-2.5 rounded-xl border border-line bg-night/40 p-2.5">
              <span
                className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full"
                style={{ background: `${cor}26`, color: cor }}
                role="img"
                aria-label={rotulo}
              >
                <Icone size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-ink-dim">
                  <span className={av.autorId === AUTOR_LOCAL ? 'font-semibold text-route' : 'font-semibold text-ink'}>
                    {av.autorId === AUTOR_LOCAL ? 'Você' : av.autorNome}
                  </span>
                  <span>· {tempoRelativo(av.criadoEm, agora)}</span>
                  {distanciaM > 0 && <span>· a {distanciaM} m</span>}
                  {av.semente && (
                    <span className="rounded-full border border-line px-1.5 text-[10px] uppercase tracking-wide">simulado</span>
                  )}
                </p>
                {av.comentario && <p className="mt-0.5 break-words text-sm text-ink">{av.comentario}</p>}
              </div>
              {meu &&
                (confirmando === av.id ? (
                  <div className="flex shrink-0 items-center gap-1 text-xs" role="group" aria-label="Confirmar exclusão">
                    <span className="text-ink-dim">Excluir?</span>
                    <button
                      onClick={() => {
                        removerAvaliacao(av.id)
                        setConfirmando(null)
                      }}
                      className="min-h-11 min-w-11 rounded-full px-2 font-semibold text-[#f0504d]"
                    >
                      Sim
                    </button>
                    <button onClick={() => setConfirmando(null)} className="min-h-11 min-w-11 rounded-full px-2 font-semibold text-ink-dim">
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmando(av.id)}
                    aria-label="Excluir meu relato"
                    className="grid size-11 shrink-0 place-items-center rounded-full text-ink-dim hover:text-ink"
                  >
                    <Trash2 size={18} />
                  </button>
                ))}
            </li>
          )
        })}
      </ul>
      {relatos.length > limite && (
        <button onClick={() => setTodos((v) => !v)} className="mt-2 min-h-11 w-full rounded-full text-sm font-semibold text-route">
          {todos ? 'Ver menos' : `Ver mais (${relatos.length - limite})`}
        </button>
      )}
    </div>
  )
}
