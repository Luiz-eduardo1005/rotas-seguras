import { memo } from 'react'
import { Circle, Tooltip } from 'react-leaflet'
import { areas } from '../../data/areas'
import { nivelDaArea } from '../../domain/pontuacao'
import { useAppEstado } from '../estado/AppEstado'
import { COR_NIVEL, ROTULO_NIVEL } from './cores'

function CamadaAreas({ atenuar = false }: { atenuar?: boolean }) {
  const { agregado, periodo } = useAppEstado()
  return (
    <>
      {areas.map((a) => {
        const nivel = nivelDaArea(a, agregado, periodo)
        return (
          <Circle
            key={a.id}
            center={[a.centro.lat, a.centro.lng]}
            radius={a.raioM}
            interactive
            pathOptions={{ color: COR_NIVEL[nivel], weight: 1, opacity: atenuar ? 0.3 : 0.6, fillColor: COR_NIVEL[nivel], fillOpacity: atenuar ? 0.05 : 0.12 }}
          >
            <Tooltip sticky>
              {a.bairro} · {ROTULO_NIVEL[nivel]}
            </Tooltip>
          </Circle>
        )
      })}
    </>
  )
}
export default memo(CamadaAreas)
