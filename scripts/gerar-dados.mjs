// gera geometrias reais via OSRM/Nominatim; níveis de risco são simulados com base em docs/pesquisa/manaus.md
// Uso: node scripts/gerar-dados.mjs   (grava src/data/{areas,trechos,apoio,lugares,rotasPregravadas}.ts)
// Coordenadas fixas abaixo foram obtidas no Nominatim/Overpass em 2026-10-15 (1 req/s, User-Agent "RotasSeguras-faculdade").
// Rotas: https://routing.openstreetmap.de/routed-foot (perfil a pé). Respostas ficam em cache em os.tmpdir()/rotas-cache.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const SAIDA = join(RAIZ, 'src', 'data')
const CACHE = join(tmpdir(), 'rotas-cache')
mkdirSync(SAIDA, { recursive: true })
mkdirSync(CACHE, { recursive: true })
const CAB = '// DADOS SIMULADOS para demonstração acadêmica — ver docs/pesquisa/manaus.md\n// Gerado por scripts/gerar-dados.mjs — não editar à mão.\n'
const imp = (t) => `import type { ${t} } from '../domain/tipos'
`

// ---------- utilitários ----------
const R = 6371000
const rad = (g) => (g * Math.PI) / 180
const ll = ([lat, lng]) => ({ lat, lng })
const r5 = (n) => Math.round(n * 1e5) / 1e5
function dist(a, b) {
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
function distSeg(p, a, b) {
  const k = Math.cos(rad(p.lat))
  const X = (q) => ({ x: rad(q.lng) * k * R, y: rad(q.lat) * R })
  const P = X(p), A = X(a), B = X(b)
  const dx = B.x - A.x, dy = B.y - A.y, l2 = dx * dx + dy * dy
  const t = l2 ? Math.max(0, Math.min(1, ((P.x - A.x) * dx + (P.y - A.y) * dy) / l2)) : 0
  return Math.hypot(P.x - (A.x + t * dx), P.y - (A.y + t * dy))
}
const distPoli = (p, poli) => Math.min(...poli.slice(1).map((q, i) => distSeg(p, poli[i], q)))
function dp(c, tol) {
  if (c.length < 3) return c
  let maxD = 0, idx = 0
  for (let i = 1; i < c.length - 1; i++) {
    const d = distSeg(c[i], c[0], c[c.length - 1])
    if (d > maxD) { maxD = d; idx = i }
  }
  if (maxD <= tol) return [c[0], c[c.length - 1]]
  return [...dp(c.slice(0, idx + 1), tol).slice(0, -1), ...dp(c.slice(idx), tol)]
}
function simplificar(c, max) {
  let tol = 2, out = dp(c, tol)
  while (out.length > max) { tol *= 1.4; out = dp(c, tol) }
  return out.map((p) => ({ lat: r5(p.lat), lng: r5(p.lng) }))
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms))
async function osrm(pts, alternativas = false) {
  const path = pts.map((p) => `${p.lng},${p.lat}`).join(';')
  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${path}?overview=full&geometries=geojson${alternativas ? '&alternatives=3' : ''}`
  const f = join(CACHE, createHash('md5').update(url).digest('hex') + '.json')
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'))
  for (let t = 0; t < 4; t++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'RotasSeguras-faculdade' } })
      const j = await r.json()
      if (j.code === 'Ok') { writeFileSync(f, JSON.stringify(j)); await espera(400); return j }
    } catch { /* tenta de novo */ }
    await espera(1500)
  }
  throw new Error('OSRM falhou: ' + url)
}
const geom = (rt) => rt.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
const jit = (id, k, amp = 0.05) => ((hash(id + k) % 1000) / 1000) * 2 * amp - amp
const cl = (v) => Math.round(Math.max(0.02, Math.min(0.98, v)) * 100) / 100
const N = { risco: { alto: 0.8, medio: 0.5, baixo: 0.2 }, luz: { boa: 0.8, regular: 0.5, ruim: 0.25 }, mov: { alto: 0.8, medio: 0.5, baixo: 0.25 } }
const linhas = (arr) => arr.map((x) => '  ' + JSON.stringify(x)).join(',\n')
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// ---------- áreas (17 bairros) ----------
// [id, bairro, zona, lat, lng, raioM, risco, luz, mov, fonte]
const BAIRROS = [
  ['zumbi-dos-palmares', 'Zumbi dos Palmares', 'Leste', -3.0750, -59.9463, 1000, 'alto', 'regular', 'medio', 'pesquisa'],
  ['jorge-teixeira', 'Jorge Teixeira', 'Leste', -3.0270, -59.9182, 1500, 'alto', 'regular', 'medio', 'pesquisa'],
  ['tancredo-neves', 'Tancredo Neves', 'Leste', -3.0532, -59.9389, 900, 'alto', 'ruim', 'baixo', 'pesquisa'],
  ['sao-jose-operario', 'São José Operário', 'Leste', -3.0665, -59.9458, 1000, 'medio', 'regular', 'medio', 'estimativa'],
  ['compensa', 'Compensa', 'Oeste', -3.1052, -60.0537, 1300, 'medio', 'regular', 'medio', 'pesquisa'],
  ['ponta-negra', 'Ponta Negra', 'Oeste', -3.0509, -60.0962, 1400, 'medio', 'regular', 'baixo', 'pesquisa'],
  ['centro', 'Centro', 'Centro-Sul', -3.1321, -60.0216, 800, 'medio', 'boa', 'alto', 'pesquisa'],
  ['adrianopolis', 'Adrianópolis', 'Centro-Sul', -3.1017, -60.0090, 800, 'medio', 'regular', 'alto', 'pesquisa'],
  ['parque-dez', 'Parque Dez', 'Centro-Sul', -3.0890, -60.0189, 1000, 'medio', 'regular', 'medio', 'pesquisa'],
  ['educandos', 'Educandos', 'Sul', -3.1421, -60.0110, 700, 'medio', 'regular', 'medio', 'estimativa'],
  ['cidade-nova', 'Cidade Nova', 'Norte', -3.0299, -59.9926, 1500, 'medio', 'regular', 'medio', 'pesquisa'],
  ['cidade-de-deus', 'Cidade de Deus', 'Norte', -3.0187, -59.9504, 1000, 'alto', 'regular', 'medio', 'pesquisa'],
  ['novo-aleixo', 'Novo Aleixo', 'Norte', -3.0549, -59.9647, 1200, 'alto', 'regular', 'medio', 'pesquisa'],
  ['taruma', 'Tarumã', 'Centro-Oeste', -3.0247, -60.0513, 1500, 'medio', 'regular', 'baixo', 'pesquisa'],
  ['alvorada', 'Alvorada', 'Centro-Oeste', -3.0759, -60.0491, 1100, 'medio', 'regular', 'medio', 'estimativa'],
  ['petropolis', 'Petrópolis', 'Sul', -3.1119, -59.9948, 900, 'medio', 'regular', 'medio', 'estimativa'],
  ['flores', 'Flores', 'Centro-Sul', -3.0728, -60.0212, 1000, 'medio', 'regular', 'medio', 'estimativa'],
]
const areas = BAIRROS.map(([id, bairro, zona, lat, lng, raioM, r, l, m, fonte]) => ({
  id: 'area-' + id, bairro, zona, centro: { lat, lng }, raioM,
  luz: cl(N.luz[l] + jit(id, 'l')), fluxo: cl(N.mov[m] + jit(id, 'f')), risco: cl(N.risco[r] + jit(id, 'r')), fonte,
}))
const bairroDe = (p) => areas.reduce((b, a) => (dist(p, a.centro) < dist(p, b.centro) ? a : b)).bairro

// ---------- pontos de apoio ----------
// [nome, tipo, lat, lng, bairro]; fora: Hemoam (fecha 18h) e PRF (fecha 17h) por não servirem à noite.
const APOIO = [
  ['1º Distrito Integrado de Polícia', 'delegacia', -3.1185, -60.0116, 'Centro-Sul'],
  ['12º Distrito Integrado de Polícia', 'delegacia', -3.0709, -60.0227, 'Flores'],
  ['10º Distrito Integrado de Polícia', 'delegacia', -3.0719, -60.0457, 'Alvorada'],
  ['23ª Delegacia Integrada de Polícia', 'delegacia', -3.0707, -59.9962, 'Parque Dez'],
  ['27º Distrito Integrado de Polícia', 'delegacia', -3.0446, -59.9592, 'Novo Aleixo'],
  ['Comando de Policiamento de Área Oeste', 'delegacia', -3.1034, -60.0635, 'Compensa'],
  ['Comando de Policiamento de Área Norte', 'delegacia', -3.0444, -59.9589, 'Novo Aleixo'],
  ['Hospital e PS Delphina Rinaldi Abdel Aziz', 'saude', -2.9979, -60.0295, 'Tarumã'],
  ['Hospital Universitário Getúlio Vargas', 'saude', -3.1164, -60.0189, 'Centro'],
  ['Hospital Adriano Jorge', 'saude', -3.1189, -60.0056, 'Petrópolis'],
  ['Hospital e PS da Criança Zona Leste', 'saude', -3.0735, -59.9614, 'Zumbi dos Palmares'],
  ['SPA Galiléia', 'saude', -3.0139, -59.9909, 'Cidade Nova'],
  ['Policlínica Gilberto Mestrinho', 'saude', -3.1324, -60.0209, 'Centro'],
  ['Pronto Socorro Dr. Aristóteles Platão Araújo', 'saude', -3.03827, -59.94173, 'Jorge Teixeira'],
  ['Terminal Cidade Nova (T3)', 'terminal', -3.0316, -59.9855, 'Cidade Nova'],
  ['Terminal Embarque Metropolitano', 'terminal', -3.1035, -60.0668, 'Compensa'],
  ['Terminal São José (T5)', 'terminal', -3.07486, -59.95466, 'São José Operário'],
  ['Terminal 2 (Cachoeirinha)', 'terminal', -3.12718, -60.0055, 'Educandos'],
  ['Terminal Matriz', 'terminal', -3.13561, -60.02633, 'Centro'],
  ['Posto Equador', 'comercio24h', -3.0499, -59.9925, 'Cidade Nova'],
  ['Posto Shell', 'comercio24h', -3.0891, -59.9953, 'Petrópolis'],
  ['Farmabem', 'comercio24h', -3.1161, -60.0181, 'Centro'],
  ['Drogaria Avenida', 'comercio24h', -3.1161, -60.0194, 'Centro'],
  ['Shopping Manauara', 'comercio24h', -3.104, -60.0113, 'Adrianópolis'],
  ['Shopping Ponta Negra', 'comercio24h', -3.0846, -60.0724, 'Ponta Negra'],
  ['Área de lazer do Shopping T4', 'praca', -3.0354, -59.942, 'Cidade de Deus'],
  ['Praça Osvaldo Cruz (Praça da Matriz)', 'praca', -3.1354, -60.0254, 'Centro'],
  ['Teatro Amazonas', 'praca', -3.1303, -60.0234, 'Centro'],
]
const pontosApoio = APOIO.map(([nome, tipo, lat, lng, bairro]) => ({ id: 'apoio-' + slug(nome), nome, tipo, coord: { lat, lng }, bairro }))

// ---------- lugares ----------
const L = (nome, tipo, lat, lng, bairro) => ({ id: tipo + '-' + slug(nome), nome, tipo, coord: { lat, lng }, bairro })
const lugares = [
  L('E.E. Júlia Bittencourt', 'escola', -3.1086, -60.0516, 'Compensa'),
  L('E.E. Balbina Mestrinho (coord. estimada)', 'escola', -3.12732, -60.00306, 'Educandos'),
  L('E.E. Demóstenes Belduque Traves', 'escola', -3.0307, -59.9299, 'Jorge Teixeira'),
  L('E.E. Prof. Cacilda Pinto', 'escola', -3.0315, -59.9269, 'Jorge Teixeira'),
  L('Universidade Nilton Lins', 'escola', -3.0572, -60.0066, 'Flores'),
  L('UNIP Parque Dez', 'escola', -3.0808, -60.0235, 'Parque Dez'),
  L('UEA Escola Superior de Tecnologia', 'escola', -3.09192, -60.01794, 'Parque Dez'),
  L('Terminal Cidade Nova (T3)', 'terminal', -3.0316, -59.9855, 'Cidade Nova'),
  L('Terminal Embarque Metropolitano', 'terminal', -3.1035, -60.0668, 'Compensa'),
  L('Terminal São José (T5)', 'terminal', -3.07486, -59.95466, 'São José Operário'),
  L('Terminal 2 (Cachoeirinha)', 'terminal', -3.12718, -60.0055, 'Educandos'),
  L('Terminal Matriz', 'terminal', -3.13561, -60.02633, 'Centro'),
  ...areas.map((a) => L(a.bairro, 'bairro', a.centro.lat, a.centro.lng, a.bairro)),
  L('Teatro Amazonas', 'referencia', -3.1303, -60.0234, 'Centro'),
  L('Arena da Amazônia', 'referencia', -3.08311, -60.02801, 'Flores'),
  L('Shopping Manauara', 'referencia', -3.104, -60.0113, 'Adrianópolis'),
  L('Shopping Ponta Negra', 'referencia', -3.0846, -60.0724, 'Ponta Negra'),
  L('Praia da Ponta Negra (calçadão)', 'referencia', -3.06247, -60.10375, 'Ponta Negra'),
  L('UFAM', 'referencia', -3.09992, -59.9752, 'Coroado'),
  L('Praça Osvaldo Cruz (Matriz)', 'referencia', -3.1354, -60.0254, 'Centro'),
  L('Pronto Socorro Platão Araújo', 'apoio', -3.03827, -59.94173, 'Jorge Teixeira'),
  L('1º DIP', 'apoio', -3.1185, -60.0116, 'Centro-Sul'),
]
const lug = (id) => lugares.find((l) => l.id === id).coord

// [id, titulo, descricao, origem(nome), destino(nome), indice da alternativa 'segura']
const MODELOS = [
  ['julia-centro', 'Escola na Compensa até o Centro', 'Saída do turno noturno da E.E. Júlia Bittencourt rumo ao Centro', 'E.E. Júlia Bittencourt', 'Teatro Amazonas', 1],
  ['cacilda-t5', 'Escola no Jorge Teixeira até o T5', 'Da E.E. Cacilda Pinto ao Terminal São José (Zona Leste)', 'E.E. Prof. Cacilda Pinto', 'Terminal São José (T5)', 1],
  ['demostenes-t3', 'Escola no Jorge Teixeira até o T3', 'Da E.E. Demóstenes Belduque ao Terminal Cidade Nova', 'E.E. Demóstenes Belduque Traves', 'Terminal Cidade Nova (T3)', 0],
  ['unip-compensa', 'UNIP até a Compensa', 'Da UNIP Parque Dez para casa, na Compensa', 'UNIP Parque Dez', 'Compensa', 0],
  ['lins-zumbi', 'Nilton Lins até Zumbi dos Palmares', 'Da Universidade Nilton Lins para casa, em Zumbi dos Palmares', 'Universidade Nilton Lins', 'Zumbi dos Palmares', 1],
  ['trabalho-centro-compensa', 'Trabalho no Centro até a Compensa', 'Do Teatro Amazonas (Centro) para casa, na Compensa', 'Teatro Amazonas', 'Compensa', 0],
]
const rotasModelo = MODELOS.map(([id, titulo, descricao, o, d]) => ({
  id, titulo, descricao,
  origemId: lugares.find((l) => l.nome === o).id,
  destinoId: lugares.find((l) => l.nome === d && l.tipo !== 'apoio').id,
}))

// ---------- rotas pré-gravadas ----------
const rotasPregravadas = []
const altsBrutas = {}
for (const m of rotasModelo) {
  const j = await osrm([lug(m.origemId), lug(m.destinoId)], true)
  altsBrutas[m.id] = j.routes.slice(0, 3).map((rt) => ({ coords: geom(rt), distanciaM: Math.round(rt.distance), duracaoS: Math.round(rt.duration) }))
  rotasPregravadas.push({
    rotaModeloId: m.id,
    rotas: altsBrutas[m.id].map((a) => ({ coords: simplificar(a.coords, 120), distanciaM: a.distanciaM, duracaoS: a.duracaoS })),
  })
}

// ---------- trechos ----------
const trechos = []
const addTrecho = (id, nome, coords, f, fonte = 'estimativa') => {
  const c = simplificar(coords, 40)
  trechos.push({
    id, nome, bairro: bairroDe(c[Math.floor(c.length / 2)]), coords: c,
    luz: cl(f[0] + jit(id, 'l', 0.04)), fluxo: cl(f[1] + jit(id, 'f', 0.04)), risco: cl(f[2] + jit(id, 'r', 0.04)), fonte,
  })
}
// 1) as 11 vias da pesquisa [nome, início, fim, [luz, fluxo, risco]]. Vias curtas são prolongadas ~700 m no mesmo rumo e roteadas pela rua real.
const VIAS = [
  ['Av. Djalma Batista', [-3.0916, -60.0237], [-3.0910, -60.0242], [0.8, 0.8, 0.25]],
  ['Av. Constantino Nery', [-3.0985, -60.0266], [-3.0978, -60.0261], [0.5, 0.5, 0.45]],
  ['Av. Autaz Mirim', [-3.0980, -59.9471], [-3.0778, -59.9559], [0.55, 0.55, 0.55]],
  ['Av. Brasil', [-3.0899, -60.0607], [-3.0896, -60.0610], [0.7, 0.7, 0.35]],
  ['Av. Torquato Tapajós', [-2.9912, -60.0309], [-2.9898, -60.0302], [0.5, 0.45, 0.6]],
  ['Av. Eduardo Ribeiro', [-3.1299, -60.0241], [-3.1290, -60.0241], [0.85, 0.85, 0.3]],
  ['Av. Cosme Ferreira', [-3.0876, -59.9278], [-3.0873, -59.9282], [0.25, 0.8, 0.65]],
  ['Av. Darcy Vargas', [-3.0936, -60.0266], [-3.0934, -60.0264], [0.5, 0.5, 0.45]],
  ['Av. Mário Ypiranga', [-3.0869, -60.0193], [-3.0807, -60.0243], [0.55, 0.8, 0.4]],
  ['Av. Coronel Teixeira', [-3.0893, -60.0598], [-3.0894, -60.0597], [0.45, 0.5, 0.5]],
  ['Av. Manicoré (Leonardo Malcher no OSM)', [-3.1271, -60.0078], [-3.1263, -60.0110], [0.5, 0.5, 0.5]],
]
for (const [nome, a, b, f] of VIAS) {
  const pts = [ll(a), ll(b)]
  if (dist(pts[0], pts[1]) < 300) {
    const k = 700 / (dist(pts[0], pts[1]) || 1)
    pts.push({ lat: pts[1].lat + (pts[1].lat - pts[0].lat) * k, lng: pts[1].lng + (pts[1].lng - pts[0].lng) * k })
  }
  const j = await osrm(pts)
  addTrecho('via-' + slug(nome), nome, geom(j.routes[0]), f)
}
// 2) ruas locais: trechos onde as alternativas de cada rota-modelo divergem (geometria real do OSRM).
// A alternativa 'segura' recebe verde (via principal iluminada), a outra vermelho (ruas internas escuras).
function divergente(a, b, pad) {
  const flag = a.map((p) => distPoli(p, b) > 80)
  let melhor = [0, -1], ini = -1
  for (let i = 0; i <= flag.length; i++) {
    if (flag[i] && ini < 0) ini = i
    if (!flag[i] && ini >= 0) { if (i - 1 - ini > melhor[1] - melhor[0]) melhor = [ini, i - 1]; ini = -1 }
  }
  return a.slice(Math.max(0, melhor[0] - pad), Math.min(a.length, melhor[1] + 1 + pad))
}
for (const [id, , , , , seguraIdx] of MODELOS) {
  const alts = altsBrutas[id]
  if (alts.length < 2) continue
  const [iS, iP] = seguraIdx === 1 ? [1, 0] : [0, 1]
  const nS = divergente(alts[iS].coords, alts[iP].coords, 6)
  const nP = divergente(alts[iP].coords, alts[iS].coords, 6)
  addTrecho(`local-${id}-seguro`, `Via principal — ${bairroDe(nS[Math.floor(nS.length / 2)])}`, nS, [0.8, 0.75, 0.2])
  addTrecho(`local-${id}-escuro`, `Ruas internas — ${bairroDe(nP[Math.floor(nP.length / 2)])}`, nP, [0.22, 0.25, 0.82])
}
// 3) reforço por bairro de alto risco: sempre existe uma via principal verde e ruas internas ruins
const EXTRA = [
  ['Eixo comercial — Zumbi dos Palmares', [-3.0750, -59.9463], [-3.07486, -59.95466], [0.75, 0.75, 0.3]],
  ['Ruas internas — Zumbi dos Palmares', [-3.0665, -59.9458], [-3.0750, -59.9463], [0.3, 0.3, 0.8]],
  ['Eixo de ônibus — Cidade de Deus', [-3.0187, -59.9504], [-3.0354, -59.942], [0.7, 0.7, 0.35]],
  ['Ruas internas — Cidade de Deus', [-3.0187, -59.9504], [-3.0270, -59.9420], [0.3, 0.3, 0.75]],
  ['Eixo principal — Jorge Teixeira', [-3.0307, -59.9299], [-3.03827, -59.94173], [0.7, 0.7, 0.35]],
  ['Ruas internas — São José Operário', [-3.0665, -59.9458], [-3.0620, -59.9400], [0.35, 0.4, 0.55]],
  ['Ruas internas — Centro (becos)', [-3.1303, -60.0234], [-3.1340, -60.0200], [0.4, 0.3, 0.7]],
  ['Eixo principal — Compensa', [-3.1086, -60.0516], [-3.1035, -60.0668], [0.7, 0.7, 0.3]],
]
for (const [nome, a, b, f] of EXTRA) {
  const j = await osrm([ll(a), ll(b)])
  addTrecho('extra-' + slug(nome), nome, geom(j.routes[0]), f)
}

// ---------- escrita ----------
const w = (arq, src) => writeFileSync(join(SAIDA, arq), src)
w('areas.ts', `${CAB}${imp('Area')}\nexport const areas: Area[] = [\n${linhas(areas)},\n]\n`)
w('trechos.ts', `${CAB}${imp('Trecho')}\nexport const trechos: Trecho[] = [\n${linhas(trechos)},\n]\n`)
w('apoio.ts', `${CAB}${imp('PontoApoio')}\nexport const pontosApoio: PontoApoio[] = [\n${linhas(pontosApoio)},\n]\n`)
w('lugares.ts', `${CAB}import type { LatLng } from '../domain/tipos'

export interface Lugar {
  id: string
  nome: string
  tipo: 'escola' | 'terminal' | 'bairro' | 'apoio' | 'referencia'
  coord: LatLng
  bairro: string
}

export interface RotaModelo {
  id: string
  titulo: string
  descricao: string
  origemId: string
  destinoId: string
}

export const lugares: Lugar[] = [\n${linhas(lugares)},\n]

export const rotasModelo: RotaModelo[] = [\n${linhas(rotasModelo)},\n]
`)
w('rotasPregravadas.ts', `${CAB}import type { LatLng } from '../domain/tipos'

export interface RotaPregravada {
  coords: LatLng[]
  distanciaM: number
  duracaoS: number
}

export interface RotasPregravadasDe {
  rotaModeloId: string
  rotas: RotaPregravada[]
}

export const rotasPregravadas: RotasPregravadasDe[] = [\n${linhas(rotasPregravadas)},\n]
`)
console.log('areas', areas.length, 'trechos', trechos.length, 'apoio', pontosApoio.length, 'lugares', lugares.length, 'modelos', rotasModelo.length)
