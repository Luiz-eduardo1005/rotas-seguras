import type { Nivel } from '../../domain/tipos'

export const COR_NIVEL: Record<Nivel, string> = {
  verde: '#22c55e',
  amarelo: '#eab308',
  vermelho: '#f0504d',
}
export const ROTULO_NIVEL: Record<Nivel, string> = {
  verde: 'Mais segura',
  amarelo: 'Atenção',
  vermelho: 'Evitar',
}
