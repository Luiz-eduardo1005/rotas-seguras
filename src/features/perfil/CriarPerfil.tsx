import { useState } from 'react'
import { Baby, Briefcase, GraduationCap, MapPinned, User, type LucideIcon } from 'lucide-react'
import { areas } from '../../data/areas'
import {
  ROTULO_DESLOCAMENTO,
  ROTULO_RETORNO,
  apelidoValido,
  soDigitos,
  telefoneValido,
  type Deslocamento,
  type Perfil,
  type Retorno,
} from '../../services/perfilStorage'
import { usePerfil } from './PerfilEstado'

const ICONES: Record<Deslocamento, LucideIcon> = {
  'estudante-noturno': GraduationCap,
  trabalho: Briefcase,
  visitante: MapPinned,
  'acompanho-crianca': Baby,
  outro: User,
}
const BAIRROS = [...areas].sort((a, b) => a.bairro.localeCompare(b.bairro, 'pt-BR'))

interface Props {
  inicial?: Perfil | null
  onFechar: () => void
}

const chip = (ativo: boolean) =>
  `flex min-h-12 items-center gap-2 rounded-card border px-3 text-left text-sm ${
    ativo ? 'border-route bg-route/15 text-ink' : 'border-line bg-surface-solid text-ink-dim'
  }`
const campo = 'min-h-11 w-full rounded-card border border-line bg-surface-solid px-3 text-sm text-ink'

export default function CriarPerfil({ inicial, onFechar }: Props) {
  const { salvar, pularPerfil } = usePerfil()
  const [passo, setPasso] = useState(0)
  const [apelido, setApelido] = useState(inicial?.apelido ?? '')
  const [desloc, setDesloc] = useState<Deslocamento | null>(inicial?.deslocamento ?? null)
  const [retorno, setRetorno] = useState<Retorno | null>(inicial?.retorno ?? null)
  const [bairro, setBairro] = useState(inicial?.bairroCasaId ?? '')
  const [nomeC, setNomeC] = useState(inicial?.contatoConfianca?.nome ?? '')
  const [telC, setTelC] = useState(inicial?.contatoConfianca?.telefone ?? '')
  const [tentou, setTentou] = useState(false)
  const [pronto, setPronto] = useState<Perfil | null>(null)
  const [aviso, setAviso] = useState(false)

  const temContato = nomeC.trim() !== '' || telC !== ''
  const erroContato = temContato && (nomeC.trim() === '' || !telefoneValido(telC))

  const fechar = () => {
    if (!inicial) pularPerfil()
    onFechar()
  }

  function avancar() {
    setTentou(true)
    if (passo === 0 && apelidoValido(apelido)) {
      setTentou(false)
      setPasso(1)
    } else if (passo === 1 && desloc && retorno) {
      setTentou(false)
      setPasso(2)
    } else if (passo === 2 && !erroContato && desloc && retorno) {
      const p: Perfil = {
        apelido: apelido.trim(),
        deslocamento: desloc,
        retorno,
        criadoEm: inicial?.criadoEm ?? new Date().toISOString(),
        ...(bairro ? { bairroCasaId: bairro } : {}),
        ...(temContato ? { contatoConfianca: { nome: nomeC.trim(), telefone: telC } } : {}),
      }
      setAviso(!salvar(p))
      setPronto(p)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Criar perfil"
      className="fixed inset-0 z-[2100] grid place-items-center overflow-y-auto bg-night/85 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm space-y-4 rounded-card border border-line bg-surface p-5">
        {pronto ? (
          <>
            <h2 className="text-xl font-semibold">
              Pronto, <span className="text-route">{pronto.apelido}</span>!
            </h2>
            <p className="text-sm text-ink-dim">
              Ajustamos o mapa para o seu horário. Seus dados ficam só neste aparelho.
            </p>
            {aviso && (
              <p role="alert" className="text-xs text-warn">
                Não foi possível gravar no aparelho; o perfil vale só até fechar o app.
              </p>
            )}
            <button
              onClick={onFechar}
              className="min-h-12 w-full rounded-full bg-route font-semibold text-night shadow-glow"
            >
              Ver o mapa
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-ink-dim">Passo {passo + 1} de 3</p>
            {passo === 0 && (
              <div className="space-y-2">
                <label htmlFor="perfil-apelido" className="block text-lg font-semibold">
                  Como podemos te chamar?
                </label>
                <input
                  id="perfil-apelido"
                  value={apelido}
                  maxLength={24}
                  autoComplete="nickname"
                  onChange={(e) => setApelido(e.target.value)}
                  aria-invalid={tentou && !apelidoValido(apelido)}
                  className={campo}
                />
                {tentou && !apelidoValido(apelido) && (
                  <p role="alert" className="text-xs text-danger">
                    Digite um apelido de 1 a 24 caracteres.
                  </p>
                )}
              </div>
            )}
            {passo === 1 && (
              <div className="space-y-4">
                <fieldset className="space-y-2">
                  <legend className="mb-2 text-lg font-semibold">Como você costuma se deslocar?</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(ICONES) as Deslocamento[]).map((d) => {
                      const Icone = ICONES[d]
                      return (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={desloc === d}
                          onClick={() => setDesloc(d)}
                          className={chip(desloc === d)}
                        >
                          <Icone size={18} aria-hidden /> {ROTULO_DESLOCAMENTO[d]}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
                <fieldset className="space-y-2">
                  <legend className="mb-2 text-sm font-semibold">Que horas costuma voltar?</legend>
                  <div className="grid gap-2">
                    {(Object.keys(ROTULO_RETORNO) as Retorno[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        aria-pressed={retorno === r}
                        onClick={() => setRetorno(r)}
                        className={chip(retorno === r)}
                      >
                        {ROTULO_RETORNO[r]}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {tentou && (!desloc || !retorno) && (
                  <p role="alert" className="text-xs text-danger">
                    Escolha uma opção em cada pergunta.
                  </p>
                )}
              </div>
            )}
            {passo === 2 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Quer completar? (opcional)</h2>
                <label className="block space-y-1 text-sm">
                  Bairro onde mora
                  <select value={bairro} onChange={(e) => setBairro(e.target.value)} className={campo}>
                    <option value="">Prefiro não informar</option>
                    {BAIRROS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.bairro}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1 text-sm">
                  Contato de confiança (nome)
                  <input value={nomeC} maxLength={40} onChange={(e) => setNomeC(e.target.value)} className={campo} />
                </label>
                <label className="block space-y-1 text-sm">
                  Telefone com DDD
                  <input
                    value={telC}
                    inputMode="tel"
                    autoComplete="off"
                    onChange={(e) => setTelC(soDigitos(e.target.value).slice(0, 13))}
                    aria-invalid={tentou && erroContato}
                    className={campo}
                  />
                </label>
                {tentou && erroContato && (
                  <p role="alert" className="text-xs text-danger">
                    Informe nome e telefone com 10 a 13 dígitos, ou deixe os dois em branco.
                  </p>
                )}
                <p className="text-xs text-ink-dim">Fica só neste aparelho. Nada é enviado para a internet.</p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fechar}
                className="min-h-12 flex-1 rounded-full border border-line text-sm text-ink-dim"
              >
                {inicial ? 'Cancelar' : 'Pular por agora'}
              </button>
              <button
                type="button"
                onClick={avancar}
                className="min-h-12 flex-1 rounded-full bg-route font-semibold text-night shadow-glow"
              >
                {passo === 2 ? 'Concluir' : 'Continuar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
