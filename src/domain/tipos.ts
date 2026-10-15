export interface LatLng {
  lat: number
  lng: number
}

export type Nivel = 'verde' | 'amarelo' | 'vermelho'
export type Fonte = 'pesquisa' | 'estimativa'
export type Periodo = 'dia' | 'noite'

export interface Fatores {
  luz: number
  fluxo: number
  risco: number
}

export interface Trecho extends Fatores {
  id: string
  nome: string
  bairro: string
  coords: LatLng[]
  fonte: Fonte
}

export interface Area extends Fatores {
  id: string
  bairro: string
  zona: string
  centro: LatLng
  raioM: number
  fonte: Fonte
}

export type TipoApoio = 'delegacia' | 'saude' | 'terminal' | 'comercio24h' | 'praca'

export interface PontoApoio {
  id: string
  nome: string
  tipo: TipoApoio
  coord: LatLng
  bairro: string
}

export type TipoAvaliacao = 'luz' | 'fluxo' | 'atencao'

export interface Avaliacao {
  id: string
  alvoId: string
  tipo: TipoAvaliacao
  coord: LatLng
  criadoEm: string
  comentario?: string
}

export interface AmostraPontuada {
  coord: LatLng
  fatores: Fatores
  nivel: Nivel
}

export interface SegmentoRota {
  coords: LatLng[]
  nivel: Nivel
}

export interface ResultadoRota {
  nota: number
  nivel: Nivel
  fatoresMedios: Fatores
  bonusApoio: number
  pontosApoioProximos: PontoApoio[]
  segmentos: SegmentoRota[]
  comprimentoM: number
}

export interface Cenario {
  trechos: Trecho[]
  areas: Area[]
  pontosApoio: PontoApoio[]
}
