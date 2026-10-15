import { useState } from 'react'
import { createPortal } from 'react-dom'
import { areas } from '../../data/areas'
import { ROTULO_DESLOCAMENTO, ROTULO_RETORNO, type Deslocamento } from '../../services/perfilStorage'
import MinhasAvaliacoes from '../comunidade/MinhasAvaliacoes'
import CriarPerfil from './CriarPerfil'
import { usePerfil } from './PerfilEstado'

const DICAS: Record<Deslocamento, string> = {
  'estudante-noturno': 'Prefira rotas verdes e pontos de ônibus com movimento após as 22h.',
  trabalho: 'Compare a rota de ida e a de volta: o trecho mais iluminado de manhã pode mudar à noite.',
  visitante: 'Evite atalhos desconhecidos à noite e prefira avenidas movimentadas.',
  'acompanho-crianca': 'Escolha trajetos curtos, com calçada iluminada e pontos de apoio por perto.',
  outro: 'Use o seletor de período para comparar o mesmo trajeto de dia e à noite.',
}

// eslint-disable-next-line react-refresh/only-export-components
export const iniciais = (nome: string) =>
  nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('')

export default function AbaPerfil() {
  const { perfil, apagarDados } = usePerfil()
  const [editando, setEditando] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const bairro = perfil?.bairroCasaId ? areas.find((a) => a.id === perfil.bairroCasaId)?.bairro : undefined

  return (
    <div className="text-sm">
      {perfil ? (
        <div className="mb-4 rounded-card border border-line bg-surface-solid p-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-12 shrink-0 place-items-center rounded-full bg-route/20 font-semibold text-route"
            >
              {iniciais(perfil.apelido)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold">{perfil.apelido}</p>
              <p className="text-xs text-ink-dim">
                {ROTULO_DESLOCAMENTO[perfil.deslocamento]} · volta {ROTULO_RETORNO[perfil.retorno].toLowerCase()}
              </p>
              {bairro && <p className="text-xs text-ink-dim">Mora em {bairro}</p>}
            </div>
            <button
              onClick={() => setEditando(true)}
              className="min-h-11 rounded-full border border-line px-4 text-sm"
            >
              Editar
            </button>
          </div>
          <p className="mt-3 text-sm text-lamp">{DICAS[perfil.deslocamento]}</p>
        </div>
      ) : (
        <div className="mb-4 rounded-card border border-line bg-surface-solid p-3">
          <p className="mb-2">Crie um perfil rápido para receber dicas pensadas para o seu trajeto.</p>
          <button
            onClick={() => setEditando(true)}
            className="min-h-11 w-full rounded-full bg-route font-semibold text-night shadow-glow"
          >
            Criar meu perfil
          </button>
        </div>
      )}

      <h3 className="mb-1 font-semibold text-lamp">Minhas avaliações</h3>
      <div className="mb-4">
        <MinhasAvaliacoes />
      </div>

      <h3 className="mb-1 font-semibold text-lamp">Como funciona</h3>
      <p className="mb-3">
        Você escolhe origem e destino, o app compara rotas a pé e pontua cada trecho por luz, fluxo de pessoas e risco,
        combinando dados de base com avaliações da comunidade.
      </p>
      <h3 className="mb-1 font-semibold text-lamp">Fontes reais</h3>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>SSP-AM / CIESP: bairros com maior incidência (2017-2023).</li>
        <li>OpenStreetMap: tags lit e street_lamp (cobertura baixa).</li>
        <li>Manaus+Luz / Ageman: iluminação pública, 0800-201-0001.</li>
        <li>Rotas a pé: OSRM (routing.openstreetmap.de).</li>
      </ul>
      <p className="mb-4 text-xs text-ink-dim">
        Não garante segurança e não substitui o 190. Dados desta versão são simulados para demonstração.
      </p>

      <h3 className="mb-1 font-semibold text-lamp">Privacidade</h3>
      <p className="mb-2">Seus dados ficam só neste aparelho.</p>
      <button
        onClick={() => setConfirmando(true)}
        className="min-h-11 rounded-full border border-danger px-4 text-danger"
      >
        Apagar meus dados
      </button>

      {editando &&
        createPortal(<CriarPerfil inicial={perfil} onFechar={() => setEditando(false)} />, document.body)}
      {confirmando &&
        createPortal(
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="apagar-titulo"
          aria-describedby="apagar-desc"
          className="fixed inset-0 z-[2100] grid place-items-center bg-night/85 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm space-y-3 rounded-card border border-line bg-surface p-5">
            <h2 id="apagar-titulo" className="text-lg font-semibold">
              Apagar todos os dados?
            </h2>
            <p id="apagar-desc" className="text-sm text-ink-dim">
              Perfil, avaliações, rotas salvas e preferências deste aparelho serão removidos. Não dá para desfazer.
            </p>
            <div className="flex gap-2">
              <button
                autoFocus
                onClick={() => setConfirmando(false)}
                className="min-h-12 flex-1 rounded-full border border-line"
              >
                Cancelar
              </button>
              <button onClick={apagarDados} className="min-h-12 flex-1 rounded-full bg-danger font-semibold text-night">
                Apagar
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
