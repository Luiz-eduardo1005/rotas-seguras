import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Lightbulb, Users, X, type LucideIcon } from 'lucide-react'
import { cenario } from '../../data'
import { fatoresNoPonto, nivelDaNota, nivelDoTrecho, notaFatores } from '../../domain/pontuacao'
import type { LatLng, TipoAvaliacao, Trecho } from '../../domain/tipos'
import { useAppEstado } from '../estado/AppEstado'
import { COR_NIVEL, ROTULO_NIVEL } from './cores'

export interface AlvoAvaliacao {
  alvoId: string
  titulo: string
  coord: LatLng
  trecho?: Trecho
}

interface Props {
  alvo: AlvoAvaliacao
  onFechar: () => void
}

const OPCOES: { tipo: TipoAvaliacao; rotulo: string; Icone: LucideIcon; cor: string }[] = [
  { tipo: 'luz', rotulo: 'Luz', Icone: Lightbulb, cor: '#f5b544' },
  { tipo: 'fluxo', rotulo: 'Fluxo', Icone: Users, cor: '#22d3ee' },
  { tipo: 'atencao', rotulo: 'Atenção', Icone: AlertTriangle, cor: '#f0504d' },
]
const MAX_COMENTARIO = 140
const MENSAGEM = {
  repetida: 'Você já avaliou este ponto há pouco.',
  armazenamento:
    'Não foi possível salvar neste aparelho (armazenamento cheio ou bloqueado). A avaliação vale só nesta sessão.',
  limite: 'Limite de avaliações deste aparelho atingido.',
} as const

export default function FolhaAvaliacao({ alvo, onFechar }: Props) {
  const { agregado, periodo, adicionarAvaliacao } = useAppEstado()
  const [tipo, setTipo] = useState<TipoAvaliacao | null>(null)
  const [comentario, setComentario] = useState('')
  const [salvo, setSalvo] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const fechar = useRef(onFechar)
  useEffect(() => {
    fechar.current = onFechar
  })
  const refFolha = useRef<HTMLElement>(null)

  useEffect(() => {
    refFolha.current?.focus()
    const aoTecla = (e: KeyboardEvent) => e.key === 'Escape' && fechar.current()
    window.addEventListener('keydown', aoTecla)
    return () => window.removeEventListener('keydown', aoTecla)
  }, [])

  useEffect(() => {
    if (!salvo) return
    const t = setTimeout(() => fechar.current(), 1400)
    return () => clearTimeout(t)
  }, [salvo])

  const nivel = alvo.trecho
    ? nivelDoTrecho(alvo.trecho, agregado, periodo)
    : nivelDaNota(notaFatores(fatoresNoPonto(alvo.coord, cenario, agregado), periodo))
  const votos = agregado.get(alvo.alvoId)

  function enviar() {
    if (!tipo) return
    const r = adicionarAvaliacao({ alvoId: alvo.alvoId, tipo, coord: alvo.coord, comentario: comentario.trim() || undefined })
    if (r.ok) {
      setAviso(null)
    } else {
      setAviso(MENSAGEM[r.motivo])
      if (r.motivo !== 'armazenamento') return
    }
    setSalvo(true)
  }

  return createPortal(
    <section
      ref={refFolha}
      tabIndex={-1}
      role="dialog"
      aria-label={`Avaliar ${alvo.titulo}`}
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[1100] mx-auto max-h-[70vh] max-w-lg overflow-y-auto rounded-card border border-line bg-surface p-4 shadow-lg outline-none backdrop-blur"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{alvo.titulo}</h2>
          <span
            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-night"
            style={{ background: COR_NIVEL[nivel] }}
          >
            {ROTULO_NIVEL[nivel]}
          </span>
        </div>
        <button onClick={onFechar} aria-label="Fechar avaliação" className="grid size-11 shrink-0 place-items-center rounded-full text-ink-dim hover:text-ink">
          <X size={20} />
        </button>
      </div>

      <p className="mb-3 text-xs text-ink-dim">
        Comunidade: {votos?.luz ?? 0} luz · {votos?.fluxo ?? 0} fluxo · {votos?.atencao ?? 0} atenção
      </p>

      {aviso && !salvo && (
        <p role="alert" className="mb-2 text-center text-xs font-medium text-ink-dim">
          {aviso}
        </p>
      )}
      {salvo ? (
        <p role="status" className="py-4 text-center text-sm font-medium text-route">
          {aviso ?? 'Avaliação salva neste aparelho'}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Tipo de avaliação">
            {OPCOES.map(({ tipo: t, rotulo, Icone, cor }) => {
              const ativo = tipo === t
              return (
                <button
                  key={t}
                  role="radio"
                  aria-checked={ativo}
                  aria-label={rotulo}
                  onClick={() => setTipo(t)}
                  className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border text-xs font-semibold"
                  style={{
                    borderColor: ativo ? cor : 'var(--color-line)',
                    color: cor,
                    background: ativo ? `${cor}26` : 'transparent',
                    boxShadow: ativo ? `0 0 12px ${cor}66` : undefined,
                  }}
                >
                  <Icone size={22} />
                  {rotulo}
                </button>
              )
            })}
          </div>
          <label className="mt-3 block text-xs text-ink-dim">
            Comentário (opcional)
            <textarea
              value={comentario}
              maxLength={MAX_COMENTARIO}
              onChange={(e) => setComentario(e.target.value)}
              rows={2}
              className="mt-1 w-full resize-none rounded-xl border border-line bg-night/60 p-2 text-sm text-ink"
            />
            <span className="float-right">{comentario.length}/{MAX_COMENTARIO}</span>
          </label>
          <button
            onClick={enviar}
            disabled={!tipo}
            className="mt-2 min-h-11 w-full rounded-full bg-route text-sm font-semibold text-night shadow-glow disabled:opacity-40 disabled:shadow-none"
          >
            Enviar avaliação
          </button>
        </>
      )}
    </section>,
    document.body,
  )
}
