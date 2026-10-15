import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface Estado {
  erro: boolean
}

export default class LimiteErro extends Component<Props, Estado> {
  state: Estado = { erro: false }

  static getDerivedStateFromError(): Estado {
    return { erro: true }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('Erro não tratado na interface', erro, info.componentStack)
  }

  render() {
    if (!this.state.erro) return this.props.children
    return (
      <div
        role="alert"
        className="grid min-h-dvh place-items-center bg-night p-6 text-center text-ink"
        style={{ background: '#060b16', color: '#e8eef9' }}
      >
        <div className="max-w-sm">
          <h1 className="text-xl font-semibold">Algo deu errado</h1>
          <p className="mt-2 text-sm opacity-80">
            Ocorreu um erro inesperado. Recarregue o aplicativo para continuar.
          </p>
          <button
            onClick={() => location.reload()}
            className="mt-5 min-h-11 rounded-full px-6 text-sm font-semibold"
            style={{ background: '#22d3ee', color: '#060b16' }}
          >
            Recarregar
          </button>
          <p className="mt-6 text-xs opacity-70">Em emergência, ligue 190 (Polícia Militar).</p>
        </div>
      </div>
    )
  }
}
