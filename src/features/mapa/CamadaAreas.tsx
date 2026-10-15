import { memo, useMemo } from 'react'
import { Circle, Tooltip } from 'react-leaflet'
import { areas } from '../../data/areas'
import { nivelDaArea } from '../../domain/pontuacao'
import type { Periodo } from '../../domain/tipos'
import type { AgregadoAlvo } from '../../domain/avaliacoes'
import { COR_NIVEL, ROTULO_NIVEL } from './cores'
import { rendererCanvas } from './rendererCanvas'

interface Props {
  agregado: Map<string, AgregadoAlvo>
  periodo: Periodo
  atenuar?: boolean
}

function CamadaAreas({ agregado, periodo, atenuar = false }: Props) {
  const itens = useMemo(
    () =>
      areas.map((a) => {
        const nivel = nivelDaArea(a, agregado, periodo)
        const cor = COR_NIVEL[nivel]
        return {
          a,
          rotulo: ROTULO_NIVEL[nivel],
          centro: [a.centro.lat, a.centro.lng] as [number, number],
          opts: { color: cor, weight: 1, opacity: atenuar ? 0.3 : 0.6, fillColor: cor, fillOpacity: atenuar ? 0.05 : 0.12 },
        }
      }),
    [agregado, periodo, atenuar],
  )
  return (
    <>
      {itens.map(({ a, rotulo, centro, opts }) => (
        <Circle key={a.id} center={centro} radius={a.raioM} interactive renderer={rendererCanvas} pathOptions={opts}>
          <Tooltip sticky>
            {a.bairro} · {rotulo}
          </Tooltip>
        </Circle>
      ))}
    </>
  )
}
export default memo(CamadaAreas)
