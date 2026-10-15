import { amostrarPolilinha, distanciaPontoSegmentoM } from '../../domain/geo'
import type { LatLng } from '../../domain/tipos'
import type { RotaBruta } from '../../services/rotasApi'

const LIMITE_M = 40
const FRACAO_IGUAL = 0.8
const MAX_ROTAS = 3

function distAPolilinha(p: LatLng, linha: LatLng[]): number {
  let m = Infinity
  for (let i = 1; i < linha.length; i++) m = Math.min(m, distanciaPontoSegmentoM(p, linha[i - 1], linha[i]))
  return m
}

/** true se ≥80% dos pontos amostrados de `a` estão a ≤40 m de `b`. */
export function rotasSemelhantes(a: LatLng[], b: LatLng[]): boolean {
  const amostra = amostrarPolilinha(a, 50)
  if (!amostra.length || b.length < 2) return false
  const perto = amostra.filter((p) => distAPolilinha(p, b) <= LIMITE_M).length
  return perto / amostra.length >= FRACAO_IGUAL
}

/**
 * Gravadas SEMPRE entram (são a demonstração; uma pode ser subconjunto da outra e
 * mesmo assim é alternativa distinta). Ao vivo só entra se não duplicar nenhuma
 * já presente. Máx. 3, gravadas têm prioridade.
 */
export function mesclarRotas(gravadas: RotaBruta[], vivas: RotaBruta[]): RotaBruta[] {
  const saida: RotaBruta[] = gravadas.slice(0, MAX_ROTAS)
  for (const r of vivas) {
    if (saida.length >= MAX_ROTAS) break
    if (saida.some((s) => rotasSemelhantes(r.coords, s.coords) || rotasSemelhantes(s.coords, r.coords))) continue
    saida.push(r)
  }
  return saida
}
