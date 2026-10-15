const ITENS = [
  { cor: 'bg-safe', texto: 'Mais iluminado/movimentado' },
  { cor: 'bg-warn', texto: 'Atenção' },
  { cor: 'bg-danger', texto: 'Evitar à noite' },
]

/** `compacta`: só as barras de cor (texto vira leitura de tela), libera espaço quando há rotas no mapa. */
export default function Legenda({ compacta = false }: { compacta?: boolean }) {
  return (
    <ul
      aria-label="Legenda do mapa"
      className="pointer-events-auto absolute left-3 top-[4.25rem] z-[1000] space-y-1 rounded-2xl border border-line bg-surface px-3 py-2 text-xs backdrop-blur"
    >
      {ITENS.map(({ cor, texto }) => (
        <li key={texto} className="flex items-center gap-2">
          <span className={`h-1.5 w-4 rounded-full ${cor}`} aria-hidden />
          <span className={compacta ? 'sr-only' : undefined}>{texto}</span>
        </li>
      ))}
    </ul>
  )
}
