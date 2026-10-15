import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { cenario } from '../../data'
import { tempoRelativo } from '../../domain/avaliacoes'
import { useAppEstado } from '../estado/AppEstado'
import { ICONE_TIPO } from './ListaRelatos'

function nomeDoAlvo(alvoId: string): string {
  const t = cenario.trechos.find((x) => x.id === alvoId)
  return t ? `${t.nome} · ${t.bairro}` : 'Ponto no mapa'
}

export default function MinhasAvaliacoes() {
  const { avaliacoes, removerAvaliacao, removerTodasMinhas } = useAppEstado()
  const [agora] = useState(() => Date.now())
  const [confirmandoTodas, setConfirmandoTodas] = useState(false)
  const lista = [...avaliacoes].sort((a, b) => Date.parse(b.criadoEm) - Date.parse(a.criadoEm))

  if (lista.length === 0) {
    return (
      <p className="rounded-card border border-line bg-surface p-4 text-sm text-ink-dim">
        Você ainda não avaliou nenhum ponto. Toque em um trecho ou lugar do mapa para relatar luz, fluxo ou atenção.
      </p>
    )
  }

  return (
    <section aria-label="Minhas avaliações" className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {lista.map((av) => {
          const { Icone, cor, rotulo } = ICONE_TIPO[av.tipo]
          return (
            <li key={av.id} className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-2.5">
              <span
                className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full"
                style={{ background: `${cor}26`, color: cor }}
                role="img"
                aria-label={rotulo}
              >
                <Icone size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{nomeDoAlvo(av.alvoId)}</p>
                <p className="text-xs text-ink-dim">
                  {rotulo} · {tempoRelativo(av.criadoEm, agora)}
                </p>
                {av.comentario && <p className="mt-0.5 break-words text-sm">{av.comentario}</p>}
              </div>
              <button
                onClick={() => removerAvaliacao(av.id)}
                aria-label="Excluir minha avaliação"
                className="grid size-11 shrink-0 place-items-center rounded-full text-ink-dim hover:text-ink"
              >
                <Trash2 size={18} />
              </button>
            </li>
          )
        })}
      </ul>
      {confirmandoTodas ? (
        <div role="group" aria-label="Confirmar apagar tudo" className="flex items-center gap-2 text-sm">
          <span className="flex-1 text-ink-dim">Apagar todas as suas avaliações?</span>
          <button
            onClick={() => {
              removerTodasMinhas()
              setConfirmandoTodas(false)
            }}
            className="min-h-11 rounded-full px-4 font-semibold text-[#f0504d]"
          >
            Sim
          </button>
          <button onClick={() => setConfirmandoTodas(false)} className="min-h-11 rounded-full px-4 font-semibold text-ink-dim">
            Não
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmandoTodas(true)}
          className="min-h-11 rounded-full border border-line text-sm font-semibold text-[#f0504d]"
        >
          Apagar todas as minhas avaliações
        </button>
      )}
    </section>
  )
}
