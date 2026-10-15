// RELATOS SIMULADOS — preenchido pelo gerador (fase V5)
// Dados fictícios para demonstração acadêmica: autores e comentários não são de pessoas reais.
import { alvoIdParaCoord } from '../domain/avaliacoes'
import type { Avaliacao, LatLng, TipoAvaliacao } from '../domain/tipos'

const MIN = 60_000
const agoraBase = Date.now()
const atras = (minutos: number) => new Date(agoraBase - minutos * MIN).toISOString()
const HORA = 60
const DIA = 24 * HORA

function relato(
  n: number,
  alvoId: string,
  coord: LatLng,
  tipo: TipoAvaliacao,
  autorNome: string,
  minutosAtras: number,
  comentario: string,
): Avaliacao {
  return {
    id: `semente-${n}`,
    alvoId,
    tipo,
    coord,
    criadoEm: atras(minutosAtras),
    comentario,
    autorId: `semente-${autorNome.toLowerCase().replace(/\W+/g, '-')}`,
    autorNome,
    semente: true,
  }
}

const celula = (coord: LatLng) => alvoIdParaCoord(coord)
const ruaCentro: LatLng = { lat: -3.12981, lng: -60.02661 }
const becoCompensa: LatLng = { lat: -3.1035, lng: -60.0521 }

export const avaliacoesSemente: Avaliacao[] = [
  relato(1, 'local-julia-centro-escuro', { lat: -3.12981, lng: -60.02661 }, 'atencao', 'Ana P.', 2 * HORA, 'Poste queimado na esquina, a rua fica bem escura depois das 19h.'),
  relato(2, 'local-julia-centro-escuro', { lat: -3.12981, lng: -60.02661 }, 'luz', 'Marcos R.', 3 * DIA, 'Trocaram duas lâmpadas essa semana, melhorou um pouco.'),
  relato(3, 'via-av-eduardo-ribeiro', { lat: -3.12465, lng: -60.02502 }, 'fluxo', 'Juliana S.', 5 * HORA, 'Bastante gente passando, comércio aberto até tarde.'),
  relato(4, 'via-av-djalma-batista', { lat: -3.08626, lng: -60.0245 }, 'luz', 'Carlos E.', 1 * DIA, 'Avenida bem iluminada, ponto de ônibus com cobertura e luz.'),
  relato(5, 'extra-ruas-internas-zumbi-dos-palmares', { lat: -3.07049, lng: -59.94281 }, 'atencao', 'Rafaela M.', 4 * DIA, 'Rua deserta à noite, prefiro contornar pela avenida.'),
  relato(6, 'via-av-cosme-ferreira', { lat: -3.08286, lng: -59.93117 }, 'fluxo', 'Diego L.', 9 * DIA, 'Movimento constante perto do ponto de ônibus até umas 22h.'),
  relato(7, 'local-cacilda-t5-escuro', { lat: -3.05323, lng: -59.94531 }, 'atencao', 'Tatiane O.', 6 * HORA, 'Trecho sem iluminação, terreno baldio ao lado. Evito sozinha.'),
  relato(8, 'extra-eixo-principal-compensa', { lat: -3.10689, lng: -60.05881 }, 'luz', 'Paulo H.', 12 * DIA, 'Postes novos de LED, deu para sentir a diferença.'),
  relato(9, celula(becoCompensa), becoCompensa, 'atencao', 'Beatriz N.', 2 * DIA, 'Beco com pouca luz e sem saída visível; passei rápido.'),
  relato(10, 'extra-ruas-internas-centro-becos', { lat: -3.13086, lng: -60.02149 }, 'fluxo', 'Ana P.', 18 * DIA, 'De dia é tranquilo, muito pedestre; à noite esvazia rápido.'),
  relato(11, celula(ruaCentro), ruaCentro, 'luz', 'Eduardo V.', 25 * DIA, 'Lâmpada piscando perto do ponto de ônibus, acenderam de novo.'),
  relato(12, 'local-trabalho-centro-compensa-seguro', { lat: -3.13414, lng: -60.02568 }, 'fluxo', 'Larissa C.', 28 * DIA, 'Via movimentada, sempre tem gente e ônibus passando.'),
]
