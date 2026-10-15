import { useCallback, useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import { cenario } from '../../data'
import { alvoIdParaCoord } from '../../domain/avaliacoes'
import { areaDoPonto, distanciaPontoSegmentoM } from '../../domain/geo'
import type { LatLng, Trecho } from '../../domain/tipos'
import { useAppEstado } from '../estado/AppEstado'
import CamadaAvaliacoes from './CamadaAvaliacoes'
import CamadaApoio from './CamadaApoio'
import CamadaAreas from './CamadaAreas'
import CamadaTrechos from './CamadaTrechos'
import FolhaAvaliacao, { type AlvoAvaliacao } from './FolhaAvaliacao'

interface Props {
  /** Retorna true se consumiu o toque (modo escolher origem/destino). */
  onToqueMapa?: (coord: LatLng) => boolean
  /** Atenua trechos/áreas de contexto (ex.: rota exibida). */
  atenuar?: boolean
}

const RAIO_TRECHO_M = 60

function trechoMaisProximo(coord: LatLng): Trecho | undefined {
  let melhor: Trecho | undefined
  let melhorD = RAIO_TRECHO_M
  for (const t of cenario.trechos) {
    for (let i = 1; i < t.coords.length; i++) {
      const d = distanciaPontoSegmentoM(coord, t.coords[i - 1], t.coords[i])
      if (d <= melhorD) {
        melhorD = d
        melhor = t
      }
    }
  }
  return melhor
}

function tituloPonto(coord: LatLng): string {
  const area = areaDoPonto(coord, cenario.areas)
  return area ? `Ponto em ${area.bairro}` : 'Ponto no mapa'
}

function alvoDoPonto(coord: LatLng): AlvoAvaliacao {
  const trecho = trechoMaisProximo(coord)
  if (trecho) return { alvoId: trecho.id, titulo: `${trecho.nome} · ${trecho.bairro}`, coord, trecho }
  return { alvoId: alvoIdParaCoord(coord), titulo: tituloPonto(coord), coord }
}

export default function CamadasMapa({ onToqueMapa, atenuar }: Props) {
  const { camadasVisiveis, agregado, periodo, avaliacoes, todasAvaliacoes } = useAppEstado()
  const [alvo, setAlvo] = useState<AlvoAvaliacao | null>(null)

  useMapEvents({
    click: (e) => {
      const coord = { lat: e.latlng.lat, lng: e.latlng.lng }
      if (onToqueMapa?.(coord)) return
      setAlvo(alvoDoPonto(coord))
    },
  })

  const aoSelecionarTrecho = useCallback((t: Trecho) => {
    const meio = t.coords[Math.floor(t.coords.length / 2)]
    setAlvo({ alvoId: t.id, titulo: `${t.nome} · ${t.bairro}`, coord: meio, trecho: t })
  }, [])

  const aoSelecionarAvaliacao = useCallback((alvoId: string, coord: LatLng) => {
    const trecho = cenario.trechos.find((t) => t.id === alvoId)
    if (trecho) setAlvo({ alvoId, titulo: `${trecho.nome} · ${trecho.bairro}`, coord, trecho })
    else setAlvo({ alvoId, titulo: tituloPonto(coord), coord })
  }, [])

  const fecharAlvo = useCallback(() => setAlvo(null), [])

  return (
    <>
      {camadasVisiveis.areas && <CamadaAreas agregado={agregado} periodo={periodo} atenuar={atenuar} />}
      {camadasVisiveis.trechos && <CamadaTrechos agregado={agregado} periodo={periodo} onSelecionar={aoSelecionarTrecho} atenuar={atenuar} />}
      {camadasVisiveis.trechos && <CamadaAvaliacoes avaliacoes={avaliacoes} todasAvaliacoes={todasAvaliacoes} onSelecionar={aoSelecionarAvaliacao} />}
      {camadasVisiveis.apoio && <CamadaApoio />}
      {alvo && <FolhaAvaliacao key={alvo.alvoId} alvo={alvo} onFechar={fecharAlvo} />}
    </>
  )
}
