import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cenario } from '../../data'
import { contarRelatos, relatosProximos } from '../../domain/avaliacoes'
import { fatoresNoPonto, nivelDaNota, nivelDoTrecho, notaFatores } from '../../domain/pontuacao'
import type { LatLng, TipoAvaliacao, Trecho } from '../../domain/tipos'
import ListaRelatos, { ICONE_TIPO } from '../comunidade/ListaRelatos'
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

const TIPOS: TipoAvaliacao[] = ['luz', 'fluxo', 'atencao']
const MAX_COMENTARIO = 200
const RAIO_RELATOS_M = 300
const MENSAGEM = {
  repetida: 'Você já avaliou este ponto há pouco.',
  armazenamento:
    'Não foi possível salvar neste aparelho (armazenamento cheio ou bloqueado). O relato vale só nesta sessão.',
  limite: 'Limite de avaliações deste aparelho atingido.',
} as const

export default function FolhaAvaliacao({ alvo, onFechar }: Props) {
  const { agregado, periodo, adicionarAvaliacao, todasAvaliacoes } = useAppEstado()
  const [tipo, setTipo] = useState<TipoAvaliacao | null>(null)
  const [comentario, setComentario] = useState('')
  const [aviso, setAviso] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)
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

  const nivel = alvo.trecho
    ? nivelDoTrecho(alvo.trecho, agregado, periodo)
    : nivelDaNota(notaFatores(fatoresNoPonto(alvo.coord, cenario, agregado), periodo))

  const relatos = useMemo(
    () => relatosProximos(alvo.coord, todasAvaliacoes, RAIO_RELATOS_M, alvo.alvoId),
    [alvo.coord, alvo.alvoId, todasAvaliacoes],
  )
  const resumo = useMemo(() => contarRelatos(relatos), [relatos])

  function enviar() {
    if (!tipo) return
    const r = adicionarAvaliacao({ alvoId: alvo.alvoId, tipo, coord: alvo.coord, comentario: comentario.trim() || undefined })
    if (!r.ok && r.motivo !== 'armazenamento') {
      setAviso(MENSAGEM[r.motivo])
      setEnviado(false)
      return
    }
    setAviso(r.ok ? null : MENSAGEM.armazenamento)
    setEnviado(true)
    setTipo(null)
    setComentario('')
  }

  return createPortal(
    <section
      ref={refFolha}
      tabIndex={-1}
      role="dialog"
      aria-label={`Relatos de ${alvo.titulo}`}
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[1100] mx-auto flex max-h-[min(80vh,calc(100dvh-7rem))] max-w-lg flex-col overflow-hidden rounded-card border border-line bg-surface shadow-lg outline-none backdrop-blur"
    >
      <div className="flex items-start justify-between gap-2 p-4 pb-2">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{alvo.titulo}</h2>
          <span
            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-night"
            style={{ background: COR_NIVEL[nivel] }}
          >
            {ROTULO_NIVEL[nivel]}
          </span>
        </div>
        <button onClick={onFechar} aria-label="Fechar relatos" className="grid size-11 shrink-0 place-items-center rounded-full text-ink-dim hover:text-ink">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-2" aria-label="Resumo da comunidade">
          {TIPOS.map((t) => {
            const { Icone, cor, rotulo } = ICONE_TIPO[t]
            const n = resumo[t]
            const pct = resumo.total ? Math.round((n / resumo.total) * 100) : 0
            return (
              <div key={t} className="rounded-xl border border-line bg-night/40 p-2">
                <p className="flex items-center gap-1 text-xs font-semibold" style={{ color: cor }}>
                  <Icone size={14} />
                  {rotulo}
                </p>
                <p className="mt-0.5 text-lg font-semibold leading-none">{n}</p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cor }} />
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-1.5 text-xs text-ink-dim">
          {resumo.total} {resumo.total === 1 ? 'relato' : 'relatos'} em até {RAIO_RELATOS_M} m
        </p>

        <h3 className="mb-1.5 mt-4 text-sm font-semibold">Relatos da comunidade</h3>
        <ListaRelatos relatos={relatos} />

        <h3 className="mb-1.5 mt-4 text-sm font-semibold">Seu relato</h3>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Tipo de relato">
          {TIPOS.map((t) => {
            const { Icone, cor, rotulo } = ICONE_TIPO[t]
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
            rows={3}
            placeholder="Conte o que viu: iluminação, movimento, ponto de ônibus…"
            className="mt-1 w-full resize-none rounded-xl border border-line bg-night/60 p-2 text-sm text-ink placeholder:text-ink-dim"
          />
          <span className="float-right">
            {comentario.length}/{MAX_COMENTARIO}
          </span>
        </label>
        {aviso && (
          <p role="alert" className="mt-1 text-xs font-medium text-ink-dim">
            {aviso}
          </p>
        )}
        {enviado && !aviso && (
          <p role="status" className="mt-1 text-xs font-medium text-route">
            Relato enviado. Obrigado!
          </p>
        )}
        <button
          onClick={enviar}
          disabled={!tipo}
          className="mt-2 min-h-11 w-full rounded-full bg-route text-sm font-semibold text-night shadow-glow disabled:opacity-40 disabled:shadow-none"
        >
          Enviar
        </button>
      </div>
    </section>,
    document.body,
  )
}
