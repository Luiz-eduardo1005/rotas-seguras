import L from 'leaflet'

/** Renderer canvas único e compartilhado (trechos, áreas, rotas, relatos). tolerance = área de toque em px. */
export const rendererCanvas = L.canvas({ padding: 0.5, tolerance: 6 })
