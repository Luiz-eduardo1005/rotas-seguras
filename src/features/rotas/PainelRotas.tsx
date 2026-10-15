import { useState } from 'react'
import {
  ArrowUpDown,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Footprints,
  Search,
  Share2,
  ShieldCheck,
  Trash2,
  WifiOff,
  X,
} from 'lucide-react'
import type { Nivel } from '../../domain/tipos'
import { rotasModelo } from '../../data'
import { useAppEstado } from '../estado/AppEstado'
import { compartilharRota } from './compartilhar'
import CampoLugar from './CampoLugar'
import { useRotas, type RotaAvaliada } from './RotasEstado'

const COR_TEXTO: Record<Nivel, string> = { verde: 'text-safe', amarelo: 'text-warn', vermelho: 'text-danger' }
const COR_BARRA: Record<Nivel, string> = { verde: 'bg-safe', amarelo: 'bg-warn', vermelho: 'bg-danger' }

const nivelFator = (v: number): Nivel => (v >= 0.6 ? 'verde' : v >= 0.4 ? 'amarelo' : 'vermelho')

function Barra({ rotulo, valor, nivel }: { rotulo: string; valor: number; nivel: Nivel }) {
  const pct = Math.round(Math.max(0, Math.min(1, valor)) * 100)
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 shrink-0 text-ink-dim">{rotulo}</span>
      <div
        role="progressbar"
        aria-label={rotulo}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-2 flex-1 overflow-hidden rounded-full bg-line"
      >
        <div className={`h-full rounded-full ${COR_BARRA[nivel]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function porque(r: RotaAvaliada): string {
  const { luz, fluxo, risco } = r.fatoresMedios
  const partes: string[] = []
  if (luz >= 0.6) partes.push('iluminada')
  if (fluxo >= 0.6) partes.push('com movimento')
  if (risco <= 0.4) partes.push('com poucos relatos de risco')
  const n = r.pontosApoioProximos.length
  const apoio = n ? `${n} ponto${n > 1 ? 's' : ''} de apoio no caminho` : 'nenhum ponto de apoio perto'
  if (!partes.length) {
    return r.nota < 40 ? `Trechos escuros ou isolados; ${apoio}. Redobre a atenção.` : `Condições medianas; ${apoio}.`
  }
  const lista = partes.length > 1 ? `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]}` : partes[0]
  return `Mais ${lista}; ${apoio}.`.replace('Mais com', 'Com').replace('Mais iluminada e com', 'Iluminada, com')
}

function Cartao({ r, indice, ativo, onSelecionar }: { r: RotaAvaliada; indice: number; ativo: boolean; onSelecionar: () => void }) {
  const min = Math.max(1, Math.round(r.duracaoS / 60))
  const km = (r.distanciaM / 1000).toFixed(1).replace('.', ',')
  return (
    <li>
      <button
        onClick={onSelecionar}
        aria-pressed={ativo}
        className={`w-full rounded-xl border p-3 text-left focus-visible:ring-2 focus-visible:ring-route ${
          ativo ? 'border-route bg-route/10 shadow-glow' : 'border-line bg-surface-solid'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-center">
            <div className={`text-3xl font-bold leading-none ${COR_TEXTO[r.nivel]}`}>{r.nota}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wide text-ink-dim">de 100</div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {indice === 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-route/15 px-2 py-0.5 text-xs font-semibold text-route">
                  <ShieldCheck size={14} aria-hidden /> Mais segura
                </span>
              ) : (
                <span className="text-xs text-ink-dim">Alternativa {indice}</span>
              )}
              <span className="inline-flex items-center gap-1 text-sm text-ink">
                <Footprints size={14} aria-hidden /> {min} min · {km} km
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-dim">{porque(r)}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <Barra rotulo="Luz" valor={r.fatoresMedios.luz} nivel={nivelFator(r.fatoresMedios.luz)} />
          <Barra rotulo="Fluxo" valor={r.fatoresMedios.fluxo} nivel={nivelFator(r.fatoresMedios.fluxo)} />
          <Barra rotulo="Atenção" valor={r.fatoresMedios.risco} nivel={nivelFator(1 - r.fatoresMedios.risco)} />
        </div>
      </button>
    </li>
  )
}

const MSG_FEEDBACK = { compartilhado: 'Compartilhado', copiado: 'Link copiado', erro: 'Não foi possível compartilhar' }

export default function PainelRotas() {
  const r = useRotas()
  const { periodo } = useAppEstado()
  const [aberto, setAberto] = useState(true)
  const [feedback, setFeedback] = useState('')

  const sel = r.resultados[r.selecionadaIdx]
  const caixa =
    'absolute inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[1100] rounded-card border border-line bg-surface shadow-lg backdrop-blur'

  if (r.modoEscolha) {
    return (
      <section className={`${caixa} flex items-center gap-3 p-3`} role="status">
        <p className="min-w-0 flex-1 text-sm text-ink">
          Toque no mapa para definir {r.modoEscolha === 'origem' ? 'a origem' : 'o destino'}
        </p>
        <button
          onClick={() => r.setModoEscolha(null)}
          className="inline-flex min-h-11 items-center gap-1 rounded-full border border-line px-4 text-sm text-ink focus-visible:ring-2 focus-visible:ring-route"
        >
          <X size={16} aria-hidden /> Cancelar
        </button>
      </section>
    )
  }

  const avisar = (m: string) => {
    setFeedback(m)
    window.setTimeout(() => setFeedback(''), 3000)
  }

  const compartilhar = async () => {
    if (!r.origem || !r.destino) return
    avisar(MSG_FEEDBACK[await compartilharRota(r.origem, r.destino, periodo)])
  }

  const salvar = () => avisar(r.salvarRotaAtual() ? 'Rota salva' : 'Defina origem e destino')

  const botao =
    'inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface-solid px-2 text-sm text-ink hover:border-route focus-visible:ring-2 focus-visible:ring-route'

  return (
    <section aria-label="Planejar rota" className={`${caixa} flex max-h-[62%] flex-col overflow-hidden`}>
      <button
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-label={aberto ? 'Recolher painel de rotas' : 'Expandir painel de rotas'}
        className="flex min-h-11 w-full shrink-0 items-center gap-3 px-4 text-left focus-visible:ring-2 focus-visible:ring-route"
      >
        <span className="mx-auto absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-ink-dim/50" aria-hidden />
        {!aberto && sel ? (
          <span className="mt-2 flex min-w-0 flex-1 items-center gap-3 text-sm">
            <span className={`text-xl font-bold ${COR_TEXTO[sel.nivel]}`}>{sel.nota}</span>
            <span className="min-w-0 flex-1 truncate text-ink">
              {Math.max(1, Math.round(sel.duracaoS / 60))} min · {(sel.distanciaM / 1000).toFixed(1).replace('.', ',')} km
              {r.destino ? ` até ${r.destino.nome}` : ''}
            </span>
          </span>
        ) : (
          <span className="mt-2 flex-1 text-sm font-semibold text-ink">Para onde você vai?</span>
        )}
        {aberto ? <ChevronDown size={20} className="mt-2" aria-hidden /> : <ChevronUp size={20} className="mt-2" aria-hidden />}
      </button>

      {aberto && (
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">
          <div className="flex items-end gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <CampoLugar qual="origem" rotulo="Origem" valor={r.origem} onEscolher={r.setOrigem} />
              <CampoLugar qual="destino" rotulo="Destino" valor={r.destino} onEscolher={r.setDestino} />
            </div>
            <button
              onClick={r.inverter}
              aria-label="Inverter origem e destino"
              className="mb-1 grid size-11 shrink-0 place-items-center rounded-full border border-line text-route focus-visible:ring-2 focus-visible:ring-route"
            >
              <ArrowUpDown size={18} />
            </button>
          </div>

          {!r.resultados.length && !r.carregando && (
            <div className="flex flex-wrap gap-2" aria-label="Trajetos de exemplo">
              {rotasModelo.map((m) => (
                <button
                  key={m.id}
                  onClick={() => r.usarRotaModelo(m.id)}
                  title={m.descricao}
                  className="min-h-11 rounded-full border border-line bg-surface-solid px-3 text-xs text-ink hover:border-route focus-visible:ring-2 focus-visible:ring-route"
                >
                  {m.titulo}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => void r.buscar()}
            disabled={r.carregando}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-route px-4 text-sm font-semibold text-night shadow-glow disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-white"
          >
            <Search size={18} aria-hidden /> Buscar rota segura
          </button>

          {r.carregando && (
            <div role="status" aria-label="Buscando rotas" className="flex flex-col gap-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-28 rounded-xl bg-line/60 motion-safe:animate-pulse" />
              ))}
            </div>
          )}

          {r.erro && !r.carregando && (
            <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-ink">
              {r.erro}
            </p>
          )}

          {!r.carregando && r.resultados.length > 0 && (
            <>
              {r.origemDados === 'offline' && (
                <p className="inline-flex items-center gap-2 text-xs text-warn">
                  <WifiOff size={14} aria-hidden /> offline: rota pré-gravada
                </p>
              )}
              <ul className="flex flex-col gap-2">
                {r.resultados.map((res, i) => (
                  <Cartao key={i} r={res} indice={i} ativo={i === r.selecionadaIdx} onSelecionar={() => r.selecionar(i)} />
                ))}
              </ul>
              <div className="flex gap-2">
                <button onClick={() => void compartilhar()} className={botao}>
                  <Share2 size={16} aria-hidden /> Compartilhar
                </button>
                <button onClick={salvar} className={botao}>
                  <Bookmark size={16} aria-hidden /> Salvar
                </button>
                <button onClick={r.limpar} className={botao}>
                  <Trash2 size={16} aria-hidden /> Limpar
                </button>
              </div>
            </>
          )}
          <p role="status" aria-live="polite" className="min-h-4 text-center text-xs text-route">
            {feedback}
          </p>
        </div>
      )}
    </section>
  )
}
