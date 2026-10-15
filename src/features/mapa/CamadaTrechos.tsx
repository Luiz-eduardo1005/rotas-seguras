import { memo, useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import { CircleMarker, Polyline, useMap } from 'react-leaflet'
import { trechos } from '../../data/trechos'
import { amostrarPolilinha } from '../../domain/geo'
import { nivelDoTrecho } from '../../domain/pontuacao'
import type { Periodo, Trecho } from '../../domain/tipos'
import type { AgregadoAlvo } from '../../domain/avaliacoes'
import { COR_NIVEL } from './cores'
import { rendererCanvas } from './rendererCanvas'

interface Props {
  agregado: Map<string, AgregadoAlvo>
  periodo: Periodo
  onSelecionar: (trecho: Trecho) => void
  atenuar?: boolean
}

const LUZ_POSTES = 0.7
const PASSO_POSTE_M = 150
/** Abaixo deste zoom: linha única (sem halo nem postes). */
const ZOOM_DETALHE = 13

// geometrias e postes não dependem de estado: calculados uma vez por sessão
const posicoes = new Map(trechos.map((t) => [t.id, t.coords.map((c) => [c.lat, c.lng] as [number, number])]))
const postes = trechos
  .filter((t) => t.luz >= LUZ_POSTES)
  .flatMap((t) =>
    amostrarPolilinha(t.coords, PASSO_POSTE_M).map((c, i) => ({ id: `${t.id}-${i}`, c: [c.lat, c.lng] as [number, number] })),
  )

interface Linha {
  t: Trecho
  pos: [number, number][]
  cor: string
}

const Halo = memo(function Halo({ linhas }: { linhas: Linha[] }) {
  return (
    <>
      {linhas.map(({ t, pos, cor }) => (
        <Polyline key={t.id} positions={pos} interactive={false} renderer={rendererCanvas} pathOptions={{ color: cor, weight: 11, opacity: 0.18, lineCap: 'round' }} />
      ))}
    </>
  )
})

const Postes = memo(function Postes({ atenuar }: { atenuar: boolean }) {
  const opts = useMemo(
    () => ({ color: '#f5b544', weight: 3, opacity: atenuar ? 0.15 : 0.35, fillColor: '#f5b544', fillOpacity: atenuar ? 0.45 : 1 }),
    [atenuar],
  )
  return (
    <>
      {postes.map((p) => (
        <CircleMarker key={p.id} center={p.c} radius={2.5} interactive={false} renderer={rendererCanvas} pathOptions={opts} />
      ))}
    </>
  )
})

function CamadaTrechos({ agregado, periodo, onSelecionar, atenuar = false }: Props) {
  const mapa = useMap()
  const [detalhe, setDetalhe] = useState(() => mapa.getZoom() >= ZOOM_DETALHE)
  useEffect(() => {
    const aoZoom = () => setDetalhe(mapa.getZoom() >= ZOOM_DETALHE)
    mapa.on('zoomend', aoZoom)
    return () => {
      mapa.off('zoomend', aoZoom)
    }
  }, [mapa])

  const linhas = useMemo<Linha[]>(
    () => trechos.map((t) => ({ t, pos: posicoes.get(t.id)!, cor: COR_NIVEL[nivelDoTrecho(t, agregado, periodo)] })),
    [agregado, periodo],
  )
  const handlers = useMemo(
    () =>
      new Map(
        trechos.map((t) => [
          t.id,
          {
            click: (e: L.LeafletMouseEvent) => {
              L.DomEvent.stopPropagation(e)
              onSelecionar(t)
            },
          },
        ]),
      ),
    [onSelecionar],
  )
  return (
    <>
      {detalhe && !atenuar && <Halo linhas={linhas} />}
      {linhas.map(({ t, pos, cor }) => (
        <Polyline
          key={t.id}
          positions={pos}
          renderer={rendererCanvas}
          pathOptions={{ color: cor, weight: 4, opacity: atenuar ? 0.35 : 0.95, lineCap: 'round', bubblingMouseEvents: false }}
          eventHandlers={handlers.get(t.id)}
        />
      ))}
      {detalhe && <Postes atenuar={atenuar} />}
    </>
  )
}
export default memo(CamadaTrechos)
