// gera relatos semente determinísticos (PRNG semeado, data de referência fixa) — dados fictícios
import { mulberry32, pontoAoLongo, comprimento, desloca, slug } from './util.mjs'

export const REFERENCIA = '2026-10-15T23:00:00.000Z'
const NOMES = ['Ana', 'Marcos', 'Juliana', 'Carlos', 'Rafaela', 'Diego', 'Tatiane', 'Paulo', 'Beatriz', 'Eduardo', 'Larissa', 'Bruno', 'Camila', 'Rodrigo', 'Fernanda', 'Lucas', 'Patrícia', 'Thiago', 'Vanessa', 'Gustavo', 'Aline', 'Felipe', 'Daniela', 'Renato', 'Mariana', 'Igor', 'Letícia', 'Sérgio', 'Priscila', 'André', 'Cláudia', 'Mateus', 'Simone', 'Jonas', 'Elaine', 'Wellington', 'Rosana', 'Cleber', 'Luana', 'Davi']
const INICIAIS = 'ABCDEFGHJLMNOPRSTV'
const NEG = /queimad|apagad|nenhuma luz|sem luz|escur|escuridão|piscando|tapando|fiação|sem poste|só um poste|fraca|lanterna|regular em|as travessas|na sombra|caiu|deserta|vazi|poucos carros|cedo|só tem muro|demorando|parado|feriado|a travessa/i

export function gerarRelatos({ json, areas, trechos, total = 340, seed = 20261015 }) {
  const rnd = mulberry32(seed)
  const int = (n) => Math.floor(rnd() * n)
  const escolhe = (arr) => arr[int(arr.length)]
  const pond = (itens, peso) => {
    let r = rnd() * itens.reduce((s, x) => s + peso(x), 0)
    for (const x of itens) { r -= peso(x); if (r <= 0) return x }
    return itens[itens.length - 1]
  }
  // autores: 80 combinações únicas "Nome X."
  const autores = []
  const usados = new Set()
  while (autores.length < 80) {
    const n = `${escolhe(NOMES)} ${INICIAIS[int(INICIAIS.length)]}.`
    if (!usados.has(n)) { usados.add(n); autores.push(n) }
  }
  // modelos de comentário coerentes com o tipo (voto luz/fluxo = positivo; problema = atenção)
  const pool = { luz: [], fluxo: [], atencao: [] }
  for (const r of json.relatos) (r.tipo !== 'atencao' && NEG.test(r.texto) ? pool.atencao : pool[r.tipo]).push(r.texto)

  const alvos = []
  for (const t of trechos) {
    const peso = t.id.startsWith('crit-') ? 4 : t.id.startsWith('local-') ? 3.2 : t.id.startsWith('sint-') ? 0.35 + t.fluxo : 1 + 3 * t.fluxo
    alvos.push({ kind: 'trecho', id: t.id, nome: t.nome, luz: t.luz, risco: t.risco, peso, ref: t })
  }
  for (const a of areas) alvos.push({ kind: 'area', id: a.id, nome: a.bairro, luz: a.luz, risco: a.risco, peso: 0.25 + a.fluxo, ref: a })
  const ponto = (al) => {
    if (al.kind === 'trecho') return pontoAoLongo(al.ref.coords, rnd() * comprimento(al.ref.coords))
    const ang = rnd() * 2 * Math.PI, d = Math.sqrt(rnd()) * al.ref.raioM * 0.6
    return desloca(al.ref.centro, Math.cos(ang) * d, Math.sin(ang) * d)
  }
  const tipoPara = (al) => {
    if (al.id.endsWith("-escuro")) return rnd() < 0.95 ? "atencao" : "fluxo"
    if (al.id.endsWith("-seguro")) return rnd() < 0.5 ? "luz" : "fluxo"
    const ruim = al.risco * 0.6 + (1 - al.luz) * 0.4
    const p = ruim >= 0.55 ? [['atencao', 0.78], ['fluxo', 0.14], ['luz', 0.08]] : ruim <= 0.4 ? [['luz', 0.42], ['fluxo', 0.45], ['atencao', 0.13]] : [['atencao', 0.4], ['luz', 0.3], ['fluxo', 0.3]]
    return pond(p, (x) => x[1])[0]
  }
  const ms = Date.parse(REFERENCIA)
  const data = () => {
    const dia = int(120)
    const base = ms - dia * 864e5
    // 70% à noite local (UTC-4 -> 22h..03h UTC), resto de dia
    const hUtc = rnd() < 0.7 ? (22 + int(6)) % 24 : 11 + int(10)
    const d = new Date(base); d.setUTCHours(hUtc, int(60), 0, 0)
    let t = d.getTime()
    if (hUtc < 6 && hUtc >= 0) t += 864e5
    while (t > ms) t -= 864e5
    return t
  }
  const celula = (c) => `cel:${c.lat.toFixed(3)}:${c.lng.toFixed(3)}`
  const linhas = []
  const vistos = new Set()
  const garantidos = alvos.filter((a) => a.id.startsWith('local-')).flatMap((a) => [a, a, a, a, a, a, a, a])
  for (let i = 0; i < total; i++) {
    let al = i < garantidos.length ? garantidos[i] : pond(alvos, (x) => x.peso)
    let alvoId = al.id, coord = ponto(al)
    if (i >= garantidos.length && rnd() < 0.09) {
      const c = desloca(coord, (rnd() - 0.5) * 400, (rnd() - 0.5) * 400)
      coord = c; alvoId = celula(c)
    }
    const tipo = tipoPara(al)
    let comentario = ''
    if (rnd() < 0.7) {
      for (let k = 0; k < 6 && !comentario; k++) {
        const txt = escolhe(pool[tipo]).replaceAll('{local}', al.nome)
        if (!vistos.has(alvoId + txt)) { vistos.add(alvoId + txt); comentario = txt }
      }
    }
    const autor = escolhe(autores)
    linhas.push({ alvoId, tipo, lat: +coord.lat.toFixed(5), lng: +coord.lng.toFixed(5), t: data(), autor, comentario })
  }
  linhas.sort((a, b) => a.t - b.t)
  return { linhas, autores, refId: slug('ref') }
}
