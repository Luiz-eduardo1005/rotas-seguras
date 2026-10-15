import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { CircleMarker, useMap } from 'react-leaflet'
import { Navigation } from 'lucide-react'

const MSG_ERRO: Record<number, string> = {
  1: 'Permissão de localização negada.',
  2: 'Localização indisponível.',
  3: 'Tempo esgotado ao obter localização.',
}

export default function BotaoLocalizar() {
  const map = useMap()
  const refBox = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<[number, number] | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [buscando, setBuscando] = useState(false)

  useEffect(() => {
    if (refBox.current) {
      L.DomEvent.disableClickPropagation(refBox.current)
      L.DomEvent.disableScrollPropagation(refBox.current)
    }
  }, [])

  useEffect(() => {
    if (!erro) return
    const t = setTimeout(() => setErro(null), 5000)
    return () => clearTimeout(t)
  }, [erro])

  function localizar() {
    if (!('geolocation' in navigator)) {
      setErro('Este aparelho não oferece geolocalização.')
      return
    }
    setBuscando(true)
    setErro(null)
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const ll: [number, number] = [p.coords.latitude, p.coords.longitude]
        setPos(ll)
        setBuscando(false)
        map.flyTo(ll, 16)
      },
      (e) => {
        setBuscando(false)
        setErro(MSG_ERRO[e.code] ?? 'Não foi possível obter a localização.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <>
      {pos && (
        <>
          <CircleMarker
            center={pos}
            radius={16}
            interactive={false}
            className="localizar-pulso"
            pathOptions={{ color: '#22d3ee', weight: 1, fillColor: '#22d3ee', fillOpacity: 0.2 }}
          />
          <CircleMarker
            center={pos}
            radius={6}
            interactive={false}
            pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#22d3ee', fillOpacity: 1 }}
          />
        </>
      )}
      <div
        ref={refBox}
        className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-3 z-[1000] flex flex-col items-end gap-2"
      >
        {erro && (
          <p role="alert" className="max-w-56 rounded-xl border border-line bg-surface px-3 py-2 text-xs text-danger backdrop-blur">
            {erro}
          </p>
        )}
        <button
          onClick={localizar}
          aria-label="Minha localização"
          aria-busy={buscando}
          className="grid size-12 place-items-center rounded-full border border-route/60 bg-surface-solid text-route shadow-glow"
        >
          <Navigation size={22} className={buscando ? 'animate-pulse' : undefined} />
        </button>
      </div>
    </>
  )
}
