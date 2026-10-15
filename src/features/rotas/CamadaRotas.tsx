import { useEffect, useRef } from 'react'
import { CircleMarker, Polyline, useMap } from 'react-leaflet'
import { COR_NIVEL } from '../mapa/cores'
import { useRotas } from './RotasEstado'

const CIANO = '#22d3ee'

/** Dentro do MapContainer: alternativas, rota selecionada com glow e marcadores de origem/destino. */
export default function CamadaRotas() {
  const { resultados, selecionadaIdx, selecionar, origem, destino, versaoResultados } = useRotas()
  const map = useMap()
  const ultimaVersao = useRef(0)

  useEffect(() => {
    if (versaoResultados === ultimaVersao.current || !resultados.length) return
    ultimaVersao.current = versaoResultados
    const pontos = resultados.flatMap((r) => r.coords.map((c) => [c.lat, c.lng] as [number, number]))
    if (!pontos.length) return
    // painel compacto cobre só a base; cabeçalho cobre o topo
    map.fitBounds(pontos, { paddingTopLeft: [40, 90], paddingBottomRight: [40, 140], maxZoom: 17 })
  }, [versaoResultados, resultados, map])

  const sel = resultados[selecionadaIdx]

  return (
    <>
      {resultados.map((r, i) =>
        i === selecionadaIdx ? null : (
          <Polyline
            key={`alt-${versaoResultados}-${i}`}
            positions={r.coords}
            pathOptions={{ color: '#94a3b8', weight: 5, opacity: 0.8, dashArray: '8 8' }}
            eventHandlers={{ click: () => selecionar(i) }}
          />
        ),
      )}
      {sel && (
        <>
          <Polyline
            positions={sel.coords}
            interactive={false}
            pathOptions={{ color: CIANO, weight: 16, opacity: 0.28, lineCap: 'round', lineJoin: 'round' }}
          />
          {sel.segmentos.map((s, i) => (
            <Polyline
              key={`seg-${versaoResultados}-${selecionadaIdx}-${i}`}
              positions={s.coords}
              interactive={false}
              pathOptions={{ color: COR_NIVEL[s.nivel], weight: 6, opacity: 1, lineCap: 'round', lineJoin: 'round' }}
            />
          ))}
        </>
      )}
      {origem && (
        <CircleMarker
          center={origem.coord}
          radius={9}
          interactive={false}
          pathOptions={{ color: '#ffffff', weight: 2, fillColor: CIANO, fillOpacity: 1 }}
        />
      )}
      {destino && (
        <CircleMarker
          center={destino.coord}
          radius={11}
          interactive={false}
          pathOptions={{ color: CIANO, weight: 4, fillColor: '#060b16', fillOpacity: 1 }}
        />
      )}
    </>
  )
}
