// gera geometrias reais via OSRM; níveis simulados com base em docs/pesquisa/manaus-v2.json
// Uso: node scripts/gerar-dados.mjs  (grava src/data/{areas,trechos,apoio,lugares,rotasPregravadas,comunidadeSemente}.ts)
// Rotas: https://routing.openstreetmap.de/routed-foot (a pé). Respostas em cache em os.tmpdir()/rotas-cache.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dist, distPoli, comprimento, desloca, simplificar, osrm, osrmOuNulo, geom, jit, cl, linhas, slug, ll } from './lib/util.mjs'
import { gerarRelatos, REFERENCIA } from './lib/relatos.mjs'
import { APOIO_ATUAL, LUGARES_FIXOS, MODELOS, VIA, VIAS, EXTRA, FCRIT } from './lib/base.mjs'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const SAIDA = join(RAIZ, 'src', 'data')
mkdirSync(SAIDA, { recursive: true })
const J = JSON.parse(readFileSync(join(RAIZ, 'docs', 'pesquisa', 'manaus-v2.json'), 'utf8'))
const CAB = '// DADOS SIMULADOS para demonstração acadêmica — ver docs/pesquisa/manaus-v2.md\n// Gerado por scripts/gerar-dados.mjs — não editar à mão.\n'
const imp = (t) => `import type { ${t} } from '../domain/tipos'\n`
const ehUrl = (f) => /^https?:/.test(f)

// ---------- áreas (1 por bairro do JSON v2) ----------
const ALIAS = { 'Parque 10 de Novembro': 'parque-dez' } // preserva id antigo
const B = {
  risco: { alto: [0.785, 0.065], medio: [0.485, 0.065], baixo: [0.215, 0.065] },
  luz: { boa: [0.8, 0.05], regular: [0.5, 0.05], ruim: [0.25, 0.05] },
  mov: { alto: [0.8, 0.05], medio: [0.5, 0.05], baixo: [0.25, 0.05] },
}
const fat = (tab, k, id, c) => cl(tab[k][0] + jit(id, c, tab[k][1]))
const areas = J.bairros.map((b) => {
  const id = ALIAS[b.nome] ?? slug(b.nome)
  return {
    id: 'area-' + id, bairro: b.nome, zona: b.zona, centro: { lat: b.lat, lng: b.lng },
    raioM: Math.max(400, Math.min(2500, b.raioM)),
    luz: fat(B.luz, b.iluminacao, id, 'l'), fluxo: fat(B.mov, b.movimento, id, 'f'), risco: fat(B.risco, b.risco, id, 'r'),
    fonte: ehUrl(b.fonte) ? 'pesquisa' : 'estimativa',
  }
})
const areaDe = (p) => areas.reduce((b, a) => (dist(p, a.centro) < dist(p, b.centro) ? a : b))
const bairroDe = (p) => areaDe(p).bairro
const bairroOuProximo = (nome, p) => (areas.some((a) => a.bairro === nome) ? nome : bairroDe(p))

// ---------- pontos de apoio (atuais + 35 do JSON, dedupe por nome/80 m) ----------
const apoioBruto = APOIO_ATUAL.map(([nome, tipo, lat, lng, bairro]) => ({ nome, tipo, coord: { lat, lng }, bairro }))
for (const a of J.apoio) {
  const novo = { nome: a.nome, tipo: a.tipo, coord: { lat: a.lat, lng: a.lng }, bairro: a.bairro }
  const dup = apoioBruto.some((x) => slug(x.nome) === slug(novo.nome) || (x.tipo === novo.tipo && dist(x.coord, novo.coord) <= 80))
  if (!dup) apoioBruto.push(novo)
}
const pontosApoio = apoioBruto.map((a) => ({
  id: 'apoio-' + slug(a.nome),
  nome: a.tipo === 'comercio24h' && /shopping/i.test(a.nome) ? a.nome + ' (até ~22h)' : a.nome,
  tipo: a.tipo, coord: a.coord, bairro: a.bairro,
}))

// ---------- lugares ----------
const L = (nome, tipo, lat, lng, bairro) => ({ id: tipo + '-' + slug(nome), nome, tipo, coord: { lat, lng }, bairro })
const lugares = [
  ...LUGARES_FIXOS.slice(0, 7).map((x) => L(...x)),
  ...pontosApoio.filter((p) => p.tipo === 'terminal').map((p) => L(p.nome, 'terminal', p.coord.lat, p.coord.lng, p.bairro)),
  ...areas.map((a) => L(a.bairro, 'bairro', a.centro.lat, a.centro.lng, a.bairro)),
  ...LUGARES_FIXOS.slice(7).map((x) => L(...x)),
]
for (const p of pontosApoio.filter((x) => x.tipo === 'saude')) {
  if (lugares.some((l) => l.tipo === 'apoio' && dist(l.coord, p.coord) <= 80)) continue
  lugares.push(L(p.nome, 'apoio', p.coord.lat, p.coord.lng, p.bairro))
}
const lug = (id) => lugares.find((l) => l.id === id).coord
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
  const rts = j.routes.slice(0, 3)
  if (VIA[m.id]) {
    const jv = await osrm([lug(m.origemId), ll(VIA[m.id]), lug(m.destinoId)])
    rts.splice(0, rts.length, j.routes[0], jv.routes[0])
  }
  altsBrutas[m.id] = rts.map((rt) => ({ coords: geom(rt), distanciaM: Math.round(rt.distance), duracaoS: Math.round(rt.duration) }))
  rotasPregravadas.push({ rotaModeloId: m.id, rotas: altsBrutas[m.id].map((a) => ({ coords: simplificar(a.coords, 120), distanciaM: a.distanciaM, duracaoS: a.duracaoS })) })
}

// ---------- trechos ----------
const trechos = []
const ids = new Set()
const addTrecho = (id, nome, coords, f, fonte = 'estimativa', bairro) => {
  const c = simplificar(coords, 40)
  let uid = id, n = 2
  while (ids.has(uid)) uid = `${id}-${n++}`
  ids.add(uid)
  trechos.push({
    id: uid, nome, bairro: bairro ?? bairroDe(c[Math.floor(c.length / 2)]), coords: c,
    luz: cl(f[0] + jit(uid, 'l', 0.04)), fluxo: cl(f[1] + jit(uid, 'f', 0.04)), risco: cl(f[2] + jit(uid, 'r', 0.04)), fonte,
  })
}
// prolonga vias curtas ~700 m no mesmo rumo para o OSRM achar a rua real
function pontosVia(a, b) {
  const pts = [ll(a), ll(b)]
  if (dist(pts[0], pts[1]) < 300) {
    const k = 700 / (dist(pts[0], pts[1]) || 1)
    pts.push({ lat: pts[1].lat + (pts[1].lat - pts[0].lat) * k, lng: pts[1].lng + (pts[1].lng - pts[0].lng) * k })
  }
  return pts
}
// 1) vias da pesquisa v1
for (const [nome, a, b, f] of VIAS) addTrecho('via-' + slug(nome), nome, geom((await osrm(pontosVia(a, b))).routes[0]), f)
// 2) ruas locais: onde as alternativas de cada rota-modelo divergem (geometria real do OSRM)
function divergente(a, b, pad) {
  const flag = a.map((p) => distPoli(p, b) > 80)
  let melhor = [0, -1], ini = -1
  for (let i = 0; i <= flag.length; i++) {
    if (flag[i] && ini < 0) ini = i
    if (!flag[i] && ini >= 0) { if (i - 1 - ini > melhor[1] - melhor[0]) melhor = [ini, i - 1]; ini = -1 }
  }
  return a.slice(Math.max(0, melhor[0] - pad), Math.min(a.length, melhor[1] + 1 + pad))
}
const FORTE = { 'julia-centro': 1, 'trabalho-centro-compensa': 1 }
for (const [id, , , , , seguraIdx] of MODELOS) {
  const alts = altsBrutas[id]
  if (alts.length < 2) continue
  const [iS, iP] = seguraIdx === 1 ? [1, 0] : [0, 1]
  const nS = divergente(alts[iS].coords, alts[iP].coords, 6)
  const nP = divergente(alts[iP].coords, alts[iS].coords, 6)
  addTrecho(`local-${id}-seguro`, `Via principal — ${bairroDe(nS[Math.floor(nS.length / 2)])}`, nS, FORTE[id] ? [0.92, 0.9, 0.1] : [0.8, 0.75, 0.2])
  addTrecho(`local-${id}-escuro`, `Ruas internas — ${bairroDe(nP[Math.floor(nP.length / 2)])}`, nP, FORTE[id] ? [0.1, 0.12, 0.95] : [0.22, 0.25, 0.82])
}
for (const [nome, a, b, f] of EXTRA) addTrecho('extra-' + slug(nome), nome, geom((await osrm([ll(a), ll(b)])).routes[0]), f)
// 3) corredores v2: luz/movimento do JSON; risco derivado
const RISCO_COR = { boa: { alto: 0.25, medio: 0.3 }, regular: { alto: 0.4, medio: 0.45 } }
const NIV = { luz: { boa: 0.8, regular: 0.5 }, mov: { alto: 0.8, medio: 0.55 } }
for (const c of J.corredores) {
  const a = ll(c.inicio), b = ll(c.fim)
  const j = await osrmOuNulo(pontosVia(c.inicio, c.fim))
  let g = j ? geom(j.routes[0]) : [a, b]
  if (comprimento(g) > 3 * Math.max(dist(a, b), 300) + 700) g = [a, b]
  const f = [NIV.luz[c.iluminacao], NIV.mov[c.movimento], RISCO_COR[c.iluminacao][c.movimento]]
  addTrecho('corr-' + slug(c.nome), c.nome, g, f, ehUrl(c.fonte) ? 'pesquisa' : 'estimativa', bairroOuProximo(c.bairro, g[Math.floor(g.length / 2)]))
}
// 4) pontos críticos: trechos de 250-600 m centrados no ponto (eixo provável = melhor de 4 direções via OSRM)
function janela(g, p, meia) {
  const ac = [0]
  for (let i = 1; i < g.length; i++) ac.push(ac[i - 1] + dist(g[i - 1], g[i]))
  let k = 0
  g.forEach((q, i) => { if (dist(q, p) < dist(g[k], p)) k = i })
  return g.filter((_, i) => Math.abs(ac[i] - ac[k]) <= meia)
}
let criticosDescartados = 0
for (const pc of J.pontosCriticos) {
  const p = { lat: pc.lat, lng: pc.lng }
  let melhor = null
  for (const ang of [0, 45, 90, 135]) {
    const dx = Math.cos((ang * Math.PI) / 180) * 300, dy = Math.sin((ang * Math.PI) / 180) * 300
    const j = await osrmOuNulo([desloca(p, -dx, -dy), desloca(p, dx, dy)])
    if (!j) continue
    const g = geom(j.routes[0])
    const d = distPoli(p, g), len = comprimento(g)
    if (len > 1800 || d > 90) continue
    const custo = d + 0.05 * len
    if (!melhor || custo < melhor.custo) melhor = { g, custo }
  }
  const w = melhor && janela(melhor.g, p, 300)
  if (!w || w.length < 2 || comprimento(w) < 200) { criticosDescartados++; continue }
  addTrecho('crit-' + slug(pc.nome), pc.nome, w, FCRIT[pc.tipo] ?? [0.35, 0.35, 0.75], ehUrl(pc.fonte) ? 'pesquisa' : 'estimativa', bairroOuProximo(pc.bairro, p))
}
// 5) bairros sem trecho: via principal (melhor) e ruas internas (pior), conforme os fatores do bairro
for (const a of areas) {
  if (trechos.some((t) => t.bairro === a.bairro)) continue
  const esp = Math.min(350, a.raioM * 0.5)
  const tracos = [
    ['principal', 'Via principal', [-esp, 0], [esp, 0], [0.12, 0.12, -0.12]],
    ['internas', 'Ruas internas', [-esp * 0.6, esp * 0.45], [esp * 0.6, esp * 0.5], [-0.15, -0.2, 0.15]],
  ]
  for (const [k, rotulo, o, d, dl] of tracos) {
    const pa = desloca(a.centro, ...o), pb = desloca(a.centro, ...d)
    const j = await osrmOuNulo([pa, pb])
    let g = j ? geom(j.routes[0]) : [pa, pb]
    if (comprimento(g) > 3 * dist(pa, pb)) g = [pa, pb]
    addTrecho(`sint-${k}-${slug(a.bairro)}`, `${rotulo} — ${a.bairro}`, g, [a.luz + dl[0], a.fluxo + dl[1], a.risco + dl[2]], a.fonte, a.bairro)
  }
}

// ---------- relatos semente ----------
const { linhas: rel, autores } = gerarRelatos({ json: J, areas, trechos })
const refMs = Date.parse(REFERENCIA)
const tuplas = rel.map((r) => [r.alvoId, r.lat, r.lng, r.tipo, autores.indexOf(r.autor), Math.round((refMs - r.t) / 60000), r.comentario])

// ---------- escrita ----------
const w = (arq, src) => writeFileSync(join(SAIDA, arq), src)
const lista = (tipo, nome, arr) => `${CAB}${imp(tipo)}\nexport const ${nome}: ${tipo}[] = [\n${linhas(arr)},\n]\n`
w('areas.ts', lista('Area', 'areas', areas))
w('trechos.ts', lista('Trecho', 'trechos', trechos))
w('apoio.ts', lista('PontoApoio', 'pontosApoio', pontosApoio))
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
w('comunidadeSemente.ts', `${CAB}// Relatos fictícios: autores e comentários não são de pessoas reais. Datas relativas a REFERENCIA (fixa).
import type { Avaliacao, TipoAvaliacao } from '../domain/tipos'

export const REFERENCIA = '${REFERENCIA}'
const AUTORES = ${JSON.stringify(autores)}
type Linha = [alvoId: string, lat: number, lng: number, tipo: TipoAvaliacao, autor: number, minutosAtras: number, comentario: string]
const LINHAS: Linha[] = [\n${linhas(tuplas)},\n]

const refMs = Date.parse(REFERENCIA)
export const avaliacoesSemente: Avaliacao[] = LINHAS.map(([alvoId, lat, lng, tipo, autor, min, comentario], i) => ({
  id: \`semente-\${String(i + 1).padStart(4, '0')}\`,
  alvoId,
  tipo,
  coord: { lat, lng },
  criadoEm: new Date(refMs - min * 60_000).toISOString(),
  ...(comentario ? { comentario } : {}),
  autorId: \`semente-\${autor}\`,
  autorNome: AUTORES[autor],
  semente: true,
}))
`)
const zonas = {}
for (const t of trechos) { const z = areas.find((a) => a.bairro === t.bairro)?.zona; zonas[z] = (zonas[z] || 0) + 1 }
const tp = {}
rel.forEach((r) => (tp[r.tipo] = (tp[r.tipo] || 0) + 1))
console.log(JSON.stringify({ areas: areas.length, trechos: trechos.length, zonas, apoio: pontosApoio.length, lugares: lugares.length, relatos: rel.length, tp, criticosDescartados }))
