import type { LatLng } from '../domain/tipos'

export interface RotaBruta {
  coords: LatLng[]
  distanciaM: number
  duracaoS: number
}

export type MotivoErroRotas = 'timeout' | 'rede' | 'http' | 'sem-rota' | 'cancelado'

export class ErroRotasApi extends Error {
  readonly motivo: MotivoErroRotas
  constructor(motivo: MotivoErroRotas, mensagem: string) {
    super(mensagem)
    this.name = 'ErroRotasApi'
    this.motivo = motivo
  }
}

const BASE = 'https://routing.openstreetmap.de/routed-foot/route/v1/foot'
export const TIMEOUT_MS = 8000

interface RespostaOsrm {
  code?: string
  routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[]
}

export async function buscarRotasAPe(origem: LatLng, destino: LatLng, signal?: AbortSignal): Promise<RotaBruta[]> {
  const url =
    `${BASE}/${origem.lng},${origem.lat};${destino.lng},${destino.lat}` +
    `?alternatives=3&overview=full&geometries=geojson`
  const ctrl = new AbortController()
  let estourou = false
  const timer = setTimeout(() => {
    estourou = true
    ctrl.abort()
  }, TIMEOUT_MS)
  const aoCancelar = () => ctrl.abort()
  if (signal?.aborted) ctrl.abort()
  signal?.addEventListener('abort', aoCancelar)

  try {
    const resp = await fetch(url, { signal: ctrl.signal })
    if (!resp.ok) throw new ErroRotasApi('http', `Serviço de rotas respondeu ${resp.status}`)
    const json = (await resp.json()) as RespostaOsrm
    if (json.code !== 'Ok' || !json.routes?.length) throw new ErroRotasApi('sem-rota', 'Nenhuma rota a pé encontrada')
    return json.routes.map((r) => ({
      coords: r.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
      distanciaM: r.distance,
      duracaoS: r.duration,
    }))
  } catch (e) {
    if (e instanceof ErroRotasApi) throw e
    if (estourou) throw new ErroRotasApi('timeout', 'Serviço de rotas demorou demais')
    if (signal?.aborted) throw new ErroRotasApi('cancelado', 'Busca cancelada')
    throw new ErroRotasApi('rede', 'Falha de rede ao buscar rotas')
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', aoCancelar)
  }
}
