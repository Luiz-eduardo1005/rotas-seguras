import { memo, useMemo } from 'react'
import L from 'leaflet'
import { CircleMarker, Polyline } from 'react-leaflet'
import { trechos } from '../../data/trechos'
import { amostrarPolilinha } from '../../domain/geo'
import { nivelDoTrecho } from '../../domain/pontuacao'
import type { Trecho } from '../../domain/tipos'
import { useAppEstado } from '../estado/AppEstado'
import { COR_NIVEL } from './cores'

interface Props {
  onSelecionar: (trecho: Trecho) => void
  atenuar?: boolean
}

const LUZ_POSTES = 0.7
const PASSO_POSTE_M = 150

function CamadaTrechos({ onSelecionar, atenuar = false }: Props) {
  const { agregado, periodo } = useAppEstado()
  const postes = useMemo(
    () =>
      trechos
        .filter((t) => t.luz >= LUZ_POSTES)
        .flatMap((t) => amostrarPolilinha(t.coords, PASSO_POSTE_M).map((c, i) => ({ id: `${t.id}-${i}`, c }))),
    [],
  )
  const linhas = useMemo(
    () =>
      trechos.map((t) => ({
        t,
        pos: t.coords.map((c) => [c.lat, c.lng] as [number, number]),
        cor: COR_NIVEL[nivelDoTrecho(t, agregado, periodo)],
      })),
    [agregado, periodo],
  )
  return (
    <>
      {!atenuar && linhas.map(({ t, pos, cor }) => (
        <Polyline key={`g-${t.id}`} positions={pos} interactive={false} pathOptions={{ color: cor, weight: 11, opacity: 0.18, lineCap: 'round' }} />
      ))}
      {linhas.map(({ t, pos, cor }) => (
        <Polyline
          key={t.id}
          positions={pos}
          pathOptions={{ color: cor, weight: 4, opacity: atenuar ? 0.35 : 0.95, lineCap: 'round', bubblingMouseEvents: false }}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e)
              onSelecionar(t)
            },
          }}
        />
      ))}
      {postes.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.c.lat, p.c.lng]}
          radius={2.5}
          interactive={false}
          pathOptions={{ color: '#f5b544', weight: 3, opacity: atenuar ? 0.15 : 0.35, fillColor: '#f5b544', fillOpacity: atenuar ? 0.45 : 1 }}
        />
      ))}
    </>
  )
}
export default memo(CamadaTrechos)
